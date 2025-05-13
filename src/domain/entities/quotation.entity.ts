import { VersionQuotationEntity } from "./versionQuotation.entity";

import type { IQuotationModel } from "@/infrastructure/models";
import { ReservationEntity } from "./reservation.entity";
export class QuotationEntity {
  private constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly versions?: VersionQuotationEntity[],
    public readonly reservation?: ReservationEntity
  ) {}

  public static async fromObject(quotation: {
    [key: string]: any;
  }): Promise<QuotationEntity> {
    const {
      id_quotation,
      created_at,
      updated_at,
      version_quotation,
      reservation,
    } = quotation as IQuotationModel;

    return new QuotationEntity(
      id_quotation,
      created_at,
      updated_at,
      version_quotation
        ? await Promise.all(
            version_quotation.map(VersionQuotationEntity.fromObject)
          )
        : undefined,
      reservation ? await ReservationEntity.fromObject(reservation) : undefined
    );
  }
}
