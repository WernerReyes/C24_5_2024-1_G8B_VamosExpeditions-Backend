import { ParamsUtils, Validations } from "@/core/utils";
import { ServiceDto, type GetServicesDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = GetServicesDto | ServiceDto;

const FROM = "ServiceMapper";
export class ServiceMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }
  public get toSelect(): Prisma.serviceSelect | undefined {
    this.validateModelInstance(this.dto, "toSelect");
    const { select } = this.dto as GetServicesDto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.serviceSelect {
    return {
      id: true,
      description: true,
      distrit: true,
      created_at: true,
      updated_at: true,
      duration: true,
      passengers_max: true,
      passengers_min: true,
      price_pen: true,
      price_usd: true,
      rate_pen: true,
      rate_usd: true,
      service_type: true,
      tax_igv_pen: true,
      tax_igv_usd: true,
    };
  }

  public get filters(): Prisma.serviceWhereInput {
    this.validateModelInstance(this.dto, "filters");
    this.dto = this.dto as GetServicesDto;

    return {
      distrit: {
        city_id: this.dto.cityId,
      },
      service_type_id: this.dto.serviceTypeId,
      description: this.dto.description
        ? {
            contains: this.dto.description.trim(),
            mode: "insensitive",
          }
        : undefined,
    };
  }

  public get createService(): Prisma.serviceCreateInput {
    this.dto = this.dto as ServiceDto;

    return {
      description: this.dto.description,
      duration: this.dto.duration,
      passengers_min: this.dto.passengersMin,
      passengers_max: this.dto.passengersMax,
      price_usd: this.dto.priceUsd,
      tax_igv_usd: this.dto.taxIgvUsd,
      rate_usd: this.dto.rateUsd,
      price_pen: this.dto.pricePen,
      tax_igv_pen: this.dto.taxIgvPen,
      rate_pen: this.dto.ratePen,
      created_at: new Date(),
      distrit: {
        connect: { id_distrit: this.dto.districtId },
      },
      service_type: {
        connect: { id: this.dto.serviceTypeId },
      },
    };
  }

  public get updateService(): Prisma.serviceUpdateInput {
    this.dto = this.dto as ServiceDto;

    return {
      description: this.dto.description,
      duration: this.dto.duration,
      passengers_min: this.dto.passengersMin,
      passengers_max: this.dto.passengersMax,
      price_usd: this.dto.priceUsd,
      tax_igv_usd: this.dto.taxIgvUsd,
      rate_usd: this.dto.rateUsd,
      price_pen: this.dto.pricePen,
      tax_igv_pen: this.dto.taxIgvPen,
      rate_pen: this.dto.ratePen,
      updated_at: new Date(),
      distrit: {
        connect: { id_distrit: this.dto.districtId },
      },
      service_type: {
        connect: { id: this.dto.serviceTypeId },
      },
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
