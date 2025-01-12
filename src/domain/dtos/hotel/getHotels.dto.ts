import { Validations } from "@/core/utils";

export class GetHotelsDto {
  constructor(
    public readonly cityId?: number,
    public readonly countryId?: number
  ) {}

  static create(props: { [key: string]: any }): [string?, GetHotelsDto?] {
    const { cityId, countryId } = props;

    if (cityId) {
      const error = Validations.validateNumberFields({
        cityId,
      });
      if (error) return [error, undefined];
    }

    if (countryId) {
      const error = Validations.validateNumberFields({
        countryId,
      });
      if (error) return [error, undefined];
    }

    return [
      undefined,
      new GetHotelsDto(+cityId || undefined, +countryId || undefined),
    ];
  }
}
