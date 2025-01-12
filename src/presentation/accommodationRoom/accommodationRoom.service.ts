import { AccommodationRoomModel, CountryModel } from "@/data/postgres";
import { AccommodationRoomResponse } from "./accommodationRoom.response";
import { CustomError } from "@/domain/error";
import { City, CityEntity } from "@/domain/entities";

export class AccommodationRoomService {
  constructor(
    private readonly accommodationRoomResponse: AccommodationRoomResponse
  ) {}

  public getAll = async () => {
    const accommodationRooms = await AccommodationRoomModel.findMany({
      include: {
        accommodation: {
          include: {
            distrit: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.accommodationRoomResponse.getAll(accommodationRooms);
  };

  /*   public async getAllByCity(cityId: number) {
    const accommodationRooms = await AccommodationRoomModel.findMany({
      where: {
        accommodation: {
          distrit: {
            // cityId,
          },
        },
      },
      include: {
        accommodation: {
          include: {
            distrit: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.accommodationRoomResponse.getAll(accommodationRooms);
  } */

  public async getAllHotelRooms(country: string, city: string) {
    if (city === undefined || city === undefined) return;

    try {
      const HotelsByCity = await CountryModel.findMany({
        where: {
          name: {
            contains: country,
            mode: "insensitive",
          },
        },
        select: {
          city: {
            where: {
              name: {
                equals: city,
                mode: "insensitive",
              },
            },
            select: {
              id_city: true,
              name: true,
              distrit: {
                select: {
                  id_distrit: true,
                  name: true,
                  accommodation: {
                    select: {
                      id_accommodation: true,
                      category: true,
                      name: true,
                      address: true,
                      rating: true,
                      email: true,
                      accommodation_room: {
                        select: {
                          id_accommodation_room: true,
                          room_type: true,
                          price_usd: true,
                          service_tax: true,
                          rate_usd: true,
                          price_pen: true,
                          capacity: true,
                          available: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      /*       const HotelsByCity = await CountryModel.findMany({
        where: {
          name: {
            contains: country,
            mode: "insensitive",
          },
        },
        include: {
          city: {
            where: {
              name: {
                equals: city,
                mode: "insensitive",
              },
            },
            include: {
              distrit: {
                include: {
                  accommodation: {
                    include: {
                      accommodation_room: true,
                    },
                  },
                },
              },
            },
          },
        },
      }); */

      /*       const transformedCities: City[] = HotelsByCity.flatMap((hotelData) =>
        hotelData.city.map((city) => ({
          ...city,
          distrit: city.distrit.map((district) => ({
            ...district,
            accommodation: district.accommodation.map((accom) => ({
              ...accom,
              accommodation_room: accom.accommodation_room,
            })),
          })),
        }))
      ); */

      const data: City[] = HotelsByCity.map((d) => {
        return d.city[0];
      });

      return this.accommodationRoomResponse.getAlls(data);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
