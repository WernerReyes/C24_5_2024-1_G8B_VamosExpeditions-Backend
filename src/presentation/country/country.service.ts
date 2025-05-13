import { CountryEntity } from "@/domain/entities";
import { CountryModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";

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
      await Promise.all(
        countries.map((country) => CountryEntity.fromObject(country))
      )
    );
  }

 
}
