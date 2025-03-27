import type { distrit } from "@prisma/client";
import { City, CityEntity } from "./city.entity";

export type Distrit = distrit & {
  city?: City;
};

export class DistritEntity {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly city?: CityEntity
  ) {}

  public static fromObject(distrit: Distrit): DistritEntity {
    const { id_distrit, name, city } = distrit;

    return new DistritEntity(
      id_distrit,
      name,
      city ? CityEntity.fromObject(city) : undefined
    );
  }
}
