import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CountryEntity } from "./country.entity";

export class CityEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,

  ) {}

  public static fromObject(object: { [key: string]: any }): CityEntity {
    
    const {  id_city, name } = object;
    const error = Validations.validateEmptyFields({
      id_city,
      name,
      
    });
    if (error) throw CustomError.badRequest(error);

    

    return new CityEntity(id_city, name);
  }
}
