import { Validations } from "@/core/utils";

export class ResetPasswordDto {
  private constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, ResetPasswordDto?] {
    const { token, newPassword } = props;

    const validateTokenError = Validations.validateStringFields({ token });
    if (validateTokenError) return [validateTokenError, undefined];

    const validateNewPasswordError = Validations.validatePassword(newPassword);
    if (validateNewPasswordError) return [validateNewPasswordError, undefined];

    return [undefined, new ResetPasswordDto(token, newPassword)];
  }
}
