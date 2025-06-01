import { Validations } from "@/core/utils";

export class DisconnectDeviceDto {
  private constructor(
    public readonly password: string,
    public readonly userId: number,
    public readonly deviceId: string
  ) {}

  public static create(object: {
    [key: string]: any;
  }): [string?, DisconnectDeviceDto?] {
    const { password, userId, deviceId } = object;

    const emptyError = Validations.validateEmptyFields({
      password,
      userId,
      deviceId,
    });
    if (emptyError) return [emptyError];

    const stringError = Validations.validateStringFields({
      password,
      deviceId,
    });
    if (stringError) return [stringError];

    const numberError = Validations.validateNumberFields({ userId });
    if (numberError) return [numberError];

    const passwordError = Validations.validatePassword(password);
    if (passwordError) return [passwordError];

    return [undefined, new DisconnectDeviceDto(password, +userId, deviceId)];
  }
}
