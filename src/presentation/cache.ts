import { CacheAdapter } from "@/core/adapters";
import { ExternalCountryEntity } from "./external/country/country.entity";
import { CacheConst } from "@/core/constants";
import { EnvsConst } from "../core/constants/env.const";
import type { ExternalCountryModel } from "./external/country/country.model";

export class AppCache {
  async initialize() {
    await CacheAdapter.initialize();
  }

  async externalCountries() {
    const cache = CacheAdapter.getInstance();
    const cachedCountryList = await cache.get<ExternalCountryEntity[]>(
      CacheConst.COUNTRIES
    );
    if (cachedCountryList) return;

    const response = await fetch(
      EnvsConst.EXTERNAL_API_COUNTRY_URL + "/countries"
    );
    const data = await response.json();
    cache.set(
      CacheConst.COUNTRIES,
      data.map((c: ExternalCountryModel) => ExternalCountryEntity.fromObject(c))
    );
  }
}
