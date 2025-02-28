import { version_quotation } from '@prisma/client';
import { Quotation, QuotationEntity } from "./quotation.entity";
import { TripDetails, TripDetailsEntity } from "./tripDetails.entity";
import { User, UserEntity } from "./user.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export type VersionQuotation = version_quotation & {
  user?: User;
  trip_details?: TripDetails | null;
  quotation?: Quotation;
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
    public readonly tripDetails?: TripDetailsEntity,
    public readonly user?: UserEntity,
    public readonly quotation?: QuotationEntity,
  ) {}

  public static fromObject(
    versionQuotation: VersionQuotation
  ): VersionQuotationEntity {
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
      trip_details,
      user,
      quotation,
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
      trip_details ? TripDetailsEntity.fromObject(trip_details) : undefined,
      user ? UserEntity.fromObject(user) : undefined,
      quotation ? QuotationEntity.fromObject(quotation) : undefined,
      
    );
  }
}
