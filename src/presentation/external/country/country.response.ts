import { AppResponse } from "@/presentation/response";
import { ExternalCountryEntity } from "./country.entity";
import type { ExternalCountryModel } from "./country.model";

export class ExternalCountryResponse {
  public getCountryList(
    countries: ExternalCountryModel[]
  ): AppResponse<ExternalCountryEntity[]> {
    if (countries.length > 0) {
      return {
        status: 200,
        message: "Lista de países obtenida correctamente",
        data: countries.map((country) =>
          ExternalCountryEntity.fromObject(country)
        ),
      };
    }

    return {
      status: 200,
      message: "Lista de países obtenida correctamente",
      data: [],
    };
  }
}
