import { Validations } from "@/core/utils";
import { CustomError } from "@/domain/error";
import type { ExternalCountryModel } from "./country.model";

type Image = {
  svg: string;
  png: string;
};

export enum Subregion {
  SouthernAsia = "Southern Asia",
  NorthernEurope = "Northern Europe",
  SouthernEurope = "Southern Europe",
  NorthernAfrica = "Northern Africa",
  Polynesia = "Polynesia",
  MiddleAfrica = "Middle Africa",
  Caribbean = "Caribbean",
  Antarctica = "Antarctica",
  SouthAmerica = "South America",
  WesternAsia = "Western Asia",
  AustraliaAndNewZealand = "Australia and New Zealand",
  CentralEurope = "Central Europe",
  EasternEurope = "Eastern Europe",
  WesternEurope = "Western Europe",
  CentralAmerica = "Central America",
  WesternAfrica = "Western Africa",
  NorthernAmerica = "Northern America",
  SouthernAfrica = "Southern Africa",
  SouthAntarcticOcean = "South Antarctic Ocean",
  EasternAfrica = "Eastern Africa",
  SouthEasternAsia = "South-Eastern Asia",
  EasternAsia = "Eastern Asia",
  Melanesia = "Melanesia",
  Micronesia = "Micronesia",
  CentralAsia = "Central Asia",
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
