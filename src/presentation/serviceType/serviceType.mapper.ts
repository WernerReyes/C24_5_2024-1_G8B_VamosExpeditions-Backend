import { ParamsUtils, Validations } from "@/core/utils";
import { type GetServiceTypesDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = GetServiceTypesDto;

const FROM = "ServiceTypeMapper";
export class ServiceTypeMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toSelect(): Prisma.service_typeSelect | undefined {
    this.validateModelInstance(this.dto, "toSelect");
    const { select } = this.dto as GetServiceTypesDto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.service_typeSelect {
    return {
      id: true,
      name: true,
      created_at: true,
      updated_at: true,
      service: true,
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}