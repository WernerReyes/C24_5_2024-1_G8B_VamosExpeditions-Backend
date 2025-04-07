import {
  Image,
} from "@/presentation/external/country/country.entity";
import type { city, country } from "@prisma/client";
import { CityEntity } from "./city.entity";
import { ExternalCountryContext } from "@/presentation/external/country/country.context";

type Country = country & {
  city?: city[];
};

export class CountryEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly image?: Image,
    public readonly cities?: CityEntity[]
  ) {}

  public static async fromObject(object: Country): Promise<CountryEntity> {
    const { id_country, name, code, city } = object;

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
