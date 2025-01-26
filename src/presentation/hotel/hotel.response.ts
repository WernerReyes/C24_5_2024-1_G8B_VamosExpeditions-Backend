import { type hotel_room, hotel, city } from "@prisma/client";
import { HotelEntity, City, CityEntity, Hotel } from "@/domain/entities";
import { ApiResponse } from "@/presentation/response";

export class HotelResponse {
  getAll(hotels: Hotel[]): ApiResponse<HotelEntity[]> {
    return {
      status: 200,
      message: "Habitaciones de alojamiento obtenidas correctamente",
      data: hotels.map(HotelEntity.fromObject),
    };
  }

  getAlls(accommodationRooms: City[]): ApiResponse<CityEntity[]> {
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
