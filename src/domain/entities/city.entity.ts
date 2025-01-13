import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { city, country } from "@prisma/client";
import { CountryEntity } from "./country.entity";

export type City = city & {
  country?: country;
};
export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity
  ) {}

  public static fromObject(city: City): CityEntity {
    const { id_city, name, country } = city;

    const error = Validations.validateEmptyFields({
      id_city,
      name,
    });
    if (error) throw CustomError.badRequest(error);

    return new CityEntity(
      id_city,
      name,
      country ? CountryEntity.fromObject(country) : undefined
    );
  }

  public static validateEntity(
    entity: CityEntity,
    from: string
  ): string | null {
    const { id, name, country } = entity;

    if (country) {
      const countryError = CountryEntity.validateEntity(
        country,
        `${from}, CityEntity`
      );
      if (countryError) return countryError;
    }

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
