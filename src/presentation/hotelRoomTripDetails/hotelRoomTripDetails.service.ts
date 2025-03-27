import { DateUtils } from "@/core/utils";
import {
  HotelRoomModel,
  HotelRoomTripDetailsModel,
  TripDetailsModel,
} from "@/data/postgres";
import type {
  GetManyHotelRoomTripDetailsDto,
  HotelRoomTripDetailsDto,
  InsertManyHotelRoomTripDetailsDto,
  UpdateManyHotelRoomTripDetailsByDateDto,
} from "@/domain/dtos";
import {
  HotelRoomTripDetails,
  HotelRoomTripDetailsEntity,
} from "@/domain/entities";
import { CustomError } from "@/domain/error";
import type { HotelRoomTripDetailsMapper } from "./hotelRoomTripDetails.mapper";
import { ApiResponse } from "../response";

export class HotelRoomTripDetailsService {
  constructor(
    private readonly hotelRoomTripDetailsMapper: HotelRoomTripDetailsMapper
  ) {}

  public async createHotelRoomTripDetails(
    hotelRoomTripDetailsDto: HotelRoomTripDetailsDto
  ) {
    this.hotelRoomTripDetailsMapper.setDto = hotelRoomTripDetailsDto;

    const existHotelRoomTripDetails =
      await HotelRoomTripDetailsModel.findUnique({
        where: {
          hotel_room_id_date_trip_details_id: {
            hotel_room_id: hotelRoomTripDetailsDto.hotelRoomId,
            trip_details_id: hotelRoomTripDetailsDto.tripDetailsId,
            date: hotelRoomTripDetailsDto.date,
          },
        },
      });

    if (existHotelRoomTripDetails)
      throw CustomError.badRequest(
        "Ya existe una habitación cotizada para este día"
      );

    //* Validate if the date is within the range of the quotation
    await this.validateDateRange(hotelRoomTripDetailsDto);

    const hotelRoomExists = await HotelRoomModel.findUnique({
      where: { id_hotel_room: hotelRoomTripDetailsDto.hotelRoomId },
    });

    if (!hotelRoomExists)
      throw CustomError.notFound("Habitación no encontrada");

    const hotelRoomTripDetails = await HotelRoomTripDetailsModel.create({
      data: this.hotelRoomTripDetailsMapper.toCreate,
      include: this.hotelRoomTripDetailsMapper.toSelectInclude,
    });

    return new ApiResponse<HotelRoomTripDetailsEntity>(
      201,
      "Cotización de habitación creada correctamente",
      HotelRoomTripDetailsEntity.fromObject(hotelRoomTripDetails)
    );
  }

