import type { Prisma } from "@prisma/client";
import type { GetReservationsDto, ReservationDto } from "@/domain/dtos";
import { ReservationStatus, VersionQuotationStatus } from "@/domain/entities";

type Dto = ReservationDto | GetReservationsDto;

export class ReservationMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createReservation(): Prisma.reservationCreateInput {
    this.dto = this.dto as ReservationDto;
    return {
      status: ReservationStatus.PENDING,
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
                { status: VersionQuotationStatus.APPROVED },
                {
                  status: VersionQuotationStatus.CANCELATED,
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
