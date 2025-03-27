import { type DefaultArgs } from "@prisma/client/runtime/library";
import type {
  hotel_room_trip_details,
  Prisma,
  version_quotation_status,
} from "@prisma/client";
import type {
  DuplicateVersionQuotationDto,
  GetVersionQuotationsDto,
  VersionQuotationDto,
} from "@/domain/dtos";
import type { VersionQuotation } from "@/domain/entities";
import { Validations } from "@/core/utils";

type Dto =
  | DuplicateVersionQuotationDto
  | VersionQuotationDto
  | GetVersionQuotationsDto;

const FROM = "VersionQuotationMapper";

export class VersionQuotationMapper {
  private dto: Dto;
  private versionQuotation: VersionQuotation;

  constructor() {
    this.dto = {} as Dto;
    this.versionQuotation = {} as VersionQuotation;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public set setVersionQuotation(versionQuotation: VersionQuotation) {
    this.versionQuotation = versionQuotation;
  }

  public get findById(): Prisma.version_quotationFindUniqueArgs {
    this.validateModelInstance(this.dto, "findById");
    this.dto = this.dto as VersionQuotationDto | DuplicateVersionQuotationDto;

    return {
      where: {
        version_number_quotation_id: {
          version_number: this.dto.id.versionNumber,
          quotation_id: this.dto.id.quotationId,
        },
      },
    };
  }

  public get toUpdate(): Prisma.version_quotationUncheckedUpdateInput {
    this.validateModelInstance(this.dto, "toUpdate");
    const dto = this.dto as VersionQuotationDto;
    const defaultName =
      "Q-" +
      new Date().getFullYear() +
      "-" +
      dto.versionQuotationId?.quotationId;

    return {
      name:
        dto.name.trim().length > 0
          ? dto.name.toUpperCase().trim()
          : defaultName,
      indirect_cost_margin: dto.indirectCostMargin,
      profit_margin: dto.profitMargin,
      final_price: dto.finalPrice,
      completion_percentage: dto.completionPercentage,
      status: dto.status,
      updated_at: new Date(),
    };
  }

  public get toDuplicate(): Prisma.version_quotationUncheckedCreateInput {
    this.validateModelInstance(
      [this.versionQuotation, this.dto],
      "toDuplicate"
    );

    const dto = this.dto as DuplicateVersionQuotationDto;

    const { quotation, trip_details, user, ...rest } = this.versionQuotation;

    const maxVersion = quotation?.version_quotation?.reduce((prev, current) =>
      prev.version_number > current.version_number ? prev : current
    ).version_number;

    return {
      ...rest,
      user_id: dto.userId,
      status: this.versionQuotation.status,
      version_number: maxVersion! + 1,
      official: false,
      updated_at: new Date(),
      trip_details: trip_details
        ? {
            create: {
              number_of_people: trip_details.number_of_people,
              start_date: trip_details.start_date,
              end_date: trip_details.end_date,
              client_id: trip_details.client_id,
              traveler_style: trip_details.traveler_style,
              order_type: trip_details.order_type,
              additional_specifications: trip_details.additional_specifications,
              code: trip_details.code,
              trip_details_has_city: {
                create: trip_details?.trip_details_has_city?.map((city) => ({
                  city_id: city.city_id,
                })),
              },
              hotel_room_trip_details: {
                create: trip_details?.hotel_room_trip_details?.map(
                  (hotel: hotel_room_trip_details) => ({
                    hotel_room_id: hotel.hotel_room_id,
                    date: hotel.date,
                    number_of_people: hotel.number_of_people,
                  })
                ),
              },
            },
          }
        : undefined,
    };
  }

  public get getVersionsQuotationsWhere(): Prisma.version_quotationWhereInput {
    this.validateModelInstance(this.dto, "getVersionsQuotationsWhere");
    this.dto = this.dto as GetVersionQuotationsDto;
    return {
      official: this.dto.official,
      name: {
        contains: this.dto.name,
        mode: "insensitive",
      },
      quotation_id: this.dto.quotationId,
      trip_details: {
        client_id: this.dto.clientsIds
          ? { in: this.dto.clientsIds }
          : undefined,
        start_date: this.dto.startDate
          ? { gte: this.dto.startDate }
          : undefined,
        end_date: this.dto.endDate ? { lte: this.dto.endDate } : undefined,
      },
      status: this.dto.status
        ? { in: this.dto.status as version_quotation_status[] }
        : undefined,
      user_id: this.dto.representativesIds
        ? { in: this.dto.representativesIds }
        : undefined,
    };
  }

  public get toSelectInclude(): Prisma.version_quotationInclude<DefaultArgs> {
    return {
      user: {
        select: {
          id_user: true,
          fullname: true,
        },
      },
      trip_details: {
        select: {
          id: true,
          start_date: true,
          end_date: true,
          number_of_people: true,
          code: true,
          traveler_style: true,
          order_type: true,
          client: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              subregion: true,
              country: true,
            },
          },
        },
      },
      quotation: {
        select: {
          reservation: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    };
  }

  public get toInclude(): Prisma.version_quotationInclude<DefaultArgs> {
    return {
      user: {
        select: {
          id_user: true,
          fullname: true,
        },
      },
      trip_details: {
        include: {
          trip_details_has_city: {
            include: {
              city: {
                include: {
                  country: true,
                },
              },
            },
          },
          hotel_room_trip_details: {
            include: {
              hotel_room: {
                include: {
                  hotel: {
                    include: {
                      distrit: {
                        include: {
                          city: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          client: true,
        },
      },
      quotation: {
        select: {
          reservation: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
