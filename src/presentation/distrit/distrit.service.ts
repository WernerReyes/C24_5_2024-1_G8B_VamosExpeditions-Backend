import { DistrictModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";
import { DistritEntity } from "@/domain/entities";
import { DistritDto } from "../../domain/dtos/distrit/distrit.dto";
import { DistritMapper } from "./distrit.mapper";
import { CustomError } from "@/domain/error";

export class DistritService {
  constructor(private readonly distritMapper: DistritMapper) {}

  public async getAllDistrit() {
    const distrits = await DistrictModel.findMany({
      omit: {
        city_id: true,
      },
      include: {
        city: true,
      },
      orderBy: {
        city: {
          name: "asc",
        },
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

  public async upsertDistrit(distritDto: DistritDto) {
    this.distritMapper.setDto = distritDto;
    let distritData;
    try {
      const existingDistrit = await DistrictModel.findUnique({
        where: {
          id_distrit: distritDto.distritId,
        },
      });

      if (existingDistrit) {
        distritData = await DistrictModel.update({
          where: {
            id_distrit: distritDto.distritId,
          },
          data: this.distritMapper.updateDistrit,
        });
      } else {
        distritData = await DistrictModel.create({
          data: this.distritMapper.createDistrit,
        });
      }
      return new ApiResponse(
        200,
        distritDto.distritId === 0 || existingDistrit === null
          ? "Distrito creando "
          : "Distrito actualizando",
        distritData
      );
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer(
        `Error al crear el país: ${error.message}`
      );
    }
  }
}
