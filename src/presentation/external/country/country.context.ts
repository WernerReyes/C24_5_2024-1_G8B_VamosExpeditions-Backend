import type { CacheAdapter } from "@/core/adapters";
import { CacheConst, EnvsConst } from "@/core/constants";
import { ExternalCountryEntity } from "./country.entity";
import { ExternalCountryModel } from "./country.model";

export class ExternalCountryContext {
  private static _externalCountries: ExternalCountryEntity[] = [];

  public static async initialize(cache: CacheAdapter) {
    this._externalCountries =
      (await cache.get<ExternalCountryEntity[]>(CacheConst.COUNTRIES)) ?? [];
      
    if (!this._externalCountries.length) {
      const response = await fetch(
        EnvsConst.EXTERNAL_API_COUNTRY_URL + "/countries"
      );
      const data = await response.json();
      this._externalCountries = data.map((c: ExternalCountryModel) =>
        ExternalCountryEntity.fromObject(c)
      );
      await cache.sAdd(CacheConst.COUNTRIES, this._externalCountries);
    }
  }

  public static get getCountries(): ExternalCountryEntity[] {
    return this._externalCountries;
  }

  public static getCountryByCode(
    code: string
  ): ExternalCountryEntity | undefined {
    return this._externalCountries.find((country) => country.code === code);
  }

  public static getCountryByName(
    name: string
  ): ExternalCountryEntity | undefined {
    return this._externalCountries.find((country) => country.name === name);
  }
}
