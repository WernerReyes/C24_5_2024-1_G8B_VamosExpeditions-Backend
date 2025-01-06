import { Validations } from "@/core/utils";
import { CityEntity } from "./city.entity";
import { CustomError } from "../error";

export class DistritEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string
  ) {}

  public static fromObject(object: { [key: string]: any }): DistritEntity {
    const { id_distrit, name, city_id } = object;
    const error = Validations.validateEmptyFields({
      id_distrit,
      name,
      city_id,
    });
    if (error) throw CustomError.badRequest(error);

    return new DistritEntity(id_distrit, name);
  }
}
