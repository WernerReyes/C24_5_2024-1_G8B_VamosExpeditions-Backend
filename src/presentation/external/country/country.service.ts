import { CustomError } from "@/domain/error";
import { ApiResponse } from "../../response";
import { ExternalCountryContext } from "./country.context";
import type { ExternalCountryEntity } from "./country.entity";

export class ExternalCountryService {
  public async getCountryList(): Promise<ApiResponse<ExternalCountryEntity[]>> {
    const countries = ExternalCountryContext.getCountries;
    if (!countries || countries.length === 0) {
      throw CustomError.internalServer(
        "No se han encontrado países en la base de datos externa"
      );
    }
    return new ApiResponse<ExternalCountryEntity[]>(
      200,
      "Lista de países obtenida correctamente",
      ExternalCountryContext.getCountries
    );
  }
}
