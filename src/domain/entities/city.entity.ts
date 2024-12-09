import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CountryEntity } from "./country.entity";

export class CityEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly country: CountryEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): CityEntity {
    const { country, id_city, name, country_id } = object;
    const error = Validations.validateEmptyFields({
      id_city,
      name,
      country_id,
      country,
    });
    if (error) throw CustomError.badRequest(error);

    const countryEntity = CountryEntity.fromObject(object.country);

    return new CityEntity(id_city, name, countryEntity);
  }
}
