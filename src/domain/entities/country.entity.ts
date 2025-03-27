import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";
import type {
  ExternalCountryEntity,
  Image,
} from "@/presentation/external/country/country.entity";
import { CityEntity } from "./city.entity";
export class CountryEntity {
  private static cache: CacheAdapter = CacheAdapter.getInstance();

  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly image?: Image,
    public readonly cities?: CityEntity[]
  ) {}

  public static fromObject(object: any): CountryEntity {
    const { id_country, name, code, city } = object;

    return new CountryEntity(
      id_country,
      name,
      code,
      this.getCountriImage(code),
      city ? city.map(CityEntity.fromObject) : undefined
    );
  }

  private static getCountriImage(code: string): Image | undefined {
    try {
      const cachedCountries =
        this.cache.get<ExternalCountryEntity[]>(CacheConst.COUNTRIES) || [];
      return cachedCountries.find((country) => country.code === code)?.image;
    } catch (e) {
      return undefined;
    }
  }
}
