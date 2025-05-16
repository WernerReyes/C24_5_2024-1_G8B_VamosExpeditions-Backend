import { Validations } from "@/core/utils";

export class CountryDto {


  constructor(
    public countryId: number,
    public countryName: string,
    public countryCode: string
  ) {}


  public static create(props: { [key: string]: any }): [string?, CountryDto?] {
    const { countryId = 0, countryName, countryCode } = props;

    const error = Validations.validateEmptyFields(
      { countryName, countryCode },
      "CountryDto"
    );
    if (error) return [error, undefined];

    if (countryId !== 0) {
      const idError = Validations.validateNumberFields({ countryId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { countryId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    return [undefined, new CountryDto(+countryId, countryName, countryCode)];
  }
}
