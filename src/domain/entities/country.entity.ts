import { CacheAdapter } from "../../core/adapters";
import { CacheConst } from "@/core/constants";
import type {
  ExternalCountryEntity,
  Image,
} from "@/presentation/external/country/country.entity";
import { CityEntity } from "./city.entity";
import type { city, country } from "@prisma/client";

type Country = country & {
  city?: city[];
};

export class CountryEntity {
  private static get cache(): CacheAdapter {
    return CacheAdapter.getInstance();
  }

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
      await this.getCountryImage(code),
      city
        ? await Promise.all(city.map((city) => CityEntity.fromObject(city)))
        : undefined
    );
  }

  private static async getCountryImage(
    code: string
  ): Promise<Image | undefined> {
    try {
      const cachedCountries =
        (await this.cache.get<ExternalCountryEntity[]>(CacheConst.COUNTRIES)) ||
        [];
      return cachedCountries.find((country) => country.code === code)?.image;
    } catch (e) {
      return undefined;
    }
  }
}
