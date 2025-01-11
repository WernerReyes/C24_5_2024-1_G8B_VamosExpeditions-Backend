import { ReservationModel } from "@/data/postgres";

import { ReservationDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";
import { ReservationMapper } from "./reservation.mapper";
import { ReservationStatus } from "@/domain/entities";
import { Validations } from "@/core/utils";

export class ReservationService {
  constructor(
    private reservationMapper: ReservationMapper,
    private reservationResponse: ReservationResponse
  ) {}

  public async createReservation(reservationDto: ReservationDto) {
    try {
      //* Create reservation
      const reservation = await ReservationModel.create({
        data: this.reservationMapper.toRegister(reservationDto),
        include: this.reservationMapper.toSelectInclude(),
      });
      
      return this.reservationResponse.reservationCreated(reservation);
    } catch (error) {
      console.log("error", error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateReservation(id: number, reservationDto: ReservationDto) {
    const reservation = await ReservationModel.findUnique({
      where: { id },
      include: this.reservationMapper.toSelectInclude(),
    });
    if (!reservation) throw CustomError.notFound("Reservation not found");

    try {
      const updatedReservation = await ReservationModel.update({
        where: { id },
        data: this.reservationMapper.toRegister(reservationDto, "update"),
        include: this.reservationMapper.toSelectInclude(),
      });
    
      return this.reservationResponse.reservationUpdated(updatedReservation);
    } catch (error) {
      console.log("error", error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getReservationById(id: number) {
    const reservation = await ReservationModel.findUnique({
      where: { id },
      include: this.reservationMapper.toSelectInclude(),
    });
    if (!reservation) throw CustomError.notFound("Reservation not found");
    return this.reservationResponse.reservationFound(reservation);
  }

  public async getReservationsByStatus(status: string) {
    const error = Validations.validateEnumValue(
      status,
      Object.values(ReservationStatus)
    );
    if (error) throw CustomError.badRequest(error);
    try {
      const reservations = await ReservationModel.findMany({
        where: { status: status as any },
        include: this.reservationMapper.toSelectInclude(),
      });
      if (!reservations) throw CustomError.notFound("Reservations not found");
      return this.reservationResponse.reservationsFound(reservations);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
