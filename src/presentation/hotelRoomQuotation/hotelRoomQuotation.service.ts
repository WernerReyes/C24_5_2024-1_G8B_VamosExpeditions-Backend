import type {
  UpdateManyHotelRoomQuotationsByDateDto,
  GetHotelRoomQuotationsDto,
  HotelRoomQuotationDto,
  InsertManyHotelRoomQuotationsDto,
} from "@/domain/dtos";
import type { HotelRoomQuotationMapper } from "./hotelRoomQuotation.mapper";
import type { HotelRoomQuotationResponse } from "./hotelRoomQuotation.response";
import {
  HotelRoomModel,
  HotelRoomQuotationModel,
  VersionQuotationModel,
} from "@/data/postgres";
import { CustomError } from "@/domain/error";
import {
  HotelRoomQuotation,
  HotelRoomQuotationEntity,
} from "@/domain/entities";
import { DateUtils } from "@/core/utils";

export class HotelRoomQuotationService {
  constructor(
    private readonly hotelRoomQuotationMapper: HotelRoomQuotationMapper,
    private readonly hotelRoomQuotationResponse: HotelRoomQuotationResponse
  ) {}

  public async createHotelRoomQuotation(
    hotelRoomQuotationDto: HotelRoomQuotationDto
  ) {
    try {
      this.hotelRoomQuotationMapper.setDto = hotelRoomQuotationDto;

      const existHotelRoomQuotation = await HotelRoomQuotationModel.findUnique({
        where: {
          hotel_room_id_date_quotation_id_version_number: {
            hotel_room_id: hotelRoomQuotationDto.hotelRoomId,
            version_number:
              hotelRoomQuotationDto.versionQuotationId.versionNumber,
            quotation_id: hotelRoomQuotationDto.versionQuotationId.quotationId,
            date: hotelRoomQuotationDto.date,
          },
        },
      });

      if (existHotelRoomQuotation)
        throw CustomError.badRequest(
          "Ya existe una habitación cotizada para este día"
        );

      //* Validate if the date is within the range of the quotation
      await this.validateDateRange(hotelRoomQuotationDto);

      const hotelRoomExists = await HotelRoomModel.findUnique({
        where: { id_hotel_room: hotelRoomQuotationDto.hotelRoomId },
      });

      if (!hotelRoomExists)
        throw CustomError.notFound("Habitación no encontrada");

      const hotelRoomQuotation = await HotelRoomQuotationModel.create({
        data: this.hotelRoomQuotationMapper.toCreate,
        include: this.hotelRoomQuotationMapper.toSelectInclude,
      });

      return this.hotelRoomQuotationResponse.createdHotelRoomQuotation(
        hotelRoomQuotation
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer(`${error}`);
    }
  }

  public async insertManyHotelRoomQuotations(
    insertManyHotelRoomQuotationsDto: InsertManyHotelRoomQuotationsDto
  ) {
    const hotelRoomQuotations: HotelRoomQuotationEntity[] = [];
    const skippedDays: number[] = [];

    const diffTimeInDays =
      Math.abs(
        insertManyHotelRoomQuotationsDto.dateRange[1].getTime() -
          insertManyHotelRoomQuotationsDto.dateRange[0].getTime()
      ) /
        (1000 * 60 * 60 * 24) +
      1; //* Add 1 to include the last day

    console.log({ diffTimeInDays });

    const date = new Date(insertManyHotelRoomQuotationsDto.dateRange[0]);

    try {
      for (let i = 0; i < diffTimeInDays; i++) {
        try {
          const { data } = await this.createHotelRoomQuotation({
            hotelRoomId: insertManyHotelRoomQuotationsDto.hotelRoomId,
            versionQuotationId:
              insertManyHotelRoomQuotationsDto.versionQuotationId,
            date,
            numberOfPeople: insertManyHotelRoomQuotationsDto.numberOfPeople,
          });

          hotelRoomQuotations.push(data);
        } catch (error) {
          if (
            error instanceof CustomError &&
            error.message.includes(
              "Ya existe una habitación cotizada para este día"
            )
          ) {
            skippedDays.push(date.getDate());
          } else {
            throw CustomError.internalServer(`${error}`);
          }
        }

        date.setDate(date.getDate() + 1);
      }

      //* Check if all days were skipped
      if (skippedDays.length === diffTimeInDays) {
        throw CustomError.badRequest(
          `No se pudo insertar ninguna habitación cotizada: ya existen cotizaciones para todos los días (${skippedDays.join(
            ", "
          )})`
        );
      }

      return this.hotelRoomQuotationResponse.createdManyHotelRoomQuotations(
        hotelRoomQuotations
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateManyHotelRoomQuotationsByDate({
    versionQuotationId,
    startDate,
  }: UpdateManyHotelRoomQuotationsByDateDto) {
    const hotelRoomQuotations = await HotelRoomQuotationModel.findMany({
      where: {
        version_number: versionQuotationId?.versionNumber,
        quotation_id: versionQuotationId?.quotationId,
        date: {
          gt: startDate,
        },
      },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    });

    if (hotelRoomQuotations.length === 0)
      throw CustomError.notFound(
        `No se encontraron cotizaciones de habitaciones para el día ${startDate}`
      );

    const updatedHotelRoomQuotations: HotelRoomQuotation[] = [];

    for (let i = 0; i < hotelRoomQuotations.length; i++) {
      const newDate = new Date(hotelRoomQuotations[i].date);
      newDate.setDate(newDate.getDate() - 1);
      const updatedHotelRoomQuotation = await HotelRoomQuotationModel.update({
        where: {
          id_hotel_room_quotation:
            hotelRoomQuotations[i].id_hotel_room_quotation,
        },
        data: { date: newDate },
        include: this.hotelRoomQuotationMapper.toSelectInclude,
      });

      updatedHotelRoomQuotations.push(updatedHotelRoomQuotation);
    }

    return this.hotelRoomQuotationResponse.updatedManyHotelRoomQuotations(
      updatedHotelRoomQuotations
    );
  }

  public async deleteHotelRoomQuotation(id: number) {
    const hotelRoomQuotation = await HotelRoomQuotationModel.findUnique({
      where: { id_hotel_room_quotation: id },
    });

    if (!hotelRoomQuotation)
      throw CustomError.notFound("Cotización de habitación no encontrada");

    const hotelRoomQuotationDeleted = await HotelRoomQuotationModel.delete({
      where: { id_hotel_room_quotation: id },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    });

    return this.hotelRoomQuotationResponse.deletedHotelRoomQuotation(
      hotelRoomQuotationDeleted
    );
  }

  public async deleteManyHotelRoomQuotations(ids: number[]) {
    const hotelRoomQuotations = await HotelRoomQuotationModel.findMany({
      where: { id_hotel_room_quotation: { in: ids } },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    });

    if (hotelRoomQuotations.length === 0)
      throw CustomError.notFound("Cotizaciones de habitaciones no encontradas");

    await HotelRoomQuotationModel.deleteMany({
      where: { id_hotel_room_quotation: { in: ids } },
    });

    return this.hotelRoomQuotationResponse.deletedManyHotelRoomQuotations(
      hotelRoomQuotations
    );
  }

  public async getHotelRoomQuotations({
    versionQuotationId,
  }: GetHotelRoomQuotationsDto) {
    const hotelRoomsQuotation = await HotelRoomQuotationModel.findMany({
      where: {
        version_number: versionQuotationId?.versionNumber,
        quotation_id: versionQuotationId?.quotationId,
      },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return this.hotelRoomQuotationResponse.foundHotelRoomsQuotation(
      hotelRoomsQuotation
    );
  }

  private async validateDateRange(
    hotelRoomQuotationDto: HotelRoomQuotationDto
  ) {
    const dateRange = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number:
            hotelRoomQuotationDto.versionQuotationId.versionNumber,
          quotation_id: hotelRoomQuotationDto.versionQuotationId.quotationId,
        },
      },
      select: {
        reservation: {
          select: {
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (!dateRange) throw CustomError.notFound("Cotización no encontrada");

    if (!dateRange.reservation)
      throw CustomError.notFound("La cotización no tiene una reserva");

    const currentDate = DateUtils.resetTimeToMidnight(
      hotelRoomQuotationDto.date
    );
    const startDate = DateUtils.resetTimeToMidnight(
      dateRange.reservation.start_date
    );
    const endDate = DateUtils.resetTimeToMidnight(
      dateRange.reservation.end_date
    );
    
    if (
      currentDate.getTime() < startDate.getTime() ||
      currentDate.getTime() > endDate.getTime()
    ) {
      throw CustomError.badRequest(
        "La fecha no puede ser menor a la fecha de inicio o mayor a la fecha de fin de la cotización"
      );
    }
  }
}
