import { EnvsConst } from "@/core/constants";
import type { ExternalCountryEntity } from "./country.entity";
import { ExternalCountryResponse } from "./country.response";
import { AppResponse } from "../../response";
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

  public async getCountryList(): Promise<AppResponse<ExternalCountryEntity[]>> {
    const cacheKey = "country-list";
    
    const cachedCountryList = this.cache.get(cacheKey);
    if (cachedCountryList) {
      console.log("Country list from cache");
      return this.externalCountryResponse.getCountryList(cachedCountryList);
    }

    try {
      const response = await fetch(
        EXTERNAL_API_COUNTRY_URL + "/all?fields=name,flags,cca2"
      );
      const data = await response.json();
      

      this.cache.set(cacheKey, data);
      
      
      return this.externalCountryResponse.getCountryList(data);
    } catch (error) {
      throw CustomError.internalServer("Servicio de países no disponible");
    }
  }
}
