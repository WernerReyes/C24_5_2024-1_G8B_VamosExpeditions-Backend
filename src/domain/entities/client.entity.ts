import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { client } from "@prisma/client";
import type {
  ExternalCountryEntity,
  Image,
} from "@/presentation/external/country/country.entity";
import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";

export type Client = client & {};

export class ClientEntity {
  private static cache: CacheAdapter = CacheAdapter.getInstance();

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

  public static fromObject(client: Client): ClientEntity {
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

    const cachedCountries =
      this.cache.get<ExternalCountryEntity[]>(CacheConst.COUNTRIES) || [];
  
    return new ClientEntity(
      id,
      fullName,
      email,
      phone,
      {
        name: country,
        image: cachedCountries.find((c) => c.name === country)?.image,
      },
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
