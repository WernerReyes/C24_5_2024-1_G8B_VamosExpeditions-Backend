import { type DefaultArgs } from "@prisma/client/runtime/library";
import type { Prisma, version_quotation_status } from "@prisma/client";
import type {
  DuplicateMultipleVersionQuotationDto,
  GetVersionQuotationsDto,
  VersionQuotationDto,
} from "@/domain/dtos";
import type { IVersionQuotationModel } from "@/infrastructure/models";
import { ParamsUtils, Validations } from "@/core/utils";

type Dto =
  | DuplicateMultipleVersionQuotationDto
  | VersionQuotationDto
  | GetVersionQuotationsDto;

type Model =
  | Partial<IVersionQuotationModel>
  | Partial<IVersionQuotationModel>[];

const FROM = "VersionQuotationMapper";

export class VersionQuotationMapper {
  private dto: Dto;
  private versionQuotation: Model;

  constructor() {
    this.dto = {} as Dto;
    this.versionQuotation = {} as Model;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public set setVersionQuotation(versionQuotation: Model) {
    this.versionQuotation = versionQuotation;
  }

  public get toSelect(): Prisma.version_quotationSelect | undefined {
    const { select } = this.dto as GetVersionQuotationsDto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.version_quotationSelect {
    return {
      version_number: true,
      quotation_id: true,
      name: true,
      indirect_cost_margin: true,
      profit_margin: true,
      final_price: true,
      completion_percentage: true,
      status: true,
      commission: true,
      created_at: true,
      updated_at: true,
      is_deleted: true,
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
      user: {
        select: {
          id_user: true,
          fullname: true,
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
      partners: {
        select: {
          id: true,
          name: true,
          created_at: true,
        },
      },
      delete_reason: true,
      deleted_at: true,
      official: true,
      partner_id: true,
      user_id: true,
    };
  }

  public get findById(): Prisma.version_quotationFindUniqueArgs {
    this.validateModelInstance(this.dto, "findById");
    this.dto = this.dto as VersionQuotationDto;

    return {
      where: {
        version_number_quotation_id: {
          version_number: this.dto.id.versionNumber,
          quotation_id: this.dto.id.quotationId,
        },
        AND: {
          // TODO: Check if this is needed and if it breaks anything
          is_deleted: false,
        },
      },
    };
  }

  public get toUpdate(): Prisma.version_quotationUncheckedUpdateInput {
    this.validateModelInstance(this.dto, "toUpdate");
    const dto = this.dto as VersionQuotationDto;

    console.log(dto)

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
      commission:  (dto?.commission ?? 0) <= 0 ? null : dto.commission,
      partner_id: dto.partnerId ? dto.partnerId : null,
      updated_at: new Date(),
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
      is_deleted: this.dto.isDeleted,
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
      created_at: this.dto.createdAt ? { gte: this.dto.createdAt } : undefined,
      updated_at: this.dto.updatedAt ? { gte: this.dto.updatedAt } : undefined,
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

      partners: true,
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
