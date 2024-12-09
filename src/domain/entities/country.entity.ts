import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export class CountryEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly code: string
  ) {}

  public static fromObject(object: { [key: string]: any }): CountryEntity {
    const { id_country, name, code } = object;
    const error = Validations.validateEmptyFields({
      id_country,
      name,
      code,
    });
    if (error) throw CustomError.badRequest(error);

    return new CountryEntity(id_country, name, code);
  }
}
