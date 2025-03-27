import {
  ClientModel,
  prisma,
  TripDetailsHasCityModel,
  TripDetailsModel,
} from "@/data/postgres";
import type {
  GetReservationsDto,
  TripDetailsDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { PdfService, ReservationType } from "@/lib";
import { getTravelItineraryReport } from "@/report";
import { TripDetailsMapper } from "./tripDetails.mapper";
import { ApiResponse } from "../response";
import { TripDetailsEntity } from "@/domain/entities";
import { HotelReportPDF } from "@/report/pdf-reports/report.hotel.pdf";

export class TripDetailsService {
  constructor(
    private tripDetailsMapper: TripDetailsMapper,
    private pdfService: PdfService,
    private hotelReportPDF: HotelReportPDF
  ) {}

  public async upsertTripDetails(tripDetailsDto: TripDetailsDto) {
    const clientExists = await ClientModel.findUnique({
      where: { id: tripDetailsDto.clientId },
    });

    if (!clientExists) throw CustomError.notFound("Client not found");

    this.tripDetailsMapper.setDto = tripDetailsDto;

    const [_, tripDetails] = await prisma
      .$transaction([
        TripDetailsHasCityModel.deleteMany({
          where: { trip_details_id: tripDetailsDto.id },
        }),
        TripDetailsModel.upsert({
          where: {
            version_number_quotation_id: {
              version_number: tripDetailsDto.versionQuotationId!.versionNumber,
              quotation_id: tripDetailsDto.versionQuotationId!.quotationId,
            },
          },
          create: this.tripDetailsMapper.toUpsert,
          update: this.tripDetailsMapper.toUpsert,
          include: this.tripDetailsMapper.toSelectInclude,
        }),
      ])
      .catch((error) => {
        throw CustomError.internalServer(`${error}`);
      });

    return new ApiResponse<TripDetailsEntity>(
      200,
      (tripDetailsDto.id === 0
        ? "Detalles del viaje creados"
        : "Detalles del viaje actualizados") + " correctamente",
      TripDetailsEntity.fromObject(tripDetails)
    );
  }

  public async getTripDetailsById(id: number) {
    const tripDetails = await TripDetailsModel.findUnique({
      where: { id },
      include: this.tripDetailsMapper.toSelectInclude,
    });
    if (!tripDetails) throw CustomError.notFound("Trip details not found");
    return new ApiResponse<TripDetailsEntity>(
      200,
      "Detalles del viaje encontrados",
      TripDetailsEntity.fromObject(tripDetails)
    );
  }

  public async getTripDetailsByVersionQuotationId(
    versionQuotationIDDto: VersionQuotationIDDto
  ) {
    const tripDetails = await TripDetailsModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number:
            versionQuotationIDDto.versionQuotationId!.versionNumber,
          quotation_id: versionQuotationIDDto.versionQuotationId!.quotationId,
        },
      },
      include: this.tripDetailsMapper.toSelectInclude,
    });
    if (!tripDetails) throw CustomError.notFound("Trip details not found");
    return new ApiResponse<TripDetailsEntity>(
      200,
      "Detalles del viaje encontrados",
      TripDetailsEntity.fromObject(tripDetails)
    );
  }

  public async getTripDetails({ versionQuotationId }: GetReservationsDto) {
    const whereCondition = versionQuotationId
      ? {
          OR: [
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

    const tripDetails = await TripDetailsModel.findMany({
      where: whereCondition,
      include: this.tripDetailsMapper.toSelectInclude,
    });

    return new ApiResponse<TripDetailsEntity[]>(
      200,
      "Detalles del viaje encontrados",
      tripDetails.map(TripDetailsEntity.fromObject)
    );
  }

  public async generatePdf(id: number) {
    const TripDetailsQuery = await TripDetailsModel.findMany({
      where: { id: id},
      omit: {
        client_id: true,
      },
      include: {
        client: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        hotel_room_trip_details: {
          orderBy: {
            date: "asc",
          },
          include: {
            hotel_room: {
              include: {
                hotel: {},
              },
            },
          },
        },
        version_quotation: {
          omit: {
            created_at: true,
            updated_at: true,
          },
          include: {
            quotation: {
              omit: {
                created_at: true,
                updated_at: true,
              },
            },
            user: {
              omit: {
                id_role: true,
                password: true,
                online: true,
              },
            },
          },
          
        },
        
      },
    });

    
    const pdfGenerated = await this.hotelReportPDF.generateReport({
      title: "",
      subTitle: "",
      dataQuey: TripDetailsQuery,
    });

    const pdf = await this.pdfService.createPdf(pdfGenerated);
    return pdf;
  }





  public async getAll() {
    const data = await TripDetailsModel.findMany({
      where: { id: 2 },
      select: {
        id: true,
        number_of_people: true,
        start_date: true,
        end_date: true,
        traveler_style: true,

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
        hotel_room_trip_details: {
          select: {
            id: true,
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

    return data;
  }

  async sendServiceEmail(data: ReservationType) {}
}


