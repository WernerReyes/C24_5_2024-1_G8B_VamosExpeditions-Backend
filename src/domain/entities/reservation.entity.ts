import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CityEntity } from "./city.entity";
import { ClientEntity } from "./client.entity";
import type {
  city,
  client,
  reservation,
  reservation_has_city,
} from "@prisma/client";

export type Reservation = reservation & {
  reservation_has_city: (reservation_has_city & {
    city: city;
  })[];
  client: client;
};

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export enum TravelerStyle {
  STANDARD = "STANDARD",
  COMFORT = "COMFORT",
  LUXUS = "LUXUS",
}

export enum OrderType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
}

export class ReservationEntity {
  constructor(
    public readonly id: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly travelerStyle: TravelerStyle,
    public readonly orderType: OrderType,
    public readonly status: ReservationStatus = ReservationStatus.PENDING,
    public readonly client: ClientEntity,
    public readonly cities: CityEntity[],
    public readonly specialSpecifications?: string
  ) {}

  public static fromObject(reservation: Reservation): ReservationEntity {
    const {
      id,
      reservation_has_city,
      client,
      number_of_people,
      start_date,
      end_date,
      code,
      traveler_style,
      order_type,
      additional_specifications,
      status,
    } = reservation;

    // Validación de campos vacíos
    const error = Validations.validateEmptyFields({
      id,
      client,
      number_of_people,
      start_date,
      end_date,
      code,
      traveler_style,
      order_type,
      additional_specifications,
      status,
    });

    if (error) throw CustomError.badRequest(error);

    const errorTravelerStyle = Validations.validateEnumValue(
      traveler_style,
      Object.values(TravelerStyle)
    );

    if (errorTravelerStyle) throw CustomError.badRequest(errorTravelerStyle);

    const errorOrderType = Validations.validateEnumValue(
      order_type,
      Object.values(OrderType)
    );

    if (errorOrderType) throw CustomError.badRequest(errorOrderType);

    const errorState = Validations.validateEnumValue(
      status,
      Object.values(ReservationStatus)
    );
    if (errorState) throw CustomError.badRequest(errorState);

    // Crear y retornar la entidad de reserva
    return new ReservationEntity(
      +id,
      +number_of_people,
      new Date(start_date),
      new Date(end_date),
      code,
      traveler_style as TravelerStyle,
      order_type as OrderType,
      status as ReservationStatus,
      ClientEntity.fromObject(client),
      reservation_has_city.map(({ city }) => CityEntity.fromObject(city)),

      additional_specifications || undefined
    );
  }
}
