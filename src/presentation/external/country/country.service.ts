import { CacheConst } from "@/core/constants";
import type { ExternalCountryEntity } from "./country.entity";
import { CacheAdapter } from "@/core/adapters";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../../response";


export class ExternalCountryService {
  private cache: CacheAdapter = CacheAdapter.getInstance();

public async getCountryList(): Promise<ApiResponse<ExternalCountryEntity[]>> {
    const cachedCountryList = this.cache.get<ExternalCountryEntity[]>(
      CacheConst.COUNTRIES
    );
    if (!cachedCountryList) {
      throw CustomError.internalServer("Servicio de países no disponible");
    }

    return new ApiResponse<ExternalCountryEntity[]>(
      200,
      "Lista de países obtenida correctamente",
      cachedCountryList
    );
  }
}
