import { Validations } from "@/core/utils";
import type { UserEntity } from "@/domain/entities";

export class UpdateSettingDto {
  private constructor(
    public readonly id: number,
    public readonly value: string,
    public readonly userId: UserEntity["id"] | null
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, UpdateSettingDto?] {
    const { value, userId, id } = props;

    const emptyError = Validations.validateEmptyFields({ id, userId });
    if (emptyError) return [emptyError];

    const numberError = Validations.validateNumberFields({
      userId,
    });
    if (numberError) return [numberError];

    return [
      undefined,
      new UpdateSettingDto(id, value === "null" ? null : value, +userId),
    ];
  }
}
