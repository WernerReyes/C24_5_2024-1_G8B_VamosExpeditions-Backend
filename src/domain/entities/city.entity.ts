import type { ICityModel } from "@/infrastructure/models";
import { CountryEntity } from "./country.entity";
import { DistritEntity } from "./distrit.entity";

export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity,
    public readonly distrits?: DistritEntity[]
  ) {}

  public static async fromObject(city: {
    [key: string]: any;
  }): Promise<CityEntity> {
    const { id_city, name, country, distrit } = city as ICityModel;

    return new CityEntity(
      id_city,
      name,
      country ? await CountryEntity.fromObject(country) : undefined,
      distrit
        ? await Promise.all(
            distrit.map((distrit) => DistritEntity.fromObject(distrit))
          )
        : undefined
    );
  }
}
