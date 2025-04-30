import { type version_quotation, type partner } from "@prisma/client";
import { type Quotation } from "./quotation.entity";
import { TripDetails, TripDetailsEntity } from "./tripDetails.entity";
import { type User, UserEntity } from "./user.entity";
import { ReservationEntity } from "./reservation.entity";
import { PartnerEntity } from "./partner.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELATED = "CANCELATED",
  APPROVED = "APPROVED",
}

export enum AllowVersionQuotationType {
  TRANSPORTATION = "TRANSPORTATION",
  ACTIVITY = "ACTIVITY",
  ACCOMMODATION = "ACCOMMODATION",
  FOOD = "FOOD",
  GUIDE = "GUIDE",
}

export type VersionQuotation = version_quotation & {
  user?: User;
  trip_details?: TripDetails | null;
  quotation?: Quotation;
  partners?: partner | null;
};

export class VersionQuotationEntity {
  constructor(
    public readonly id: {
      versionNumber: number;
      quotationId: number;
    },
    public readonly name: string,
    public readonly status: VersionQuotationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly official: boolean,
    public readonly completionPercentage: number,
    public readonly indirectCostMargin?: number,
    public readonly profitMargin?: number,
    public readonly finalPrice?: number,
    public readonly commission?: number,
    public readonly tripDetails?: TripDetailsEntity,
    public readonly user?: UserEntity,
    public readonly reservation?: ReservationEntity,
    public readonly partner?: PartnerEntity,

    public readonly hasVersions: boolean = false,

    public readonly isDeleted: boolean = false,
    public readonly deletedAt?: Date,
    public readonly deletedReason?: string
  ) {}

  public static async fromObject(
    versionQuotation: VersionQuotation
  ): Promise<VersionQuotationEntity> {
    const {
      version_number,
      name,
      quotation_id,
      completion_percentage,
      status,
      official,
      created_at,
      updated_at,
      indirect_cost_margin,
      profit_margin,
      final_price,
      commission,
      trip_details,
      user,
      quotation,
      partners,

      is_deleted,
      delete_reason,
      deleted_at,
    } = versionQuotation;

    return new VersionQuotationEntity(
      {
        versionNumber: +version_number,
        quotationId: +quotation_id,
      },
      name,
      status as VersionQuotationStatus,
      created_at,
      updated_at,
      official,
      Number(completion_percentage),
      indirect_cost_margin ? Number(indirect_cost_margin) : undefined,
      profit_margin ? Number(profit_margin) : undefined,
      final_price ? Number(final_price) : undefined,
      commission ? Number(commission) : undefined,
      trip_details
        ? await TripDetailsEntity.fromObject(trip_details)
        : undefined,
      user ? await UserEntity.fromObject(user) : undefined,
      official ? quotation?.reservation
        ? await ReservationEntity.fromObject(quotation.reservation)
        : undefined : undefined,
      partners ? PartnerEntity.fromObject(partners) : undefined,
      official &&
        (quotation?.version_quotation ?? []).filter(
          (version) => !version.official && !version.is_deleted
        ).length > 0,
      is_deleted,
      deleted_at ? new Date(deleted_at) : undefined,
      delete_reason ?? undefined
    );
  }
}
