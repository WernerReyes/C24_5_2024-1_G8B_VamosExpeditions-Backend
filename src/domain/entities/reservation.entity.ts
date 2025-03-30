import type { reservation } from "@prisma/client";
import {
  VersionQuotationEntity,
} from "./versionQuotation.entity";
import { Quotation } from "./quotation.entity";

export type Reservation = reservation & {
  quotation?: Quotation;
};

export enum ReservationStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
}

export class ReservationEntity {
  constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly status: ReservationStatus,
    public readonly versionQuotation?: VersionQuotationEntity
  ) {}

  public static fromObject(reservation: Reservation): ReservationEntity {
    const { id, created_at, updated_at, status, quotation } = reservation;
    return new ReservationEntity(
      +id,
      new Date(created_at),
      new Date(updated_at),
      status as ReservationStatus,
      quotation && quotation.version_quotation && quotation.version_quotation[0]
        ? VersionQuotationEntity.fromObject(quotation.version_quotation[0])
        : undefined
    );
  }
}
