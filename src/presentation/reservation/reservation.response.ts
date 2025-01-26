import { type Reservation, ReservationEntity } from "@/domain/entities";
import { ApiResponse } from "@/presentation/response";

export class ReservationResponse {
  reservationUpserted(reservation: Reservation, id?: number) {
    return new ApiResponse<ReservationEntity>(
      201,
      id === 0 ? "Reserva creada" : "Reserva actualizada",
      ReservationEntity.fromObject(reservation)
    );
  }

  reservationFound(reservation: Reservation) {
    return new ApiResponse<ReservationEntity>(
      200,
      "Reserva encontrada",
      ReservationEntity.fromObject(reservation)
    );
  }

  reservationsFound(reservations: Reservation[]) {
    return new ApiResponse<ReservationEntity[]>(
      200,
      "Reservas encontradas",
      reservations.map(ReservationEntity.fromObject)
    );
  }
}
