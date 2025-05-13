import {
  IReservationModel,
  ReservationStatusEnum,
} from "@/infrastructure/models";
import { VersionQuotationEntity } from "./versionQuotation.entity";

export class ReservationEntity {
  constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly status: ReservationStatusEnum,
    public readonly versionQuotation?: VersionQuotationEntity,

    public readonly isDeleted: boolean = false,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string
  ) {}

  public static async fromObject(reservation: {
    [key: string]: any;
  }): Promise<ReservationEntity> {
    const {
      id,
      created_at,
      updated_at,
      status,
      quotation,
      is_deleted,
      delete_reason,
      deleted_at,
    } = reservation as IReservationModel;
    return new ReservationEntity(
      +id,
      new Date(created_at),
      new Date(updated_at),
      status,
      quotation && quotation.version_quotation && quotation.version_quotation[0]
        ? await VersionQuotationEntity.fromObject(
            quotation.version_quotation[0]
          )
        : undefined,
      is_deleted,
      deleted_at ? new Date(deleted_at) : undefined,
      delete_reason ?? undefined
    );
  }
}
