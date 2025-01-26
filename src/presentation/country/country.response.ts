import type { country } from "@prisma/client";
import { CountryEntity } from "@/domain/entities";
import { ApiResponse } from "../response";

export class CountryResponse {
  countriesFound(countries: country[]): ApiResponse<CountryEntity[]> {
    return {
      status: 200,
      message: "Lista de países obtenida correctamente",
      data: countries.map(CountryEntity.fromObject),
    };
  }
}
