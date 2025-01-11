import { Validations } from "@/core/utils";
import { ExternalCountryEntity } from "@/presentation/external/country/country.entity";

const FROM = "ClientDto";
export class ClientDto {
  private constructor(
    public fullName: string,
    public email: string,
    public phone: string,
    public country: ExternalCountryEntity
  ) {}

  static create(props: { [key: string]: any }): [string?, ClientDto?] {
    const { fullName, country, email, phone } = props;

    const error = Validations.validateEmptyFields(
      {
        fullName,
        country,
        email,
        phone,
      },
      FROM
    );
    if (error) return [error, undefined];

    const emailError = Validations.validateEmail(email);
    if (emailError) return [emailError, undefined];

    const countryEntityError = ExternalCountryEntity.validateEntity(
      country,
      FROM
    );
    if (countryEntityError) return [countryEntityError, undefined];

    return [
      undefined,
      new ClientDto(
        fullName.trim().charAt(0).toUpperCase() + fullName.slice(1),
        email.trim(),
        phone.trim(),
        country
      ),
    ];
  }
}
