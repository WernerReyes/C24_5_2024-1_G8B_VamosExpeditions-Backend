import { GetHotelsDto } from "@/domain/dtos";

export class HotelMapper {
  public toFilterForGetAll({ cityId, countryId }: GetHotelsDto) {
    return {
      distrit: {
        city: {
          id_city: cityId,
          country: {
            id_country: countryId,
          },
        },
      },
    };
  }

  public get toSelectInclude() {
    return {
      hotel_room: true,
      distrit: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
    };
  }
}
