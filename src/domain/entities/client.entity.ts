import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { client } from "@prisma/client";

export class ClientEntity {
  private constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly country: string,
    public readonly continent: string
  ) {}

  public static fromObject(client: client): ClientEntity {
    const { id, fullName, email, phone, country, continent } = client;

    const error = Validations.validateEmptyFields({
      id,
      fullName,
      email,
      phone,
      country,
      continent,
    });

    if (error) throw CustomError.badRequest(error);

    return new ClientEntity(id, fullName, email, phone, country, continent);
  }

  public static validateEntity(entity: ClientEntity, from: string): string | null {
    const { id, fullName, email, phone, continent, country } = entity;
    return Validations.validateEmptyFields(
      {
        id,
        fullName,
        email,
        phone,
        continent,
        country,
      },
      `${from}, ClientEntity`
    );
  }
}
