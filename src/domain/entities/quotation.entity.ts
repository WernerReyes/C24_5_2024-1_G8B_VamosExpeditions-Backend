import type { quotation } from "@prisma/client";
import {
  type VersionQuotation,
  VersionQuotationEntity,
} from "./versionQuotation.entity";

import { type Reservation, ReservationEntity } from "./reservation.entity";

export type Quotation = quotation & {
  version_quotation?: VersionQuotation[];
  reservation?: Reservation | null;
};

export class QuotationEntity {
  private constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly versions?: VersionQuotationEntity[],
    public readonly reservation?: ReservationEntity
  ) {}

  public static async fromObject(quotation: Quotation): Promise<QuotationEntity> {
    const {
      id_quotation,
      created_at,
      updated_at,
      version_quotation,
      reservation,
    } = quotation;

    return new QuotationEntity(
      id_quotation,
      created_at,
      updated_at,
      version_quotation
        ? await Promise.all(version_quotation.map(VersionQuotationEntity.fromObject))
        : undefined,
      reservation ? await ReservationEntity.fromObject(reservation) : undefined
    );
  }
}
