import { PdfService } from "@/lib";
import { ReservationMapper } from "./reservation.mapper";
import {
  GetReservationsDto,
  GetStadisticsDto,
  ReservationDto,
} from "@/domain/dtos";
import {
  prisma,
  QuotationModel,
  ReservationModel,
  ReservationVersionSummaryView,
  VersionQuotationModel,
} from "@/data/postgres";
import { CustomError } from "@/domain/error";
import {
  ReservationEntity,
  ReservationStatus,
  VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import { ApiResponse, PaginatedResponse } from "../response";

export class ReservationService {
  constructor(
    private reservationMapper: ReservationMapper,
    private pdfService: PdfService
  ) {}

  public async upsertReservation(
    reservationDto: ReservationDto
  ): Promise<ApiResponse<ReservationEntity>> {
    this.reservationMapper.setDto = reservationDto;

    const reservationUpserted = await prisma.$transaction(async () => {
      const findQuotation = await QuotationModel.findUnique({
        where: { id_quotation: reservationDto.quotationId },
        include: {
          version_quotation: {
            where: {
              // status: VersionQuotationStatus.COMPLETED,
              OR: [
                {
                  status: VersionQuotationStatus.APPROVED,
                },
                {
                  status: VersionQuotationStatus.COMPLETED,
                },
                {
                  status: VersionQuotationStatus.CANCELATED
                }
              ],
              //  VersionQuotationStatus.APPROVED
              official: true,
            },
          },
        },
      });

      if (!findQuotation)
        throw CustomError.notFound("No existe la cotización a reservar");

      if (findQuotation.version_quotation.length === 0)
        throw CustomError.badRequest(
          "No existe una cotización completada y oficial"
        );

      const existingReservation = await ReservationModel.findUnique({
        where: { id: reservationDto.id },
      });

      let reservationUpserted;

      if (existingReservation) {
        reservationUpserted = await ReservationModel.update({
          where: { id: reservationDto.id },
          data: {
            status: reservationDto.status,
          },
          include: this.reservationMapper.toSelectInclude,
        });
      } else {
        reservationUpserted = await ReservationModel.create({
          data: this.reservationMapper.createReservation,
          include: this.reservationMapper.toSelectInclude,
        }).catch((error) => {
          if (error.code === "P2014") {
            throw CustomError.badRequest(
              "Ya existe una reservación para esta cotización"
            );
          }
          throw CustomError.badRequest(error.message);
        });
      }

      const version = findQuotation.version_quotation[0];

      const versionUpdated = await VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: version.version_number,
            quotation_id: version.quotation_id,
          },
        },
        data: { status: VersionQuotationStatus.APPROVED },
        include: {
          user: true,
          trip_details: {
            include: {
              client: true,
            },
          },
        },
      });

      return {
        ...reservationUpserted,
        quotation: {
          ...reservationUpserted.quotation,
          version_quotation: [versionUpdated],
        },
      };
    });

    return new ApiResponse<ReservationEntity>(
      200,
      (reservationDto.id === 0
        ? "Reservación creada"
        : "Reservación actualizada") + " correctamente",
      await ReservationEntity.fromObject(reservationUpserted)
    );
  }

  public async cancelReservation(
    id: number
  ): Promise<ApiResponse<ReservationEntity>> {
    const reservation = await ReservationModel.findUnique({
      where: { id },
      include: this.reservationMapper.toSelectInclude,
    });
    if (!reservation) throw CustomError.notFound("Reservación no encontrada");
    if (reservation.status === ReservationStatus.REJECTED)
      throw CustomError.badRequest("La reservación ya fue rechazada");

    const reservationCanceled = await prisma.$transaction(async () => {
      const reservationCanceled = await ReservationModel.update({
        where: { id },
        data: { status: ReservationStatus.REJECTED },
        include: this.reservationMapper.toSelectInclude,
      });

      const versionToCancel = (reservationCanceled.quotation as any)
        .version_quotation[0];

      const versionCanceled = await VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: versionToCancel.version_number,
            quotation_id: versionToCancel.quotation_id,
          },
        },
        data: { status: VersionQuotationStatus.CANCELATED },
      });

      return {
        ...reservationCanceled,
        quotation: {
          ...reservationCanceled.quotation,
          version_quotation: [
            {
              ...(reservationCanceled.quotation as any).version_quotation[0],
              status: VersionQuotationStatus.CANCELATED,
            },
          ],
        },
      };
    });

    return new ApiResponse<ReservationEntity>(
      200,
      "Reservación cancelada correctamente",
      await ReservationEntity.fromObject(reservationCanceled)
    );
  }

  public async getReservations(
    getReservationsDto: GetReservationsDto
  ): Promise<ApiResponse<PaginatedResponse<ReservationEntity>>> {
    this.reservationMapper.setDto = getReservationsDto;

    const { page, limit } = getReservationsDto;
    const offset = (page - 1) * limit;

    const reservations = await ReservationModel.findMany({
      where: this.reservationMapper.getReservationsWhere,
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit,
      include: this.reservationMapper.toSelectInclude,
    });

    const totalReservations = await ReservationModel.count({
      where: this.reservationMapper.getReservationsWhere,
    });

    return new ApiResponse<PaginatedResponse<ReservationEntity>>(
      200,
      "Reservaciones encontradas",
      new PaginatedResponse(
        await Promise.all(reservations.map(ReservationEntity.fromObject)),
        page,
        Math.ceil(totalReservations / limit),
        totalReservations,
        limit
      )
    );
  }

  public async deleteMultipleReservations(ids: number[]) {
    const reservations = await ReservationModel.findMany({
      where: { id: { in: ids } },
      include: this.reservationMapper.toSelectInclude,
    });

    if (reservations.length === 0)
      throw CustomError.notFound("Reservaciones no encontradas");

    await prisma.$transaction(async () => {
      await ReservationModel.deleteMany({
        where: { id: { in: ids } },
      });

      await VersionQuotationModel.deleteMany({
        where: {
          quotation_id: {
            in: reservations.map(
              (reservation) => reservation.quotation.id_quotation
            ),
          },
        },
      });

      await QuotationModel.deleteMany({
        where: {
          id_quotation: {
            in: reservations.map(
              (reservation) => reservation.quotation.id_quotation
            ),
          },
        },
      });
    });

    return new ApiResponse<ReservationEntity[]>(
      204,
      `${
        reservations.length === 1 ? "Reservación" : "Reservaciones"
      } eliminada${reservations.length === 1 ? "" : "s"} correctamente`,
      await Promise.all(reservations.map(ReservationEntity.fromObject))
    );
  }

  public async getStadistics({ year }: GetStadisticsDto) {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const totalPricesPerMonth = await ReservationVersionSummaryView.groupBy({
      by: ["reservation_date"],
      where: {
        reservation_status: ReservationStatus.ACTIVE,
        reservation_date: year
          ? {
              gte: new Date(year, 0, 1),
              lte: new Date(year, 11, 31),
            }
          : undefined,
      },

      _sum: { final_price: true },
      _avg: { profit_margin: true },
      _count: { id: true },
      orderBy: { reservation_date: "asc" },
    });

 
    const formattedPricesPerMonth = months.map((month, index) => {
      //* Get all reservations for the given month
      const monthPrices = totalPricesPerMonth.filter(
        (price) =>
          price?.reservation_date && price.reservation_date.getMonth() === index
      );

      //* Sum final_price, average profit_margin, and count trips
      const totals = monthPrices.reduce(
        (acc, price) => {
          acc.totalIncome += Number(price._sum?.final_price) ?? 0;
          acc.totalMargin += Number(price._avg?.profit_margin) ?? 0;
          acc.totalTrips += Number(price._count?.id) ?? 0;
          acc.totalEntries++;
          return acc;
        },
        { totalIncome: 0, totalMargin: 0, totalTrips: 0, totalEntries: 0 }
      );
 
      return {
        month,
        income: totals.totalIncome.toFixed(2),
        margin:
          totals.totalEntries > 0
            ? (totals.totalMargin / totals.totalEntries).toFixed(0)
            : "0",
        trips: totals.totalTrips,
      };
    });

    return new ApiResponse(
      200,
      "Estadísticas encontradas",
      formattedPricesPerMonth
    );
  }

  public async getStats() {
    const [totalPendingQuotations, { totalActive, totalMargin, totalIncome }] =
      await Promise.all([
        await this.getTotalDraftsVersionQuotation(),
        await this.getAggregateReservationsActive(),
      ]).catch((error) => {
        throw CustomError.internalServer(error.message);
      });

    return new ApiResponse(200, "Estadísticas encontradas", {
      totalActive,
      totalPendingQuotations,
      totalMargin,
      totalIncome,
    });
  }

  private async getTotalDraftsVersionQuotation() {
    const {
      firstDayCurrentMonth,
      firstDayPreviousMonth,
      lastDayPreviousMonth,
    } = await this.getCurrentDayMonth();

    //* Count drafts for the current month
    const currentMonthDrafts = await VersionQuotationModel.count({
      where: {
        status: VersionQuotationStatus.DRAFT,
        created_at: {
          gte: firstDayCurrentMonth,
        },
      },
    });

    //* Count drafts for the previous month
    const previousMonthDrafts = await VersionQuotationModel.count({
      where: {
        status: VersionQuotationStatus.DRAFT,
        created_at: {
          gte: firstDayPreviousMonth,
          lte: lastDayPreviousMonth,
        },
      },
    });

    const totalDrafts = await VersionQuotationModel.count({
      where: {
        status: VersionQuotationStatus.DRAFT,
      },
    });

    return {
      total: totalDrafts.toFixed(0),
      totalCurrentMonth: currentMonthDrafts.toFixed(0),
      totalPreviousMonth: previousMonthDrafts.toFixed(0),
      increase: (currentMonthDrafts - previousMonthDrafts).toFixed(0),
    };
  }

  private async getAggregateReservationsActive() {
    const {
      firstDayCurrentMonth,
      firstDayPreviousMonth,
      lastDayPreviousMonth,
    } = await this.getCurrentDayMonth();

    //* Sum final_price for the current month
    const finalPriceCurrentMonth =
      await ReservationVersionSummaryView.aggregate({
        where: {
          reservation_status: ReservationStatus.ACTIVE,
          reservation_date: {
            gte: firstDayCurrentMonth,
          },
        },
        _count: { id: true },
        _avg: { profit_margin: true },
        _sum: { final_price: true },
      });

    //* Sum final_price for the previous month
    const finalPriceMonthDrafts = await ReservationVersionSummaryView.aggregate(
      {
        where: {
          reservation_status: ReservationStatus.ACTIVE,
          reservation_date: {
            gte: firstDayPreviousMonth,
            lte: lastDayPreviousMonth,
          },
        },
        _count: { id: true },
        _avg: { profit_margin: true },
        _sum: { final_price: true },
      }
    );

    const total = await ReservationVersionSummaryView.aggregate({
      where: {
        reservation_status: ReservationStatus.ACTIVE,
      },
      _count: { id: true },
      _avg: { profit_margin: true },
      _sum: { final_price: true },
    });

    return {
      totalActive: {
        total: Number(total._count.id).toFixed(0),
        totalCurrentMonth: Number(finalPriceCurrentMonth._count.id).toFixed(0),
        totalPreviousMonth: Number(finalPriceMonthDrafts._count.id).toFixed(0),
        increase: (
          Number(finalPriceCurrentMonth._count.id) -
          Number(finalPriceMonthDrafts._count.id)
        ).toFixed(0),
      },

      totalIncome: {
        total: Number(total._sum.final_price).toFixed(2),
        totalCurrentMonth: Number(
          finalPriceCurrentMonth._sum.final_price
        ).toFixed(2),
        totalPreviousMonth: Number(
          finalPriceMonthDrafts._sum.final_price
        ).toFixed(2),
        increase: (
          Number(finalPriceCurrentMonth._sum.final_price) -
          Number(finalPriceMonthDrafts._sum.final_price)
        ).toFixed(0),
      },

      totalMargin: {
        total: Number(total._avg.profit_margin).toFixed(0),
        totalCurrentMonth: Number(
          finalPriceCurrentMonth._avg.profit_margin
        ).toFixed(0),
        totalPreviousMonth: Number(
          finalPriceMonthDrafts._avg.profit_margin
        ).toFixed(0),
        increase: (
          Number(finalPriceCurrentMonth._avg.profit_margin) -
          Number(finalPriceMonthDrafts._avg.profit_margin)
        ).toFixed(0),
      },
    };
  }

  private async getCurrentDayMonth() {
    const now = new Date();

    //* First day of the current month
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    //* First and last day of the previous month
    const firstDayPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
      firstDayCurrentMonth,
      firstDayPreviousMonth,
      lastDayPreviousMonth,
    };
  }
}
