import type {
  IVersionQuotationModel,
  VersionQuotationStatusEnum,
} from "@/infrastructure/models";
import { PartnerEntity } from "./partner.entity";
import { ReservationEntity } from "./reservation.entity";
import { TripDetailsEntity } from "./tripDetails.entity";
import { UserEntity } from "./user.entity";

export class VersionQuotationEntity {
  constructor(
    public readonly id: {
      versionNumber: number;
      quotationId: number;
    },
    public readonly name: string,
    public readonly status: VersionQuotationStatusEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly official: boolean,
    public readonly isDeleted: boolean,
    public readonly hasVersions: boolean,
    public readonly completionPercentage: number,
    public readonly indirectCostMargin?: number,
    public readonly profitMargin?: number,
    public readonly finalPrice?: number,
    public readonly commission?: number,
    public readonly tripDetails?: TripDetailsEntity,
    public readonly user?: UserEntity,
    public readonly reservation?: ReservationEntity,
    public readonly partner?: PartnerEntity,

    public readonly deletedAt?: Date,
    public readonly deleteReason?: string
  ) {}

  public static async fromObject(versionQuotation: {
    [key: string]: any;
  }): Promise<VersionQuotationEntity> {
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
    } = versionQuotation as IVersionQuotationModel;

    return new VersionQuotationEntity(
      {
        versionNumber: +version_number,
        quotationId: +quotation_id,
      },
      name,
      status,
      created_at,
      updated_at,
      official,
      is_deleted,
      official &&
        (quotation?.version_quotation ?? []).filter(
          (version) => !version.official && !version.is_deleted
        ).length > 0,
      completion_percentage && Number(completion_percentage),
      indirect_cost_margin ? Number(indirect_cost_margin) : undefined,
      profit_margin ? Number(profit_margin) : undefined,
      final_price ? Number(final_price) : undefined,
      commission ? Number(commission) : undefined,
      trip_details
        ? await TripDetailsEntity.fromObject(trip_details)
        : undefined,
      user ? ((await UserEntity.fromObject(user)) as UserEntity) : undefined,
      official
        ? quotation?.reservation
          ? await ReservationEntity.fromObject(quotation.reservation)
          : undefined
        : undefined,
      partners ? PartnerEntity.fromObject(partners) : undefined,
      deleted_at ? new Date(deleted_at) : undefined,
      delete_reason ?? undefined
    );
  }
}
