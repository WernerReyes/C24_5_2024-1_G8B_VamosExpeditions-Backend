import {
  type HotelRoomQuotation,
  HotelRoomQuotationEntity,
} from "@/domain/entities";
import { ApiResponse } from "../response";

export class HotelRoomQuotationResponse {
  public createdHotelRoomQuotation(hotelRoomQuotation: HotelRoomQuotation) {
    return new ApiResponse<HotelRoomQuotationEntity>(
      201,
      "Cotización de habitación creada correctamente",
      HotelRoomQuotationEntity.fromObject(hotelRoomQuotation)
    );
  }

  public deletedHotelRoomQuotation(hotelRoomQuotation: HotelRoomQuotation) {
    return new ApiResponse<HotelRoomQuotationEntity>(
      204,
      "Cotización de habitacion eliminada correctamente",
      HotelRoomQuotationEntity.fromObject(hotelRoomQuotation)
    );
  }

  public foundHotelRoomsQuotation(hotelRoomsQuotation: HotelRoomQuotation[]) {
    return new ApiResponse<HotelRoomQuotationEntity[]>(
      200,
      "Cotización de habitación encontrada",
      hotelRoomsQuotation.map((hotelRoomQuotation) =>
        HotelRoomQuotationEntity.fromObject(hotelRoomQuotation)
      )
    );
  }
}
