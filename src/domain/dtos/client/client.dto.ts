import { Validations } from "@/core/utils";
import { Subregion } from "@/presentation/external/country/country.entity";

const FROM = "ClientDto";
export class ClientDto {
  private constructor(
    public readonly fullName: string,
    public readonly email: string | null,
    public readonly phone: string | null,
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
        subregion,
      },
      FROM
    );
    if (error) return [error, undefined];

    if (email) {
      const emailError = Validations.validateEmail(email);
      if (emailError) return [emailError, undefined];
    }
    const enumError = Validations.validateEnumValue(
      subregion,
      Object.values(Subregion)
    );
    if (enumError) return [enumError, undefined];

    return [
      undefined,
      new ClientDto(
        fullName.trim().charAt(0).toUpperCase() + fullName.slice(1),
        email ? email.trim() : null,
        phone ? phone.trim() : null,
        country,
        subregion,
        +id
      ),
    ];
  }
}
