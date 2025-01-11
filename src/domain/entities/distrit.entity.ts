import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { HotelEntity } from "./hotel.entity";

export class DistritEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly hotel?: HotelEntity[]
  ) {}

  public static fromObject(object: { [key: string]: any }): DistritEntity {
    const { id_distrit, name, accommodation } = object;
    /* console.log(object) */
    const error = Validations.validateEmptyFields({
      id_distrit,
      name,
    });
    if (error) throw CustomError.badRequest(error);

   
    return new DistritEntity(
      id_distrit,
      name,
      accommodation
        ? accommodation.map((hotel: HotelEntity) =>
            HotelEntity.fromObject(hotel)
          )
        : undefined
    );
  }
}
