import { Validations } from "@/core/utils";

export class DistritDto {
  constructor(
    public distritId: number,
    public distritName: string,
    public cityId: number,
    public countryId: number
  ) {}

  public static create(props: { [key: string]: any }): [string?, DistritDto?] {
    const { distritId = 0, distritName, cityId,countryId } = props;

    const error = Validations.validateEmptyFields(
      { distritName, cityId ,countryId },
      "DistritDto"
    );
    if (error) return [error, undefined];

    if (distritId !== 0) {
      const idError = Validations.validateNumberFields({ distritId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { distritId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    if (cityId) {
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

    return [undefined, new DistritDto(+distritId, distritName, cityId, countryId)];
  }
}
