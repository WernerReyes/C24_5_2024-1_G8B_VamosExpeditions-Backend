import type { ICityModel } from "@/infrastructure/models";
import { CountryEntity } from "./country.entity";

export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity
  ) {}

  public static async fromObject(city: {
    [key: string]: any;
  }): Promise<CityEntity> {
    const { id_city, name, country } = city as ICityModel;

    return new CityEntity(
      id_city,
      name,
      country ? await CountryEntity.fromObject(country) : undefined
    );
  }
}
