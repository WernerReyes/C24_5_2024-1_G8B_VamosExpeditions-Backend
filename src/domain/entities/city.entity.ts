import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CountryEntity } from "./country.entity";

export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): CityEntity {
    const { id_city, name, country } = object;

    if (!country) {
      return new CityEntity(id_city, name);
    }

    const countryEntity = CountryEntity.fromObject(country);

    return new CityEntity(id_city, name, countryEntity);
  }
}
