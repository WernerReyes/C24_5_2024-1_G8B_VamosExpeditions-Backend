import {
  HotelRoomTripDetailsModel,
  prisma,
  TripDetailsModel,
} from "@/data/postgres";
import type {
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
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DateAdapter } from "@/core/adapters";
import { DateUtils } from "@/core/utils/date";

export class HotelRoomTripDetailsService {
  constructor(
    private readonly hotelRoomTripDetailsMapper: HotelRoomTripDetailsMapper
  ) {}

  public async insertManyHotelRoomTripDetails(
    insertManyHotelRoomTripDetailsDto: InsertManyHotelRoomTripDetailsDto
  ) {
    this.hotelRoomTripDetailsMapper.setDto = insertManyHotelRoomTripDetailsDto;

    //* Validate if the date is within the range of the quotation
    await this.validateDateRange(insertManyHotelRoomTripDetailsDto);

    const hotelRoomTripDetails =
      await HotelRoomTripDetailsModel.createManyAndReturn({
        data: this.hotelRoomTripDetailsMapper.createMany,
        include: this.hotelRoomTripDetailsMapper.toSelectInclude,
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2003")
          throw CustomError.notFound("Hotel no encontrada");

        throw CustomError.internalServer(error.message);
      });

    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      201,
      "Cotizaciones de habitaciones creadas correctamente",
      await Promise.all(
        hotelRoomTripDetails.map((hotelRoomTripDetails) =>
          HotelRoomTripDetailsEntity.fromObject(hotelRoomTripDetails)
        )
      )
    );
  }

  private async validateDateRange({
    tripDetailsId,
    costPerson,
    dateRange,
  }: InsertManyHotelRoomTripDetailsDto) {
    const tripDetails = await TripDetailsModel.findUnique({
      where: {
        id: tripDetailsId,
      },
      select: {
        start_date: true,
        end_date: true,
        number_of_people: true,
        // hotel_room_trip_details: {
        //   select: {
        //     id: true,
        //     number_of_people: true,
        //     date: true,
        //     hotel_room: {
        //       select: {
        //         capacity: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    if (!tripDetails) throw CustomError.notFound("Cotización no encontrada");

    // if (numberOfPeople > tripDetails.number_of_people)
    //   throw CustomError.badRequest(
    //     "El número de personas no coincide con la cantidad de personas de los detalles de reserva"
    //   );

    // Filtrar solo las reservas que corresponden al mismo día
    // const reservationsForTheDay = dateRange.hotel_room_trip_details.filter(
    //   (hotelRoomTripDetails) =>
    //     DateAdapter.resetTimeToMidnight(hotelRoomTripDetails.date).getTime() ===
    //     DateAdapter.resetTimeToMidnight(HotelRoomTripDetailsDto.date).getTime()
    // );

    // Calcular la cantidad total de personas para ese día, incluyendo la nueva reserva
    // const totalPeopleForTheDay =
    //   reservationsForTheDay.reduce(
    //     (sum, reservation) => sum + (reservation?.number_of_people ?? 0),
    //     0
    //   ) + HotelRoomTripDetailsDto.numberOfPeople;

    // // Verificar si supera la capacidad de la habitación
    // if (totalPeopleForTheDay > dateRange.number_of_people) {
    //   throw CustomError.badRequest(
    //     "El número de personas no puede ser mayor a la capacidad de la habitación para este día"
    //   );
    // }

    const [currentStartDate, currentEndDate] = dateRange;

    // const startDate = DateUtils.resetTimeToMidnight(tripDetails.start_date);
    const startDate = DateAdapter.parseISO(tripDetails.start_date);
    // const endDate = DateUtils.resetTimeToMidnight(tripDetails.end_date);
    const endDate = DateAdapter.parseISO(tripDetails.end_date);

    if (
      currentStartDate.getTime() < startDate.getTime() ||
      currentEndDate.getTime() > endDate.getTime()
    ) {
      throw CustomError.badRequest(
        "La fecha no puede ser menor a la fecha de inicio o mayor a la fecha de fin de la cotización"
      );
    }
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
      select: {
        id: true,
        date: true,
      },
    });
    if (hotelRoomTripDetails.length === 0)
      throw CustomError.notFound(
        "No se encontraron cotizaciones de habitación"
      );

    const updatedManyHotelRoomTripDetails: HotelRoomTripDetails[] = [];

    await prisma
      .$transaction(async () => {
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
      })
      .catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2003")
          throw CustomError.notFound("Hotel no encontrada");

        throw CustomError.internalServer(error.message);
      });

    return new ApiResponse<HotelRoomTripDetailsEntity[]>(
      200,
      `${updatedManyHotelRoomTripDetails.length} detalles de habitación actualizados correctamente`,
      await Promise.all(
        updatedManyHotelRoomTripDetails.map(
          HotelRoomTripDetailsEntity.fromObject
        )
      )
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
      await HotelRoomTripDetailsEntity.fromObject(hotelRoomTripDetailsDeleted)
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
      await Promise.all(
        hotelRoomTripDetails.map(HotelRoomTripDetailsEntity.fromObject)
      )
    );
  }
}
