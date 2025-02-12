import {
  ClientModel,
  prisma,
  ReservationHasCityModel,
  ReservationModel,
  VersionQuotationModel,
} from "@/data/postgres";
import { GetReservationsDto, ReservationDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";
import { ReservationMapper } from "./reservation.mapper";
import { EmailService, PdfService, ReservationType } from "@/lib";
import { getTravelItineraryReport } from "@/report";

export class ReservationService {
  constructor(
    private reservationMapper: ReservationMapper,
    private reservationResponse: ReservationResponse,
    private pdfService: PdfService
  ) {}

  public async upsertReservation(reservationDto: ReservationDto) {
    const clientExists = await ClientModel.findUnique({
      where: { id: reservationDto.client.id },
    });

    if (!clientExists) throw CustomError.notFound("Client not found");

    this.reservationMapper.setDto = reservationDto;

    const [_, reservation] = await prisma
      .$transaction([
        ReservationHasCityModel.deleteMany({
          where: { reservation_id: reservationDto.id },
        }),
        ReservationModel.upsert({
          where: { id: reservationDto.id },
          create: this.reservationMapper.toUpsert,
          update: this.reservationMapper.toUpsert,
          include: this.reservationMapper.toSelectInclude,
        }),
      ])
      .catch((error) => {
        throw CustomError.internalServer(`${error}`);
      });

    // try {
    //   const reservation = await ReservationModel.upsert({
    //     where: { id: reservationDto.id },
    //     create: this.reservationMapper.toUpsert,
    //     update: this.reservationMapper.toUpsert,
    //     include: this.reservationMapper.toSelectInclude,
    //   });

    return this.reservationResponse.reservationUpserted(
      reservation,
      reservationDto.id
    );
    // } catch (error) {
    //   console.log("error", error);
    //   throw CustomError.internalServer(`${error}`);
    // }
  }

  public async getReservationById(id: number) {
    const reservation = await ReservationModel.findUnique({
      where: { id },
      include: this.reservationMapper.toSelectInclude,
    });
    if (!reservation) throw CustomError.notFound("Reservation not found");
    return this.reservationResponse.reservationFound(reservation);
  }

  public async getReservations({
    status,
    versionQuotationId,
  }: GetReservationsDto) {
    try {
      const whereCondition =
        status || versionQuotationId
          ? {
              OR: [
                ...(status ? [{ status: status as any }] : []),
                ...(versionQuotationId
                  ? [
                      {
                        version_quotation: {
                          quotation_id: {
                            equals: versionQuotationId.quotationId,
                          },
                          version_number: {
                            equals: versionQuotationId.versionNumber,
                          },
                        },
                      },
                    ]
                  : []),
              ],
            }
          : {}; // Si no hay filtros, se usa un objeto vacío para traer todo

      const reservations = await ReservationModel.findMany({
        where: whereCondition,
        include: this.reservationMapper.toSelectInclude,
      });
      return this.reservationResponse.reservationsFound(reservations);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async generatePdf(id: number) {
    const data = await ReservationModel.findMany({
      where: { id: id },
      select: {
        id: true,
        number_of_people: true,
        start_date: true,
        end_date: true,
        traveler_style: true,
        status: true,
        order_type: true,
        additional_specifications: true,
        code: true,
        client: {
          select: {
            id: true,
            fullName: true,
            country: true,
            email: true,
            phone: true,
            subregion: true,
          },
        },
        version_quotation: {
          select: {
            indirect_cost_margin: true,
            profit_margin: true,
            final_price: true,
            status: true,
            official: true,
            quotation: {
              select: {
                id_quotation: true,
              },
            },
            hotel_room_quotation: {
              orderBy: {
                date: "asc",
              },
              select: {
                id_hotel_room_quotation: true,
                number_of_people: true,
                date: true,
                hotel_room: {
                  select: {
                    id_hotel_room: true,
                    room_type: true,
                    price_pen: true,
                    price_usd: true,
                    rate_usd: true,
                    capacity: true,
                    hotel: {
                      select: {
                        id_hotel: true,
                        name: true,
                        category: true,
                        address: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id_user: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    const docDefinition = getTravelItineraryReport({
      title: "Resumen rápidonnn",
      subTitle: "Rolando Casapaico",
      data: data,
    });

    const pdf = await this.pdfService.createPdf(docDefinition);
    return pdf;
  }

  public async getall() {
    const data = await ReservationModel.findMany({
      where: { id: 2 },
      select: {
        id: true,
        number_of_people: true,
        start_date: true,
        end_date: true,
        traveler_style: true,
        status: true,
        order_type: true,
        additional_specifications: true,
        code: true,
        client: {
          select: {
            id: true,
            fullName: true,
            country: true,
            email: true,
            phone: true,
            subregion: true,
          },
        },
        version_quotation: {
          select: {
            indirect_cost_margin: true,
            profit_margin: true,
            final_price: true,
            status: true,
            official: true,
            quotation: {
              select: {
                id_quotation: true,
              },
            },
            hotel_room_quotation: {
              select: {
                id_hotel_room_quotation: true,
                number_of_people: true,
                date: true,
                hotel_room: {
                  select: {
                    id_hotel_room: true,
                    room_type: true,
                    price_pen: true,
                    price_usd: true,
                    rate_usd: true,
                    capacity: true,

                    hotel: {
                      select: {
                        id_hotel: true,
                        name: true,
                        category: true,
                        address: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id_user: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    /*    const data = await VersionQuotationModel.findMany({
      where: {
        reservation: {
          id: 2,
        },
      },
      include: {
        reservation: {
          include: {
            client: true,
          },
        },
        quotation: true,
        hotel_room_quotation: {
          include: {
            hotel_room: {
              include: {
                hotel: true,
              },
            },
          },
        },
      },
    }); */

    return data;
  }

  async sendServiceEmail(data: ReservationType) {
    
    
  }
}
