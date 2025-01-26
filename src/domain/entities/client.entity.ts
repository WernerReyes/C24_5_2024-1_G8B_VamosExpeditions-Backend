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
    public readonly subregion: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static fromObject(client: client): ClientEntity {
    const {
      id,
      fullName,
      email,
      phone,
      country,
      subregion,
      createdAt,
      updatedAt,
    } = client;

    const error = Validations.validateEmptyFields({
      id,
      fullName,
      email,
      phone,
      country,
      subregion,
      createdAt,
      updatedAt,
    });

    if (error) throw CustomError.badRequest(error);

    return new ClientEntity(
      id,
      fullName,
      email,
      phone,
      country,
      subregion,
      createdAt!,
      updatedAt!
    );
  }

  public static validateEntity(
    entity: ClientEntity,
    from: string
  ): string | null {
    const { id, fullName, email, phone, subregion, country } = entity;
    return Validations.validateEmptyFields(
      {
        id,
        fullName,
        email,
        phone,
        subregion,
        country,
      },
      `${from}, ClientEntity`
    );
  }
}
