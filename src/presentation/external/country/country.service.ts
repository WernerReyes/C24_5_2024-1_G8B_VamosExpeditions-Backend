import { ApiResponse } from "../../response";
import { ExternalCountryContext } from "./country.context";
import type { ExternalCountryEntity } from "./country.entity";

export class ExternalCountryService {
  public async getCountryList(): Promise<ApiResponse<ExternalCountryEntity[]>> {
    return new ApiResponse<ExternalCountryEntity[]>(
      200,
      "Lista de países obtenida correctamente",
      ExternalCountryContext.getCountries
    );
  }
}
