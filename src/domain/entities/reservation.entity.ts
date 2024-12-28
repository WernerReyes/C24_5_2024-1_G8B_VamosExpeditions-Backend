import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { LocationEntity } from "./Location.entity";

export class ReservationEntity {
  constructor(
    public readonly clientId: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly comfortClass: string,
    public readonly cities: LocationEntity[],
    public readonly specialSpecifications?: string
  ) {}

  public static fromObject(object: { [key: string]: any }): ReservationEntity {
    const {
      reservation_has_city,
      clientId,
      number_of_people,
      start_date,
      end_date,
      code,
      comfort_level,
      additional_specifications,
    } = object;

    // Validación de campos vacíos
    const error = Validations.validateEmptyFields({
      clientId,
      numberOfPeople: number_of_people,
      startDate: start_date,
      endDate: end_date,
      code,
      comfortClass: comfort_level,
      specialSpecifications: additional_specifications,
    });

    if (error) throw CustomError.badRequest(error);

    // Crear y retornar la entidad de reserva
    return new ReservationEntity(
      clientId,
      +number_of_people,
      new Date(start_date),
      new Date(end_date),
      code,
      comfort_level,
      reservation_has_city.map((city: any) => LocationEntity.fromObject(city.city)),
      additional_specifications || undefined
    );
  }
}
