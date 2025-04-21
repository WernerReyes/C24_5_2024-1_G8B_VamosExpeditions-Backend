import { CountryModel, DistritModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { CountryEntity, DistritEntity } from "@/domain/entities";

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

  public async getAllDistritAnd() {
    const distrits = await DistritModel.findMany({
      omit: {
        city_id: true,
      },
    });

    return new ApiResponse<DistritEntity[]>(
      200,
      "Lista de distritos",
      await Promise.all(
        distrits.map((distrit) => DistritEntity.fromObject(distrit))
      )
    );
  }
}
