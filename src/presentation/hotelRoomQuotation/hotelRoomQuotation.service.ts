import type {
  GetHotelRoomQuotationsDto,
  HotelRoomQuotationDto,
} from "@/domain/dtos";
import type { HotelRoomQuotationMapper } from "./hotelRoomQuotation.mapper";
import type { HotelRoomQuotationResponse } from "./hotelRoomQuotation.response";
import {
  HotelRoomModel,
  HotelRoomQuotationModel,
  VersionQuotationModel,
} from "@/data/postgres";
import { CustomError } from "@/domain/error";
import { InsertManyHotelRoomQuotationsDto } from "../../domain/dtos/hotelRoomQuotation/insertManyRoomQuotation.dto";
import {
  HotelRoomQuotation,
  HotelRoomQuotationEntity,
} from "@/domain/entities";

export class HotelRoomQuotationService {
  constructor(
    private readonly hotelRoomQuotationMapper: HotelRoomQuotationMapper,
    private readonly hotelRoomQuotationResponse: HotelRoomQuotationResponse
  ) {}

  public async createHotelRoomQuotation(
    hotelRoomQuotationDto: HotelRoomQuotationDto
  ) {
    try {
      this.hotelRoomQuotationMapper.setDto = hotelRoomQuotationDto;

      const existHotelRoomQuotation = await HotelRoomQuotationModel.findFirst({
        where: {
          hotel_room_id: hotelRoomQuotationDto.hotelRoomId,
          version_number:
            hotelRoomQuotationDto.versionQuotationId.versionNumber,
          quotation_id: hotelRoomQuotationDto.versionQuotationId.quotationId,
          day: hotelRoomQuotationDto.day,
        },
      });
      if (existHotelRoomQuotation)
        throw CustomError.badRequest(
          "Ya existe una habitación cotizada para este día"
        );

      //* Validate if the days range is correct
      await this.validateDaysRange(hotelRoomQuotationDto);

      const hotelRoomExists = await HotelRoomModel.findUnique({
        where: { id_hotel_room: hotelRoomQuotationDto.hotelRoomId },
      });

      if (!hotelRoomExists)
        throw CustomError.notFound("Habitación no encontrada");

      const hotelRoomQuotation = await HotelRoomQuotationModel.create({
        data: this.hotelRoomQuotationMapper.toCreate,
        include: this.hotelRoomQuotationMapper.toSelectInclude,
      });

      return this.hotelRoomQuotationResponse.createdHotelRoomQuotation(
        hotelRoomQuotation
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer(`${error}`);
    }
  }

  public async insertManyHotelRoomQuotations(
    insertManyHotelRoomQuotationsDto: InsertManyHotelRoomQuotationsDto
  ) {
    const hotelRoomQuotations: HotelRoomQuotationEntity[] = [];
    const skippedDays: number[] = [];

    for (
      let i = insertManyHotelRoomQuotationsDto.dayRange[0];
      i <= insertManyHotelRoomQuotationsDto.dayRange[1];
      i++
    ) {
      try {
        const { data } = await this.createHotelRoomQuotation({
          hotelRoomId: insertManyHotelRoomQuotationsDto.hotelRoomId,
          versionQuotationId:
            insertManyHotelRoomQuotationsDto.versionQuotationId,
          day: i,
          numberOfPeople: insertManyHotelRoomQuotationsDto.numberOfPeople,
        });
        hotelRoomQuotations.push(data); // Add successful response to the array
      } catch (error) {
        // Handle specific error for "Already exists"
        if (
          error instanceof CustomError &&
          error.message.includes(
            "Ya existe una habitación cotizada para este día"
          )
        ) {
          skippedDays.push(i); // Add the skipped day to the
          continue; // Skip to the next iteration
        }
        // Re-throw any other error
        throw CustomError.internalServer(`${error}`);
      }
    }

    // Check if all days were skipped
    if (
      skippedDays.length ===
      insertManyHotelRoomQuotationsDto.dayRange[1] -
        insertManyHotelRoomQuotationsDto.dayRange[0] +
        1
    ) {
      throw CustomError.badRequest(
        `No se pudo insertar ninguna habitación cotizada: ya existen cotizaciones para todos los días (${skippedDays.join(
          ", "
        )})`
      );
    }

    return this.hotelRoomQuotationResponse.createdManyHotelRoomQuotations(
      hotelRoomQuotations
    );
  }

  public async deleteHotelRoomQuotation(id: number) {
    const hotelRoomQuotation = await HotelRoomQuotationModel.findUnique({
      where: { id_hotel_room_quotation: id },
    });

    if (!hotelRoomQuotation)
      throw CustomError.notFound("Cotización de habitación no encontrada");

    const hotelRoomQuotationDeleted = await HotelRoomQuotationModel.delete({
      where: { id_hotel_room_quotation: id },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    });

    return this.hotelRoomQuotationResponse.deletedHotelRoomQuotation(
      hotelRoomQuotationDeleted
    );
  }

  public async getHotelRoomQuotations({
    versionQuotationId,
  }: GetHotelRoomQuotationsDto) {
    console.log("versionQuotationId", versionQuotationId);
    const hotelRoomsQuotation = await HotelRoomQuotationModel.findMany({
      where: {
        version_number: versionQuotationId?.versionNumber,
        quotation_id: versionQuotationId?.quotationId,
      },
      include: this.hotelRoomQuotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return this.hotelRoomQuotationResponse.foundHotelRoomsQuotation(
      hotelRoomsQuotation
    );
  }

  private async validateDaysRange(
    hotelRoomQuotationDto: HotelRoomQuotationDto
  ) {
    const daysRange = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number:
            hotelRoomQuotationDto.versionQuotationId.versionNumber,
          quotation_id: hotelRoomQuotationDto.versionQuotationId.quotationId,
        },
      },
      select: {
        reservation: {
          select: {
            number_of_people: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (!daysRange) throw CustomError.notFound("Cotización no encontrada");

    if (!daysRange.reservation)
      throw CustomError.notFound("La cotización no tiene una reserva");

    const totalDays =
      Math.abs(
        (daysRange.reservation.end_date.getTime() -
          daysRange.reservation.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (hotelRoomQuotationDto.day > totalDays)
      throw CustomError.badRequest(
        "El día no puede ser mayor al rango de días de la cotización"
      );

      console.log("hotelRoomQuotationDto.numberOfPeople", hotelRoomQuotationDto.numberOfPeople, daysRange.reservation.number_of_people);

    if (
      hotelRoomQuotationDto.numberOfPeople >
      daysRange.reservation.number_of_people
    )
      throw CustomError.badRequest(
        "El número de personas no puede ser mayor al número de personas de la reserva"
      );
  }
}
