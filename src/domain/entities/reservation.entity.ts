import type { reservation } from "@prisma/client";
import type { TripDetails } from "./tripDetails.entity";

export type Reservation = reservation & {
  trip_details?: TripDetails;
};

export enum ReservationStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export class ReservationEntity {
  constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly status: ReservationStatus,
    public readonly tripDetails?: TripDetails
  ) {}

  public static fromObject(reservation: Reservation): ReservationEntity {
    const { id, created_at, updated_at, status } = reservation;
    return new ReservationEntity(
      +id,
      new Date(created_at),
      new Date(updated_at),
      status as ReservationStatus
    );
  }
}
