import { CountryEntity } from "@/domain/entities";
import { AppResponse } from "../response";


export class NationResponse {


      nationAlls(
        nation: CountryEntity[],
      ): AppResponse<CountryEntity[] > {
        if (nation.length > 0) {
          return {
            status: 200,
            message: "Lista de países obtenida correctamente",
            data: nation,
          };
        }
    
        return {
          status: 200,
          message: "Lista de países obtenida correctamente",
          data: [],
        };


      }


} 