import type {
  InsertManyDetailsTripDetailsDto,
  UpdateManyDetailsTripDetailsByDateDto,
} from "@/domain/dtos";
import { ServiceTripDetailsEntity } from "@/domain/entities/serviceTripDetails.entity";
import { CustomError } from "@/domain/error";
import {
  type IServiceTripDetailsModel,
  prisma,
  ServiceTripDetailsModel,
} from "@/infrastructure/models";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "../response";
import { ServiceTripDetailsMapper } from "./serviceTripDetails.mapper";

export class ServiceTripDetailsService {
  constructor(
    private readonly serviceTripDetailsMapper: ServiceTripDetailsMapper
  ) {}
  public async insertMany(
    insertManyServiceTripDetailsDto: InsertManyDetailsTripDetailsDto
  ) {
    this.serviceTripDetailsMapper.setDto = insertManyServiceTripDetailsDto;
    const serviceTripDetails =
      await ServiceTripDetailsModel.createManyAndReturn({
        data: this.serviceTripDetailsMapper.insertMany,
        select: this.serviceTripDetailsMapper.select,
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2003")
          throw CustomError.notFound("Servicio no encontrada");

        throw CustomError.internalServer(error.message);
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

  public async updateManyByDate({
    tripDetailsId,
    startDate,
  }: UpdateManyDetailsTripDetailsByDateDto) {
    const serviceTripDetails = await ServiceTripDetailsModel.findMany({
      where: {
        trip_details_id: tripDetailsId,
        date: {
          gt: startDate,
        },
      },
      select: {
        id: true,
        date: true,
      },
    });
    if (serviceTripDetails.length === 0) return;

    const updatedManyServiceTripDetails: IServiceTripDetailsModel[] = [];

    await prisma
      .$transaction(async () => {
        for (let i = 0; i < serviceTripDetails.length; i++) {
          const newDate = new Date(serviceTripDetails[i].date);
          newDate.setDate(newDate.getDate() - 1);

          const updatedServiceTripDetails =
            await ServiceTripDetailsModel.update({
              where: {
                id: serviceTripDetails[i].id,
              },
              data: { date: newDate },
              select: this.serviceTripDetailsMapper.select,
            });

          updatedManyServiceTripDetails.push(updatedServiceTripDetails);
        }
      })
      .catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2003")
          throw CustomError.notFound("Servicio no encontrado");

        throw CustomError.internalServer(error.message);
      });

    return new ApiResponse<ServiceTripDetailsEntity[]>(
      200,
      `${updatedManyServiceTripDetails.length} detalles de servicio actualizados correctamente`,
      await Promise.all(
        updatedManyServiceTripDetails.map(ServiceTripDetailsEntity.fromObject)
      )
    );
  }

  public async deleteMany(ids: number[]) {
    const { count } = await ServiceTripDetailsModel.deleteMany({
      where: { id: { in: ids } },
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2003")
        throw CustomError.notFound("Cotización de servicio no encontrada");
      throw CustomError.internalServer(error.message);
    });

    return new ApiResponse<number[]>(
      204,
      `${count === 1 ? "Cotización" : "Cotizaciones"} de habitación eliminada${
        count === 1 ? "" : "s"
      } correctamente`,
      ids
    );
  }

  public async deleteById(id: number) {
    const hotelRoomTripDetailsDeleted = await ServiceTripDetailsModel.delete({
      where: { id },
      select: this.serviceTripDetailsMapper.select,
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2003")
        throw CustomError.notFound("Cotización de servicio no encontrada");
      throw CustomError.internalServer(error.message);
    });

    return new ApiResponse<number>(
      204,
      "Cotización de habitación eliminada correctamente",
      hotelRoomTripDetailsDeleted.id
    );
  }
}
