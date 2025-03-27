import { Validations } from "@/core/utils";

export class UserDto {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password?: string,
    public readonly roleId?: number
  ) {}

  public static create(props: { [key: string]: any }): [string?, UserDto?] {
    const { id = 0, fullname, email, password, roleId } = props;

    const emptyError = Validations.validateEmptyFields({ fullname, email });
    if (emptyError) return [emptyError, undefined];

    const emailError = Validations.validateEmail(email);
    if (emailError) return [emailError, undefined];

    if (id !== 0) {
      const idError = Validations.validateNumberFields({ id });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { id },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    } else {
      const passwordError = Validations.validateEmptyFields({
        password,
        roleId,
      });
      if (passwordError) return [passwordError, undefined];

      const roleError = Validations.validateGreaterThanValueFields(
        { roleId },
        0
      );

      if (roleError) return [roleError, undefined];
    }

    return [undefined, new UserDto(+id, fullname, email, password, roleId)];
  }
}
