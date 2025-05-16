import { CountryModel, DistrictModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";

import { CountryEntity, DistritEntity } from "@/domain/entities";

import { CountryDto } from "@/domain/dtos/country/county.dto";
import { CountryMapper } from "./country.mapper";
import { country } from "@prisma/client";
import { CustomError } from "@/domain/error";

export class CountryService {
  constructor(private readonly countryMapper: CountryMapper) {}

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
    const distrits = await DistrictModel.findMany({
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

  public async getAllCityAndCountryAndDistrit() {
    const countries = await CountryModel.findMany({
      include: {
        city: {
          omit: {
            country_id: true,
          },
          include: {
            distrit: {
              omit: {
                city_id: true,
              },
            },
          },
        },
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

  // start only countries
  public async fetchOnlyCountries() {
    const countries = await CountryModel.findMany({});
    return new ApiResponse<CountryEntity[]>(
      200,
      "Lista de países",
      await Promise.all(
        countries.map((country) => CountryEntity.fromObject(country))
      )
    );
  }
  // end only countries

  // start create, update and delete
  public async upsertCountry(countryDto: CountryDto) {
    this.countryMapper.setDto = countryDto;
    let countryData: country;

    const existingCountry = await CountryModel.findUnique({
      where: {
        id_country: countryDto.countryId,
      },
    });

    if (existingCountry) {
      countryData = await CountryModel.update({
        where: {
          id_country: countryDto.countryId,
        },
        data: this.countryMapper.updateCountry,
      });
    } else {
      countryData = await CountryModel.create({
        data: this.countryMapper.createCountry,
      });
    }

    return new ApiResponse(
      200,
      countryDto.countryId > 0
        ? "País actualizado correctamente"
        : "País creado correctamente",

      countryData
    );
  }

  public async deleteCountry(countryId: number) {
    const countryData = await CountryModel.delete({
      where: {
        id_country: +countryId,
      },
    });
    return new ApiResponse(200, "País eliminado correctamente", countryData);
  }
  // end create, update and delete
}
