import { Validations } from "@/core/utils";
import { Subregion } from "@/presentation/external/country/country.entity";

const FROM = "ClientDto";
export class ClientDto {
  private constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly country: string,
    public readonly subregion: Subregion,
    public readonly id?: number
  ) {}

  static create(props: { [key: string]: any }): [string?, ClientDto?] {
    const { fullName, country, email, phone, subregion, id = 0 } = props;

    const error = Validations.validateEmptyFields(
      {
        fullName,
        country,
        email,
        subregion,
        phone,
      },
      FROM
    );
    if (error) return [error, undefined];

    const emailError = Validations.validateEmail(email);
    if (emailError) return [emailError, undefined];

    const enumError = Validations.validateEnumValue(
      subregion,
      Object.values(Subregion)
    );
    if (enumError) return [enumError, undefined];

    return [
      undefined,
      new ClientDto(
        fullName.trim().charAt(0).toUpperCase() + fullName.slice(1),
        email.trim(),
        phone.trim(),
        country,
        subregion,
        +id
      ),
    ];
  }
}
