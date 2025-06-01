import { ParamsUtils, Validations } from "@/core/utils";
import { type GetServicesDto} from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = GetServicesDto;

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
        distrit_id: this.dto.districtId,
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
