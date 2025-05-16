
import type { city, country, distrit } from "@prisma/client";
import { CountryEntity } from "./country.entity";
import { DistritEntity } from "./distrit.entity";

export type City = Omit<city, 'country_id'> & {
  country?: country ;
  distrit?: distrit[]
};
export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country?: CountryEntity,
    public readonly distrits?: DistritEntity[]
  ) {}

  public static async fromObject(city: City): Promise<CityEntity> {
    const { id_city, name, country ,distrit } = city;

    return new CityEntity(
      id_city,
      name,
      country ? await CountryEntity.fromObject(country) : undefined,
      distrit
        ? await Promise.all(distrit.map((distrit) => DistritEntity.fromObject(distrit)))
        : undefined
    );
  }

  
}
