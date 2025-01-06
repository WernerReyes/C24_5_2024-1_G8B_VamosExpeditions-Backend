import { CountryModel } from "@/data/postgres";
import { CustomError } from "@/domain/error";
import { NationResponse } from "./nation.response";

export class NationService {
  constructor(private readonly nationResponse: NationResponse) {}

  public async getAllNations() {
    try {
      const countries = await CountryModel.findMany({
        include: {
          city: true,
        },
      });
      return this.nationResponse.nationAlls(countries);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
