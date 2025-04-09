
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

  public static async fromObject(city: City): Promise<CityEntity> {
    const { id_city, name, country } = city;

    return new CityEntity(
      id_city,
      name,
      country ? await CountryEntity.fromObject(country) : undefined
    );
  }

  
}
