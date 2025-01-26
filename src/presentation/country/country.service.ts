import { CountryModel } from "@/data/postgres";
import { CustomError } from "@/domain/error";
import { CountryResponse } from "./country.response";

export class CountryService {
  constructor(private readonly countryResponse: CountryResponse) {}

  public async getAllCountries() {
    try {
      const countries = await CountryModel.findMany({
        include: {
          city: true,
        },
      });
      return this.countryResponse.countriesFound(countries);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
