import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { city, distrit } from "@prisma/client";
import { City, CityEntity } from "./city.entity";

export type Distrit = distrit & {
  city?: City;
};

export class DistritEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly city?: CityEntity
  ) {}

  public static fromObject(distrit: Distrit): DistritEntity {
    const { id_distrit, name, city } = distrit;
    /* console.log(object) */
    const error = Validations.validateEmptyFields({
      id_distrit,
      name,
    });
    if (error) throw CustomError.badRequest(error);

    return new DistritEntity(
      id_distrit,
      name,
      city ? CityEntity.fromObject(city) : undefined
    );
  }
}
