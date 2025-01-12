import { Validations } from "@/core/utils";
import { CustomError } from "../error";
export class CountryEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string
  ) {}

  public static fromObject(object: any): CountryEntity {
    const { id_country, name, code } = object;

    const error = Validations.validateEmptyFields({
      id_country,
      name,
      code,
    });
    if (error) throw CustomError.badRequest(error);

    return new CountryEntity(id_country, name, code);
  }

  public static validateEntity(
    entity: CountryEntity,
    from: string
  ): string | null {
    const { id, name, code } = entity;
    return Validations.validateEmptyFields(
      {
        id,
        name,
        code,
      },
      `${from}, CountryEntity`
    );
  }
}
