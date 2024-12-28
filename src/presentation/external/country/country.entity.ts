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
    public readonly root: string
  ) {}

  public static fromObject(
    object: ExternalCountryModel
  ): ExternalCountryEntity {
    
    const {
      name: { common: name },
      cca2: code,
      flags: { svg, png },
      idd: { root: root },
    } = object;
    const error = Validations.validateEmptyFields({
      name,
      code,
      svg,
      png,
    });

    if (error) throw CustomError.badRequest(error);

    return new ExternalCountryEntity(name, code, { svg, png }, root || "");
  }
}
