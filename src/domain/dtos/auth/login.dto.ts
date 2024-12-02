import { Validations } from "@/core/utils";
export class LoginDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(props: { [key: string]: any }): [string?, LoginDto?] {
    const { email, password } = props;

    const error = Validations.validateEmptyFields({ email, password });
    if (error) return [error, undefined];

    const emailError = Validations.validateEmail(email);
    if (emailError) return [emailError, undefined];

    const passwordError = Validations.validatePassword(password);
    if (passwordError) return [passwordError, undefined];

    return [undefined, new LoginDto(email, password)];
  }
}