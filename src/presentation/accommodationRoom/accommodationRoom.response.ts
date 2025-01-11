import { type accommodation_room, accommodation, city } from "@prisma/client";
import { AccommodationRoomEntity, City, CityEntity } from "@/domain/entities";
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

  getAlls(accommodationRooms: City[]): AppResponse<CityEntity[]> {
    return accommodationRooms.length === 0
      ? {
          status: 200,
          message: "No hay habitaciones disponibles",
          data: [],
        }
      : {
          status: 200,
          message: "Habitaciones de alojamiento obtenidas correctamente",
          data: accommodationRooms.map(CityEntity.fromObject),
        };
  }
}
