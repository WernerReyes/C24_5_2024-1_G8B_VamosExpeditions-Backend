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

}