import { CountryEntity } from "./country.entity";

export class LocationEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): LocationEntity {
    const { id_city, name, country } = object;

    if (!country) {
      return new LocationEntity(id_city, name);
    }

    const countryEntity = CountryEntity.fromObject(country);

    return new LocationEntity(id_city, name, countryEntity);
  }
}
