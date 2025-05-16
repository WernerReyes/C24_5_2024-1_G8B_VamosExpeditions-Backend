import { Validations } from "@/core/utils";

export class CityDto {
  constructor(
    public cityId: number,
    public cityName: string,
    public countryId: number
  ) {}

  public static create(props: { [key: string]: any }): [string?, CityDto?] {
    const { cityId = 0, cityName, countryId } = props;

    const error = Validations.validateEmptyFields(
      { cityName, countryId },
      "CityDto"
    );
    if (error) return [error, undefined];

    if (cityId !== 0) {
      const idError = Validations.validateNumberFields({ cityId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { cityId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    if (countryId) {
      const idError = Validations.validateNumberFields({ countryId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { countryId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    return [undefined, new CityDto(+cityId, cityName, countryId)];
  }
}
