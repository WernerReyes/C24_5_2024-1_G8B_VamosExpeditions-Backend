import { type Reservation, ReservationEntity } from "@/domain/entities";
import { AppResponse } from "@/presentation/response";

export class ReservationResponse {
  reservationCreated(reservation: Reservation): AppResponse<ReservationEntity> {
    return {
      status: 201,
      message: "Reserva creada",
      data: ReservationEntity.fromObject(reservation),
    };
  }

  reservationUpdated(reservation: Reservation): AppResponse<ReservationEntity> {
    return {
      status: 200,
      message: "Reserva actualizada",
      data: ReservationEntity.fromObject(reservation),
    };
  }

  reservationFound(reservation: Reservation): AppResponse<ReservationEntity> {
    return {
      status: 200,
      message: "Reserva encontrada",
      data: ReservationEntity.fromObject(reservation),
    };
  }

  reservationsFound(
    reservations: Reservation[]
  ): AppResponse<ReservationEntity[]> {
    return {
      status: 200,
      message: "Reservas encontradas",
      data: reservations.map((reservation) =>
        ReservationEntity.fromObject(reservation)
      ),
    };
  }
}
