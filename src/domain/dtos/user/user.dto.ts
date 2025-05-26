import { Validations } from "@/core/utils";

export class UserDto {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly phoneNumber?: string,
    public readonly description?: string,
    public readonly roleId?: number
  ) {}

  public static create(props: { [key: string]: any }): [string?, UserDto?] {
    const {
      id = 0,
      fullname,
      email,
      phoneNumber,
      description,
      roleId,
    } = props;

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
    }

    if (roleId) {
      const idError = Validations.validateNumberFields({ roleId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { roleId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    if (description) {
      const stringError = Validations.validateStringFields({ description });
      if (stringError) return [stringError, undefined];
    }

    if (phoneNumber) {
      const stringError = Validations.validateStringFields({ phoneNumber });
      if (stringError) return [stringError, undefined];
    }

  

    return [
      undefined,
      new UserDto(
        +id,
        fullname,
        email,
        phoneNumber,
        description,
        roleId
      ),
    ];
  }
}
