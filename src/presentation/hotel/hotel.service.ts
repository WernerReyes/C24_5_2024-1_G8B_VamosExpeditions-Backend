import { HotelModel } from "@/data/postgres";
import { GetHotelsDto } from "@/domain/dtos";
import { HotelMapper } from "./hotel.mapper";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../response";
import { HotelEntity } from "@/domain/entities";

export class HotelService {
  constructor(private readonly hotelMapper: HotelMapper) {}

  public async getAll(getHotelsDto: GetHotelsDto) {
    this.hotelMapper.setDto = getHotelsDto;
    const accommodationRooms = await HotelModel.findMany({
      where: this.hotelMapper.toFilterForGetAll,
      include: this.hotelMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error.message}`);
    });

    return new ApiResponse<HotelEntity[]>(
      200,
      "Lista de hoteles",
      accommodationRooms.map((hotel) => HotelEntity.fromObject(hotel))
    );
  }
}
