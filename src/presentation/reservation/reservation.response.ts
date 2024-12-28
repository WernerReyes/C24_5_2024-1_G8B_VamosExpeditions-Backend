import { ReservationEntity } from "@/domain/entities/reservation.entity";
import { AppResponse } from "@/presentation/response";


export class ReservationResponse{


    reservationCreated(
        reservation: ReservationEntity,
      ): AppResponse<ReservationEntity> {
        return {
          status: 201,
          message: "Reserva creada",
          data: reservation,
        };
      }

      reservationFound(
        reservation: ReservationEntity,
      ): AppResponse<ReservationEntity> {
        return {
          status: 200,
          message: "Reserva encontrada",
          data: reservation,
        };
      }

}