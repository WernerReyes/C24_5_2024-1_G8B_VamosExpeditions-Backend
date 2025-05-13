import type { ICountryModel } from "@/infrastructure/models";
import { ExternalCountryContext } from "@/presentation/external/country/country.context";
import type { Image } from "@/presentation/external/country/country.entity";
import { CityEntity } from "./city.entity";

export class CountryEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly image?: Image,
    public readonly cities?: CityEntity[]
  ) {}

  public static async fromObject(object: {
    [key: string]: any;
  }): Promise<CountryEntity> {
    const { id_country, name, code, city } = object as ICountryModel;

    return new CountryEntity(
      id_country,
      name,
      code,
      ExternalCountryContext.getCountryByCode(code)?.image,
      city
        ? await Promise.all(city.map((city) => CityEntity.fromObject(city)))
        : undefined
    );
  }
}
