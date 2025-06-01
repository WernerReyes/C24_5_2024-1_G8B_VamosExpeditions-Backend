import type { IServiceModel } from "@/infrastructure/models";
import { DistritEntity } from "./distrit.entity";
import { ServiceTypeEntity } from "./serviceType.entity";

export class ServiceEntity {
  constructor(
    public readonly id: number,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly duration?: string,
    public readonly passengersMin?: number,
    public readonly passengersMax?: number,
    public readonly priceUsd?: number,
    public readonly taxIgvUsd?: number,
    public readonly rateUsd?: number,
    public readonly pricePen?: number,
    public readonly taxIgvPen?: number,
    public readonly ratePen?: number,
    public readonly district?: DistritEntity,
    public readonly serviceType?: ServiceTypeEntity
  ) {}

  public static async fromObject(service: {
    [key: string]: any;
  }): Promise<ServiceEntity> {
    const {
      id,
      description,
      duration,
      passengers_min,
      passengers_max,
      price_usd,
      tax_igv_usd,
      rate_usd,
      price_pen,
      tax_igv_pen,
      rate_pen,
      created_at,
      updated_at,
      distrit,
      service_type,
    } = service as IServiceModel;

    return new ServiceEntity(
      id,
      description,
      created_at,
      updated_at,
      duration ?? undefined,
      passengers_min ?? undefined,
      passengers_max ?? undefined,
      price_usd ? Number(price_usd) : undefined,
      tax_igv_usd ? Number(tax_igv_usd) : undefined,
      rate_usd ? Number(rate_usd) : undefined,
      price_pen ? Number(price_pen) : undefined,
      tax_igv_pen ? Number(tax_igv_pen) : undefined,
      rate_pen ? Number(rate_pen) : undefined,
      distrit ? await DistritEntity.fromObject(distrit) : undefined,
      service_type
        ? await ServiceTypeEntity.fromObject(service_type)
        : undefined
    );
  }
}
