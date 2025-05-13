import type { IClientModel } from "@/infrastructure/models";
import { ExternalCountryContext } from "@/presentation/external/country/country.context";
import type { Image } from "@/presentation/external/country/country.entity";

export class ClientEntity {
  private constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly country: {
      name: string;
      image?: Image;
    },
    public readonly subregion: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
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
      {
        name: country,
        image: ExternalCountryContext.getCountryByName(country)?.image,
      },
      subregion,
      createdAt!,
      updatedAt!
    );
  }
}
