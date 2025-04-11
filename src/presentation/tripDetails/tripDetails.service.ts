import {
  ClientModel,
  prisma,
  TripDetailsHasCityModel,
  TripDetailsModel,
} from "@/data/postgres";
import type { TripDetailsDto } from "@/domain/dtos";
import { TripDetailsEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../response";
import { TripDetailsMapper } from "./tripDetails.mapper";

export class TripDetailsService {
  constructor(private tripDetailsMapper: TripDetailsMapper) {}

  public async upsertTripDetails(
    tripDetailsDto: TripDetailsDto
  ): Promise<ApiResponse<TripDetailsEntity>> {
    const clientExists = await ClientModel.findUnique({
      where: { id: tripDetailsDto.clientId },
    });

    if (!clientExists) throw CustomError.notFound("Client not found");

    this.tripDetailsMapper.setDto = tripDetailsDto;

    const [_, tripDetails] = await prisma
      .$transaction([
        TripDetailsHasCityModel.deleteMany({
          where: { trip_details_id: tripDetailsDto.id },
        }),
        TripDetailsModel.upsert({
          where: {
            version_number_quotation_id: {
              version_number: tripDetailsDto.versionQuotationId!.versionNumber,
              quotation_id: tripDetailsDto.versionQuotationId!.quotationId,
            },
          },
          create: this.tripDetailsMapper.toUpsert,
          update: this.tripDetailsMapper.toUpsert,
          include: this.tripDetailsMapper.toSelectInclude,
        }),
      ])
      .catch((error) => {
        throw CustomError.internalServer(`${error}`);
      });

    return new ApiResponse<TripDetailsEntity>(
      200,
      (tripDetailsDto.id === 0
        ? "Detalles del viaje creados"
        : "Detalles del viaje actualizados") + " correctamente",
      await TripDetailsEntity.fromObject(tripDetails)
    );
  }
}
