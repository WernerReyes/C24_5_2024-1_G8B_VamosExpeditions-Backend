import type { Prisma } from "@prisma/client";
import type { GetReservationsDto, ReservationDto } from "@/domain/dtos";
import {
  ReservationStatusEnum,
  VersionQuotationStatusEnum,
} from "@/infrastructure/models";
import { ParamsUtils } from "@/core/utils";

type Dto = ReservationDto | GetReservationsDto;

export class ReservationMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toSelect(): Prisma.reservationSelect | undefined {
    const { select } = this.dto as GetReservationsDto;
    if (!select) return this.select;

    return this.parseDBSelectAdapted(select);
  }

  private parseDBSelectAdapted(
    select: string[]
  ): Prisma.reservationSelect | undefined {
    const parsedSelect =
      ParamsUtils.parseDBSelect<Prisma.reservationSelect>(select);

    if (parsedSelect) {
      return {
        ...parsedSelect,
        quotation: {
          ...(typeof parsedSelect.quotation === "object" &&
          parsedSelect.quotation.select != null
            ? {
                ...parsedSelect.quotation,
                select: {
                  ...parsedSelect.quotation.select,
                  version_quotation: {
                    ...(parsedSelect.quotation as any).select.version_quotation,

                    where: {
                      official: true,
                      OR: [
                        { status: VersionQuotationStatusEnum.APPROVED },
                        {
                          status: VersionQuotationStatusEnum.CANCELATED,
                        },
                      ],
                    },
                    orderBy: { version_number: "desc" },
                    take: 1,
                  },
                },
              }
            : {}),
        },
      };
    }
    return undefined;
  }

  private get select(): Prisma.reservationSelect {
    return {
      id: true,
      status: true,
      created_at: true,
      updated_at: true,
      is_deleted: true,
      deleted_at: true,
      delete_reason: true,
      quotation_id: true,
      quotation: {
        select: {
          id_quotation: true,
          version_quotation: {
            where: {
              official: true,
              OR: [
                { status: VersionQuotationStatusEnum.APPROVED },
                {
                  status: VersionQuotationStatusEnum.CANCELATED,
                },
              ],
            },
            orderBy: { version_number: "desc" },
            take: 1,
            select: {
              quotation_id: true,
              version_number: true,
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
                  client_id: true,
                  client: {
                    select: {
                      id: true,
                      fullName: true,
                      country: true,
                      subregion: true,
                      email: true,
                      phone: true,
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
      },
    };
  }

  public get createReservation(): Prisma.reservationCreateInput {
    this.dto = this.dto as ReservationDto;
    return {
      status: ReservationStatusEnum.PENDING,
      quotation: { connect: { id_quotation: this.dto.quotationId } },
      updated_at: new Date(),
    };
  }

  public get getReservationsWhere(): Prisma.reservationWhereInput {
    this.dto = this.dto as GetReservationsDto;
    return {
      status: this.dto.status ? { in: this.dto.status } : undefined,
      quotation: this.dto.quotationName
        ? {
            version_quotation: {
              some: {
                name: {
                  contains: this.dto.quotationName,
                  mode: "insensitive",
                },
                official: true,
              },
            },
          }
        : undefined,
      is_deleted: this.dto.isDeleted,
      created_at: this.dto.createdAt ? { gte: this.dto.createdAt } : undefined,
      updated_at: this.dto.updatedAt ? { gte: this.dto.updatedAt } : undefined,
    };
  }

  public get toSelectInclude(): Prisma.reservationInclude {
    return {
      quotation: {
        include: {
          version_quotation: {
            where: {
              official: true,
              OR: [
                { status: VersionQuotationStatusEnum.APPROVED },
                {
                  status: VersionQuotationStatusEnum.CANCELATED,
                },
              ],
            },
            orderBy: { version_number: "desc" },
            take: 1,
            include: {
              trip_details: {
                include: {
                  client: {
                    select: {
                      id: true,
                      fullName: true,
                      country: true,
                      subregion: true,
                      email: true,
                      phone: true,
                    },
                  },
                  trip_details_has_city: {
                    include: {
                      city: {
                        select: {
                          id_city: true,
                          name: true,
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
      },
    };
  }
}
