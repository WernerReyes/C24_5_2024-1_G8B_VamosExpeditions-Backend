import { UAParserAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";
import { AuthUser } from "@/presentation/auth/auth.context";
export class LoginDto {
  private constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly device: AuthUser["device"]
  ) {}

  static create(props: { [key: string]: any }): [string?, LoginDto?] {
    const { email, password, userAgent, browserName } = props;

    const error = Validations.validateEmptyFields({ email, password });
    if (error) return [error, undefined];

    const emailError = Validations.validateEmail(email);
    if (emailError) return [emailError, undefined];

    const passwordError = Validations.validatePassword(password);
    if (passwordError) return [passwordError, undefined];

    const device = UAParserAdapter.generateDevice(userAgent, browserName);
    

    return [undefined, new LoginDto(email, password, device)];
  }
}
