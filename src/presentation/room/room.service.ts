import { RoomDto } from "@/domain/dtos";
import { ApiResponse } from "../response";
import { RoomMapper } from "./room.mapper";
import { hotel_room } from "@prisma/client";
import { CustomError } from "@/domain/error";
import { HotelRoomModel } from "@/infrastructure/models";

export class RoomService {
  public constructor(private readonly roomMapper: RoomMapper) {}

  public async upsertRoom(roomDto: RoomDto) {
    this.roomMapper.setDto = roomDto;
    let roomData: hotel_room;

    const existingRoom = await HotelRoomModel.findUnique({
      where: {
        id_hotel_room: roomDto.roomId,
      },
    });
    if (existingRoom) {
      roomData = await HotelRoomModel.update({
        where: {
          id_hotel_room: roomDto.roomId,
        },
        data: this.roomMapper.updateRoom,
      });
    } else {
      roomData = await HotelRoomModel.create({
        data: this.roomMapper.createRoom,
      });
    }

    return new ApiResponse(
      200,
      roomDto.roomId > 0
        ? "Habitación actualizada correctamente"
        : "Habitación creada correctamente",

      roomData
    );
  }
}
