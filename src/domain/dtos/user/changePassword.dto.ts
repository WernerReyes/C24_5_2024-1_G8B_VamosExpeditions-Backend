import { Validations } from "@/core/utils";

export class ChangePasswordDto {
  private constructor(
    public readonly id: number,
    public readonly oldPassword: string,
    public readonly newPassword: string
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, ChangePasswordDto?] {
    const { id, oldPassword, newPassword } = props;

    const idError = Validations.validateNumberFields({ id });
    if (idError) return [idError, undefined];

    const greaterThanError = Validations.validateGreaterThanValueFields(
      { id },
      0
    );
    if (greaterThanError) return [greaterThanError, undefined];

    const validatePasswordError = Validations.validatePassword(oldPassword);
    if (validatePasswordError) return [validatePasswordError, undefined];

    const validateNewPasswordError = Validations.validatePassword(newPassword);
    if (validateNewPasswordError) return [validateNewPasswordError, undefined];

    return [undefined, new ChangePasswordDto(+id, oldPassword, newPassword)];
  }
}
