import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CityEntity } from "./city.entity";
import type {
  ExternalCountryEntity,
  Image,
} from "@/presentation/external/country/country.entity";
import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";
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

    const error = Validations.validateEmptyFields({
      id_country,
      name,
      code,
    });
    if (error) throw CustomError.badRequest(error);

    return new CountryEntity(
      id_country,
      name,
      code,
      this.getCountriImage(code),
      city ? city.map(CityEntity.fromObject) : undefined
    );
  }

  public static validateEntity(
    entity: CountryEntity,
    from: string
  ): string | null {
    const { id, name, code, cities } = entity;

    if (cities) {
      const cityErrors = cities.map((city) =>
        CityEntity.validateEntity(city, `${from}, CountryEntity`)
      );
      const cityError = cityErrors.find((error) => error !== null);
      if (cityError) return cityError;
    }

    return Validations.validateEmptyFields(
      {
        id,
        name,
        code,
      },
      `${from}, CountryEntity`
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
