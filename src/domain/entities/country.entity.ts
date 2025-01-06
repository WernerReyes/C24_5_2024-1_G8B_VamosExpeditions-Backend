import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CityEntity } from "./city.entity";

export class CountryEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly code: string,
    private readonly cities?: CityEntity[]
  ) {}

  public static fromObject(object: any): CountryEntity {
    const { id_country, name, code, city } = object;

    const error = Validations.validateEmptyFields({
      id_country,
      name,
      code,
    });
    if (error) throw CustomError.badRequest(error);

    return new CountryEntity(
      id_country,
      name,
      code,
      city ? city.map((city: CityEntity) => CityEntity.fromObject(city)) : undefined
    );
  }
}
