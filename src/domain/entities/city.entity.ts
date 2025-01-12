import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CountryEntity } from "./country.entity";
import { DistritEntity } from "./distrit.entity";

import type {
  city,
  distrit,
  accommodation,
  accommodation_room,
} from "@prisma/client";

export type City = Omit<city, "created_at" | "updated_at" | "country_id"> & {
  distrit: (Omit<distrit, "created_at" | "city_id"> & {
    accommodation: (Omit<accommodation, "distrit_id_distrit"> & {
      accommodation_room: Omit<accommodation_room, "accommodation_id">[];
    })[];
  })[];
};


export class CityEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly distrit?: DistritEntity[],
    public readonly country?: CountryEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): CityEntity {
    const { id_city, name, country, distrit } = object;

    if (!country) {
      return new CityEntity(
        id_city,
        name,
        distrit
          ? distrit.map((distrit: DistritEntity) =>
              DistritEntity.fromObject(distrit)
            )
          : undefined
      );
    }

    const countryEntity = CountryEntity.fromObject(country);

    return new CityEntity(id_city, name, distrit, countryEntity);
  }
}
