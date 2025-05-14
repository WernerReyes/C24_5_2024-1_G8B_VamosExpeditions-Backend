import type { IClientModel } from "@/infrastructure/models";
import { ExternalCountryContext } from "@/presentation/external/country/country.context";
import type { Image } from "@/presentation/external/country/country.entity";

export class ClientEntity {
  private constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly subregion: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly country?: {
      name: string;
      image?: Image;
    }
  ) {}

  public static async fromObject(client: {
    [key: string]: any;
  }): Promise<ClientEntity> {
    const {
      id,
      fullName,
      email,
      phone,
      country,
      subregion,
      createdAt,
      updatedAt,
    } = client as IClientModel;

    return new ClientEntity(
      id,
      fullName,
      email,
      phone,
      subregion,
      createdAt ? new Date(createdAt) : undefined,
      updatedAt ? new Date(updatedAt) : undefined,
      country
        ? {
            name: country,
            image: ExternalCountryContext.getCountryByName(country)?.image,
          }
        : undefined
    );
  }
}
