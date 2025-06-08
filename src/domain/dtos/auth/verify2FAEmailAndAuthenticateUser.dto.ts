import { UAParserAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";
import { AuthUser } from "@/presentation/auth/auth.context";
export class Verify2FAEmailAndAuthenticateUserDto {
  private constructor(
    public readonly userId: number,
    public readonly device: AuthUser["device"]
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, Verify2FAEmailAndAuthenticateUserDto?] {
    const { userId, userAgent, browserName, deviceId } = props;

    const error = Validations.validateEmptyFields({
      userId,
      userAgent,
      browserName,
      deviceId,
    });
    if (error) return [error, undefined];

    const device = UAParserAdapter.generateDevice(userAgent, browserName);

    return [
      undefined,
      new Verify2FAEmailAndAuthenticateUserDto(+userId, {
        ...device,
        // id: deviceId,
      }),
    ];
  }
}
