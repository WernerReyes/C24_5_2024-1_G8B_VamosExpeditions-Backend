import { InsertManyServiceTripDetailsDto } from "@/domain/dtos";
import { ServiceTripDetailsEntity } from "@/domain/entities/serviceTripDetails.entity";
import { ServiceTripDetailsModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";
import { ServiceTripDetailsMapper } from "./serviceTripDetails.mapper";

export class ServiceTripDetailsService {
  constructor(
    private readonly serviceTripDetailsMapper: ServiceTripDetailsMapper
  ) {}

  public async insertMany(
    insertManyServiceTripDetailsDto: InsertManyServiceTripDetailsDto
  ) {
    this.serviceTripDetailsMapper.setDto = insertManyServiceTripDetailsDto;
    const serviceTripDetails =
      await ServiceTripDetailsModel.createManyAndReturn({
        data: this.serviceTripDetailsMapper.createMany,
      });

    return new ApiResponse(
      201,
      "Detalles del servicio creados exitosamente",
      await Promise.all(
        serviceTripDetails.map(
          async (serviceTripDetail) =>
            await ServiceTripDetailsEntity.fromObject(serviceTripDetail)
        )
      )
    );
  }
}
