import { CountryModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { CountryEntity } from "@/domain/entities";

export class CountryService {
  constructor() {}

  public async getAllCountries() {
    const countries = await CountryModel.findMany({
      include: {
        city: true,
      },
    });
    return new ApiResponse<CountryEntity[]>(
      200,
      "Lista de países",
      await Promise.all(countries.map((country) => CountryEntity.fromObject(country)))
    );
  }
}
