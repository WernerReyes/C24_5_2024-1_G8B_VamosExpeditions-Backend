import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { CityEntity } from "./city.entity";
export class CountryEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly cities?: CityEntity[]
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
      city ? city.map(CityEntity.fromObject) : undefined
    );
  }

  public static validateEntity(
    entity: CountryEntity,
    from: string
  ): string | null {
    const { id, name, code, cities } = entity;

    if (cities) {
      const cityErrors = cities.map((city) =>
        CityEntity.validateEntity(city, `${from}, CountryEntity`)
      );
      const cityError = cityErrors.find((error) => error !== null);
      if (cityError) return cityError;
    }

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