  public async insertManyHotelRoomTripDetails(
    InsertManyHotelRoomTripDetailsDto: InsertManyHotelRoomTripDetailsDto
  ) {
    const hotelRoomTripDetails: HotelRoomTripDetailsEntity[] = [];
    const skippedDays: number[] = [];

    const diffTimeInDays =
      Math.abs(
        InsertManyHotelRoomTripDetailsDto.dateRange[1].getTime() -
          InsertManyHotelRoomTripDetailsDto.dateRange[0].getTime()
      ) /
        (1000 * 60 * 60 * 24) +
      1; //* Add 1 to include the last day

    const date = new Date(InsertManyHotelRoomTripDetailsDto.dateRange[0]);

    for (let i = 0; i < diffTimeInDays; i++) {
      try {
        const { data } = await this.createHotelRoomTripDetails({
          hotelRoomId: InsertManyHotelRoomTripDetailsDto.hotelRoomId,
          tripDetailsId: InsertManyHotelRoomTripDetailsDto.tripDetailsId,
          date,
          numberOfPeople: InsertManyHotelRoomTripDetailsDto.numberOfPeople,
        });

        hotelRoomTripDetails.push(data);
      } catch (error) {
        if (
          error instanceof CustomError &&
          error.message.includes(
            "Ya existe una habitación cotizada para este día"
          )
        ) {
          skippedDays.push(date.getDate());
        } else {
          throw CustomError.internalServer(`${error}`);
        }
      }

      date.setDate(date.getDate() + 1);
    }

    //* Check if all days were skipped
    if (skippedDays.length === diffTimeInDays) {
      throw CustomError.badRequest(
        `No se pudo insertar ninguna habitación cotizada: ya existen cotizaciones para todos los días (${skippedDays.join(
          ", "
        )})`
      );
    }

    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      201,
      "Cotizaciones de habitaciones creadas correctamente",
      hotelRoomTripDetails
    );
  }

  public async updateManyHotelRoomTripDetailsByDate({
    tripDetailsId,
    startDate,
  }: UpdateManyHotelRoomTripDetailsByDateDto) {
    const hotelRoomTripDetails = await HotelRoomTripDetailsModel.findMany({
      where: {
        trip_details_id: tripDetailsId,
        date: {
          gt: startDate,
        },
      },
   
    });

    const updatedManyHotelRoomTripDetails: HotelRoomTripDetails[] = [];
    if (hotelRoomTripDetails.length > 0) {
      for (let i = 0; i < hotelRoomTripDetails.length; i++) {
        const newDate = new Date(hotelRoomTripDetails[i].date);
        newDate.setDate(newDate.getDate() - 1);
        const updatedHotelRoomTripDetails =
          await HotelRoomTripDetailsModel.update({
            where: {
              id: hotelRoomTripDetails[i].id,
            },
            data: { date: newDate },
            include: this.hotelRoomTripDetailsMapper.toSelectInclude,
          });

        updatedManyHotelRoomTripDetails.push(updatedHotelRoomTripDetails);
      }
    }



    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      200,
      `${updatedManyHotelRoomTripDetails.length} detalles de habitación actualizados correctamente`,
      updatedManyHotelRoomTripDetails.map(HotelRoomTripDetailsEntity.fromObject)
    );
  }

  public async deleteHotelRoomTripDetails(id: number) {
    const hotelRoomTripDetails = await HotelRoomTripDetailsModel.findUnique({
      where: { id },
    });

    if (!hotelRoomTripDetails)
      throw CustomError.notFound("Cotización de habitación no encontrada");

    const hotelRoomTripDetailsDeleted = await HotelRoomTripDetailsModel.delete({
      where: { id },
      include: this.hotelRoomTripDetailsMapper.toSelectInclude,
    });

    return new ApiResponse<HotelRoomTripDetailsEntity>(
      204,
      "Cotización de habitación eliminada correctamente",
      HotelRoomTripDetailsEntity.fromObject(hotelRoomTripDetailsDeleted)
    );
  }

  public async deleteManyHotelRoomTripDetails(ids: number[]) {
    const hotelRoomTripDetails = await HotelRoomTripDetailsModel.findMany({
      where: { id: { in: ids } },
      include: this.hotelRoomTripDetailsMapper.toSelectInclude,
    });

    if (hotelRoomTripDetails.length === 0)
      throw CustomError.notFound("Cotizaciones de habitaciones no encontradas");

    await HotelRoomTripDetailsModel.deleteMany({
      where: { id: { in: ids } },
    });

    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      204,
      `${
        hotelRoomTripDetails.length === 1 ? "Cotización" : "Cotizaciones"
      } de habitación eliminada${
        hotelRoomTripDetails.length === 1 ? "" : "s"
      } correctamente`,
      hotelRoomTripDetails.map(HotelRoomTripDetailsEntity.fromObject)
    );
  }

  public async getHotelRoomTripDetails({
    tripDetailsId,
  }: GetManyHotelRoomTripDetailsDto) {
    const hotelRoomsTripDetails = await HotelRoomTripDetailsModel.findMany({
      where: {
        trip_details_id: tripDetailsId,
      },
      include: this.hotelRoomTripDetailsMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      200,
      "Cotizaciones de habitaciones encontradas",
      hotelRoomsTripDetails.map((hotelRoomTripDetails) =>
        HotelRoomTripDetailsEntity.fromObject(hotelRoomTripDetails)
      )
    );
  }

  private async validateDateRange(
    HotelRoomTripDetailsDto: HotelRoomTripDetailsDto
  ) {
    const dateRange = await TripDetailsModel.findUnique({
      where: {
        id: HotelRoomTripDetailsDto.tripDetailsId,
      },
      select: {
        start_date: true,
        end_date: true,
        number_of_people: true,
      },
    });

    if (!dateRange) throw CustomError.notFound("Cotización no encontrada");

    if (HotelRoomTripDetailsDto.numberOfPeople > dateRange.number_of_people)
      throw CustomError.badRequest(
        "El número de personas no coincide con la cantidad de personas de la reserva"
      );

    const currentDate = DateUtils.resetTimeToMidnight(
      HotelRoomTripDetailsDto.date
    );
    const startDate = DateUtils.resetTimeToMidnight(dateRange.start_date);
    const endDate = DateUtils.resetTimeToMidnight(dateRange.end_date);

    if (
      currentDate.getTime() < startDate.getTime() ||
      currentDate.getTime() > endDate.getTime()
    ) {
      throw CustomError.badRequest(
        "La fecha no puede ser menor a la fecha de inicio o mayor a la fecha de fin de la cotización"
      );
    }
  }
}
