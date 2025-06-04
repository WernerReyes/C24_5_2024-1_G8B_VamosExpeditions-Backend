import { Validations } from "@/core/utils";

export class PartnerDto {
  private constructor(
    public readonly id: number,
    public readonly name: string
  ) {}

  public static create(props: { [key: string]: any }): [string?, PartnerDto?] {
    const { id = 0, name } = props;

    const emptyError = Validations.validateEmptyFields({ name });
    if (emptyError) return [emptyError, undefined];

    if (id !== 0) {
      const idError = Validations.validateNumberFields({ id });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { id },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    return [undefined, new PartnerDto(+id, name)];
  }
}
