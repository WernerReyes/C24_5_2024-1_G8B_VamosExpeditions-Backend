import type { reservation } from "@prisma/client";
import { VersionQuotationEntity } from "./versionQuotation.entity";
import { Quotation } from "./quotation.entity";
import { DateAdapter } from "@/core/adapters";

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
    public readonly versionQuotation?: VersionQuotationEntity,

    public readonly isArchived: boolean = false,
    public readonly archivedAt?: Date,
    public readonly archivedReason?: string
  ) {}

  public static async fromObject(
    reservation: Reservation
  ): Promise<ReservationEntity> {
    const {
      id,
      created_at,
      updated_at,
      status,
      quotation,
      is_archived,
      archive_reason,
      archived_at,
    } = reservation;
    return new ReservationEntity(
      +id,
      DateAdapter.parseISO(created_at),
      DateAdapter.parseISO(updated_at),
      status as ReservationStatus,
      quotation && quotation.version_quotation && quotation.version_quotation[0]
        ? await VersionQuotationEntity.fromObject(
            quotation.version_quotation[0]
          )
        : undefined,
      is_archived,
      archived_at ? DateAdapter.parseISO(archived_at) : undefined,
      archive_reason ?? undefined
    );
  }
}
