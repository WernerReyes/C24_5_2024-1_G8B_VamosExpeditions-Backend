import type { IDistrictModel } from "@/infrastructure/models";
import { CityEntity } from "./city.entity";


export class DistritEntity {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly city?: CityEntity
  ) {}

  public static async fromObject(distrit: {
    [key: string]: any;
  }): Promise<DistritEntity> {
    const { id_distrit, name, city } = distrit as IDistrictModel;

    return new DistritEntity(
      id_distrit,
      name,
      city ? await CityEntity.fromObject(city) : undefined
    );
  }
}
