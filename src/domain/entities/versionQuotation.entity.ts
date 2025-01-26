import { Validations } from "@/core/utils";
import { version_quotation, hotel_room_quotation } from '@prisma/client';
import { CustomError } from "../error";
import { Reservation, ReservationEntity } from "./reservation.entity";
import { User, UserEntity } from "./user.entity";
import { Quotation, QuotationEntity } from "./quotation.entity";
import { HotelRoomQuotationEntity } from "./hotelRoomQuotation.entity";

export enum QuotationStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type VersionQuotation = version_quotation & {
  user?: User;
  reservation?: Reservation | null;
  quotation?: Quotation;
  hotel_room_quotation?: hotel_room_quotation[];
};

export class VersionQuotationEntity {
  constructor(
    public readonly id: {
      versionNumber: number;
      quotationId: number;
    },
    public readonly status: QuotationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly official: boolean = false,
    public readonly indirectCostMargin?: number,
    public readonly profitMargin?: number,
    public readonly totalCost?: number,
    public readonly finalPrice?: number,
    public readonly reservation?: ReservationEntity,
    public readonly user?: UserEntity,
    public readonly quotation?: QuotationEntity,
    public readonly hotelRoomsQuotation?: HotelRoomQuotationEntity[]
  ) {}

  public static fromObject(
    versionQuotation: VersionQuotation
  ): VersionQuotationEntity {
    const {
      version_number,
      quotation_id,
      status,
      official,
      created_at,
      updated_at,
      indirect_cost_margin,
      profit_margin,
      total_cost,
      final_price,
      reservation,
      user,
      quotation,
      hotel_room_quotation,
    } = versionQuotation;

    const error = Validations.validateEmptyFields({
      version_number,
      status,
      created_at,
      updated_at,
    });

    if (error) throw CustomError.badRequest(error);

    return new VersionQuotationEntity(
      {
        versionNumber: +version_number,
        quotationId: +quotation_id,
      },
      status as QuotationStatus,
      created_at,
      updated_at,
      official,
      indirect_cost_margin ? Number(indirect_cost_margin) : undefined,
      profit_margin ? Number(profit_margin) : undefined,
      total_cost ? Number(total_cost) : undefined,
      final_price ? Number(final_price) : undefined,
      reservation ? ReservationEntity.fromObject(reservation) : undefined,
      user ? UserEntity.fromObject(user) : undefined,
      quotation ? QuotationEntity.fromObject(quotation) : undefined,
      hotel_room_quotation ? hotel_room_quotation.map(HotelRoomQuotationEntity.fromObject) : undefined
    );
  }
}
