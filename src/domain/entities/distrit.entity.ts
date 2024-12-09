import { Validations } from "@/core/utils";
import { CityEntity } from "./city.entity";
import { CustomError } from "../error";

export class DistritEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly city: CityEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): DistritEntity {
    const { city, id_distrit, name, city_id } = object;
    const error = Validations.validateEmptyFields({
      id_distrit,
      name,
      city_id,
      city,
    });
    if (error) throw CustomError.badRequest(error);

    const cityEntity = CityEntity.fromObject(city);

    return new DistritEntity(id_distrit, name, cityEntity);
  }
}
