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

    return this.hotelRoomQuotationResponse.deletedHotelRoomQuotation(hotelRoomQuotationDeleted);
  }

  public async getHotelRoomQuotations({
    versionQuotationId,
  }: GetHotelRoomQuotationsDto) {
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

    if (
      hotelRoomQuotationDto.numberOfPeople >
      daysRange.reservation.number_of_people
    )
      throw CustomError.badRequest(
        "El número de personas no puede ser mayor al número de personas de la reserva"
      );
  }
}
