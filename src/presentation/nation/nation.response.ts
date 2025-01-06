import type { country } from "@prisma/client";
import { CountryEntity } from "@/domain/entities";
import { AppResponse } from "../response";

export class NationResponse {
  nationAlls(nations: country[]): AppResponse<CountryEntity[]> {
    return {
      status: 200,
      message: "Lista de países obtenida correctamente",
      data: nations.map((nation) => CountryEntity.fromObject(nation)),
    };
  }
}
