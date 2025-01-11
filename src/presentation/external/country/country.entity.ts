import { Validations } from "@/core/utils";
import { CustomError } from "@/domain/error";
import type { ExternalCountryModel } from "./country.model";

type Image = {
  svg: string;
  png: string;
};

export class ExternalCountryEntity {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly image: Image,
    public readonly continent: string
  ) {}

  public static fromObject(
    object: ExternalCountryModel
  ): ExternalCountryEntity {
    const {
      name: { common: name },
      cca2: code,
      flags: { svg, png },
      continents,
    } = object;
    const error = Validations.validateEmptyFields({
      name,
      code,
      svg,
      png,
    });

    if (error) throw CustomError.badRequest(error);

    return new ExternalCountryEntity(name, code, { svg, png }, continents[0]);
  }

  public static validateEntity(entity: ExternalCountryEntity, from: string): string | null {
    const { name, code, image, continent } = entity;
    return Validations.validateEmptyFields({
      name,
      code,
      image,
      continent,
    },
    `${from}, ExternalCountryEntity`);
  }
}
