import { AccommodationRoomModel } from "@/data/postgres";
import { AccommodationRoomResponse } from "./accommodationRoom.response";

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

  public async getAllByCity(cityId: number) {
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
  }

}
