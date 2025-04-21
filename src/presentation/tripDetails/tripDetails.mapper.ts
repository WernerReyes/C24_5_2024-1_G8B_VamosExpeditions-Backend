import { TripDetailsDto } from "@/domain/dtos";
import type {
  Prisma,
  trip_details_order_type,
  trip_details_traveler_style
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

type Dto = TripDetailsDto;

export class TripDetailsMapper {
  
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toUpsert(): Prisma.trip_detailsUncheckedCreateInput {
    this.dto = this.dto as TripDetailsDto;
    return {
      quotation_id: this.dto.versionQuotationId.quotationId,
      version_number: this.dto.versionQuotationId.versionNumber,
      number_of_people: this.dto.numberOfPeople,
      start_date: this.dto.startDate,
      end_date: this.dto.endDate,
      client_id: this.dto.clientId,
      traveler_style: this.dto
        .travelerStyle as any as trip_details_traveler_style,
      order_type: this.dto.orderType as any as trip_details_order_type,
      additional_specifications: this.dto.specialSpecifications,
      code: this.dto.code,
      trip_details_has_city: {
        create: Object.keys(this.dto.destination).map((key) => ({
          city_id: +key,
        })),
      },
    };
  }

  public get toSelectInclude(): Prisma.trip_detailsInclude<DefaultArgs> {
    return {
      trip_details_has_city: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
      version_quotation: true,
      client: true,
    };
  }
}
