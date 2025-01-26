import { EnvsConst } from "@/core/constants";
import type { ExternalCountryEntity } from "./country.entity";
import { ExternalCountryResponse } from "./country.response";
import { ApiResponse } from "../../response";
import { CustomError } from "@/domain/error";
import { CacheAdapter } from "@/core/adapters";

const { EXTERNAL_API_COUNTRY_URL } = EnvsConst;

export class ExternalCountryService {
  private cache: CacheAdapter;

  constructor(
    private readonly externalCountryResponse: ExternalCountryResponse
  ) {
    this.cache = new CacheAdapter({
      stdTTL: 60 * 60 * 24,
    });
  }

  public async getCountryList(): Promise<ApiResponse<ExternalCountryEntity[]>> {
    const cacheKey = "country-list";

    const cachedCountryList = this.cache.get(cacheKey);
    if (cachedCountryList) {
      console.log("Country list from cache");
      return this.externalCountryResponse.getCountryList(cachedCountryList);
    }

    try {
      const response = await fetch(EXTERNAL_API_COUNTRY_URL + "/countries");
      const data = await response.json();

      this.cache.set(cacheKey, data);

      return this.externalCountryResponse.getCountryList(data);
    } catch (error) {
      console.log("error", error);
      throw CustomError.internalServer("Servicio de países no disponible");
    }
  }

  public async getCountryByCode(
    code: string
  ): Promise<ApiResponse<ExternalCountryEntity>> {
    try {
      console.log(EXTERNAL_API_COUNTRY_URL + "/alpha/" + code);
      const response = await fetch(EXTERNAL_API_COUNTRY_URL + "/alpha/" + code);
      const data = await response.json();
      console.log("response",data);
      return this.externalCountryResponse.getCountry(data[0]);
    } catch (error) {
      console.log("error", error);
      throw CustomError.internalServer("Servicio de países no disponible");
    }
  }
}
