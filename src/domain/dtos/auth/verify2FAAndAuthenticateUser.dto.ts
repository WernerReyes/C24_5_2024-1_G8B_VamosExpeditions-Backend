import { UAParserAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";
import { AuthUser } from "@/presentation/auth/auth.context";
export class Verify2FAAndAuthenticateUserDto {
  private constructor(
    public readonly userId: number,
    public readonly code: string,
    public readonly device: AuthUser["device"]
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, Verify2FAAndAuthenticateUserDto?] {
    const { userId, code, userAgent, browserName } = props;

    const error = Validations.validateEmptyFields({ userId, code });
    if (error) return [error, undefined];

    const device = UAParserAdapter.generateDevice(userAgent, browserName);

    return [
      undefined,
      new Verify2FAAndAuthenticateUserDto(userId, code, device),
    ];
  }
}
