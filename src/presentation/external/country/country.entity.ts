import { Validations } from "@/core/utils";
import { CustomError } from "@/domain/error";
import type { ExternalCountryModel } from "./country.model";

type Image = {
  svg: string;
  png: string;
};

export enum Subregion {
  northernAmerica = "Northern America",
  centralAmerica = "Central America",
  caribbean = "Caribbean",
  southAmerica = "South America",
  northernEurope = "Northern Europe",
  westernEurope = "Western Europe",
  easternEurope = "Eastern Europe",
  southernEurope = "Southern Europe",
  northernAfrica = "Northern Africa",
  westernAfrica = "Western Africa",
  easternAfrica = "Eastern Africa",
  middleAfrica = "Middle Africa",
  southernAfrica = "Southern Africa",
  westernAsia = "Western Asia",
  centralAsia = "Central Asia",
  easternAsia = "Eastern Asia",
  southernAsia = "Southern Asia",
  southeastAsia = "Southeast Asia",
  australiaAndNewZealand = "Australia and New Zealand",
  melanesia = "Melanesia",
  micronesia = "Micronesia",
  polynesia = "Polynesia",
}


export class ExternalCountryEntity {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly image: Image,
    public readonly subregion: Subregion
  ) {}

  public static fromObject(
    object: ExternalCountryModel
  ): ExternalCountryEntity {
    const {
      name,
      alpha2Code: code,
      flags: { svg, png },
      subregion,
    } = object;
    const error = Validations.validateEmptyFields({
      name,
      code,
      svg,
      png,
    });

    if (error) throw CustomError.badRequest(error);

    return new ExternalCountryEntity(name, code, { svg, png }, subregion as Subregion);
  }

  public static validateEntity(
    entity: ExternalCountryEntity,
    from: string
  ): string | null {
    const { name, code, image, subregion } = entity;
    return Validations.validateEmptyFields(
      {
        name,
        code,
        image,
        subregion,
      },
      `${from}, ExternalCountryEntity`
    );
  }
}
