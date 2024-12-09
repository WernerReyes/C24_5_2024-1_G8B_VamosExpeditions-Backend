import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export class ReservationEntity {
  constructor(
    public readonly clientId: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly comfortClass: string,
    public readonly specialSpecifications?: string
  ) {}

  public static fromObject(object: { [key: string]: any }): ReservationEntity {
    const {
      clientId,
      number_of_people,
      start_date,
      end_date,
      code,
      comfort_level,
      additional_specifications,
    } = object;

    
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

    
    return new ReservationEntity(
      +clientId,
      +number_of_people,
      new Date(start_date),
      new Date(end_date),
      code,
      comfort_level,
      additional_specifications || undefined
    );
  }
}
