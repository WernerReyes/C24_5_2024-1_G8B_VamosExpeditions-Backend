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

  public createdManyHotelRoomQuotations(
    hotelRoomQuotations: HotelRoomQuotationEntity[]
  ) {
    return new ApiResponse<HotelRoomQuotationEntity[]>(
      201,
      `${hotelRoomQuotations.length} cotizaciones de habitación creadas correctamente`,
      hotelRoomQuotations
    );
  }

  public updatedManyHotelRoomQuotations(hotelRoomQuotations: HotelRoomQuotation[]) {
    return new ApiResponse<HotelRoomQuotationEntity[]>(
      200,
      `${hotelRoomQuotations.length} cotizaciones de habitación actualizadas correctamente`,
      hotelRoomQuotations.map(HotelRoomQuotationEntity.fromObject)
    );
  }

  public deletedHotelRoomQuotation(hotelRoomQuotation: HotelRoomQuotation) {
    return new ApiResponse<HotelRoomQuotationEntity>(
      204,
      "Cotización de habitacion eliminada correctamente",
      HotelRoomQuotationEntity.fromObject(hotelRoomQuotation)
    );
  }

  public deletedManyHotelRoomQuotations(
    hotelRoomsQuotation: HotelRoomQuotation[]
  ) {
    return new ApiResponse<HotelRoomQuotationEntity[]>(
      204,
      `${hotelRoomsQuotation.length === 1 ? "cotización" : "cotizaciones"} de habitación eliminadas correctamente`,
      hotelRoomsQuotation.map(HotelRoomQuotationEntity.fromObject)
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
