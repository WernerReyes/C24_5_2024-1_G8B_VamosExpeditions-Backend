import { HotelModel } from "@/data/postgres";
import { HotelResponse } from "./hotel.response";
import { GetHotelsDto } from "@/domain/dtos";
import { HotelMapper } from "./hotel.mapper";
import { CustomError } from "@/domain/error";

export class HotelService {
  constructor(
    private readonly hotelMapper: HotelMapper,
    private readonly hotelResponse: HotelResponse
  ) {}

  public async getAll(getHotelsDto: GetHotelsDto) {
    this.hotelMapper.setDto = getHotelsDto;
    const accommodationRooms = await HotelModel.findMany({
      where: this.hotelMapper.toFilterForGetAll,
      include: this.hotelMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error.message}`);
    });

    return this.hotelResponse.getAll(accommodationRooms);
  }
}
