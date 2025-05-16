import { CityModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { CityEntity } from "@/domain/entities";
import { CityDto } from "@/domain/dtos/city/city.dto";
import { CityMapper } from "./city.mapper";
import { city } from "@prisma/client";
import { CustomError } from "@/domain/error";

export class CityService {
  constructor(private readonly cityMapper: CityMapper) {}

  //  start all cities
  public async getCitiesAlls() {
    try {
      const cityAll = await CityModel.findMany({
        omit: {
          country_id: true,
        },
      });
      console.log("cityAll", cityAll);
      return new ApiResponse<CityEntity[]>(
        200,
        "Lista de ciudades",
        await Promise.all(cityAll.map((city) => CityEntity.fromObject(city)))
      );
    } catch (error) {
      console.log(error);
    }
  }
  //end all cities

  // start create  update and delete
  public async upsertCity(cityDto: CityDto) {
    this.cityMapper.setDto = cityDto;
    let cityData: city;
    try {
      const existingCity = await CityModel.findUnique({
        where: {
          id_city: cityDto.cityId,
        },
      });

      if (existingCity) {
        cityData = await CityModel.update({
          where: {
            id_city: cityDto.cityId,
          },
          data: this.cityMapper.updateCity,
        });
      } else {
        cityData = await CityModel.create({
          data: this.cityMapper.createCity,
        });
      }
      return new ApiResponse(
        200,
        cityDto.cityId > 0
          ? "Ciudad actualizada correctamente"
          : "Ciudad creada correctamente",
        cityData
      );
    } catch (error: any) {
      console.log(error);

      throw CustomError.internalServer(
        `Error al crear el país: ${error.message}`
      );
    }
  }

  // end create  update and delete
}
