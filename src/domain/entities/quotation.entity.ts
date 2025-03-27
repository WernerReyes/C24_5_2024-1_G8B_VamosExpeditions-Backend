import type { quotation } from "@prisma/client";
import {
  type VersionQuotation,
  VersionQuotationEntity,
} from "./versionQuotation.entity";
import { Validations } from "@/core/utils";
import { CustomError } from "../error";
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

  public static fromObject(quotation: Quotation): QuotationEntity {
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
        ? version_quotation.map(VersionQuotationEntity.fromObject)
        : undefined,
      reservation ? ReservationEntity.fromObject(reservation) : undefined
    );
  }
}
