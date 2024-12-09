import { type accommodation_room } from "@prisma/client";
import { AccommodationRoomEntity } from "@/domain/entities";
import { AppResponse } from "@/presentation/response";

export class AccommodationRoomResponse {
  getAll(
    accommodationRooms: accommodation_room[]
  ): AppResponse<AccommodationRoomEntity[]> {
    return {
      status: 200,
      message: "Habitaciones de alojamiento obtenidas correctamente",
      data: accommodationRooms.map((accommodationRoom) =>
        AccommodationRoomEntity.fromJson(accommodationRoom)
      ),
    };
  }
}
