import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { city, country } from "@prisma/client";
import { CountryEntity } from "./country.entity";

export type City = city & {
  country: country;
};
export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country: CountryEntity
  ) {}

  public static fromObject(city: City): CityEntity {
    const { id_city, name, country } = city;

    const error = Validations.validateEmptyFields({
      id_city,
      name,
      country,
    });
    if (error) throw CustomError.badRequest(error);

    return new CityEntity(id_city, name, CountryEntity.fromObject(country));
  }

  public static validateEntity(
    entity: CityEntity,
    from: string
  ): string | null {
    const { id, name, country } = entity;

    const countryError = CountryEntity.validateEntity(
      country,
      `${from}, CityEntity`
    );
    if (countryError) return countryError;

    return Validations.validateEmptyFields(
      {
        id,
        name,
        country,
      },
      `${from}, CityEntity`
    );
  }
}
