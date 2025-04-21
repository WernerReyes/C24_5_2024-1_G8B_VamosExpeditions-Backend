import { ExternalCountryContext } from "@/presentation/external/country/country.context";
import type {
  Image
} from "@/presentation/external/country/country.entity";
import type { client } from "@prisma/client";

export type Client = client & {};

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

  public static async fromObject(client: Client): Promise<ClientEntity> {
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
