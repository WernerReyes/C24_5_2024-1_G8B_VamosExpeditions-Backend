import { Validations } from "@/core/utils";

export class HotelDto {
  constructor(
    public id: number,
    public category: string,
    public name: string,
    public address: string,
    public distrit: number,
  ) {}

  static create(props: { [key: string]: any }): [string?, HotelDto?] {
    
    const { id = 0, category, name, address, distrit } = props;

    const error = Validations.validateEmptyFields(
      { category, name, address, distrit },
      "HotelDto"
    );
    if (error) return [error, undefined];

    if (id !== 0) {
      const idError = Validations.validateNumberFields({ id });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { id },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    if (distrit !== 0) {
      const idError = Validations.validateNumberFields({ distrit });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { distrit },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    return [undefined, new HotelDto(+id, category, name, address, +distrit)];
  }
}
