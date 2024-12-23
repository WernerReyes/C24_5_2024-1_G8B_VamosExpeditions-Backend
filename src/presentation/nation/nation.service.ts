import { CountryEntity } from "@/domain/entities";
import { CountryModel, CytyModel, DistritModel } from "@/data/postgres";
import { CustomError } from "@/domain/error";
import { NationResponse } from "./nation.response";

export class NationService {
  constructor(private readonly nationResponse: NationResponse) {}

  public async getAllNations() {
    try {
      const countries = await CountryModel.findMany({
        select: {
          id_country: true,
          name: true,
          code: true,
          city: {
            select: {
              id_city: true,
              name: true,
            },
          },
        },
      });
      const data = countries.map((country) =>
        CountryEntity.fromObject(country)
      );
      return this.nationResponse.nationAlls(data);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
