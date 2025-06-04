import { RoomDto, TrashDto } from "@/domain/dtos";
import { ApiResponse } from "../response";
import { RoomMapper } from "./room.mapper";
import { hotel_room } from "@prisma/client";
import { CustomError } from "@/domain/error";
import { HotelRoomModel } from "@/infrastructure/models";
import { HotelRoomEntity } from "@/domain/entities";

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

  public async trashRoom({ id, deleteReason }: TrashDto) {
    const room = await HotelRoomModel.findUnique({
      where: {
        id_hotel_room: id,
      },
      select: {
        id_hotel_room: true,
        is_deleted: true,
        hotel_room_trip_details: {
          select: {
            id: true,
            hotel_room_id: true,
          },
        },
      },
    });

    if (!room)
      throw CustomError.notFound(`No se encontró la habitación con id ${id}`);
    if (room.hotel_room_trip_details.length > 0) {
      throw CustomError.badRequest(
        `No se puede eliminar la habitación con id ${id} porque tiene detalles de viaje asociados`
      );
    }

    const roomDeleted = await HotelRoomModel.update({
      where: {
        id_hotel_room: id,
      },
      data: {
        deleted_at: room.is_deleted ? null : new Date(),
        is_deleted: !room.is_deleted,
        delete_reason: room.is_deleted ? null : deleteReason,
      },
    });

    return new ApiResponse<HotelRoomEntity>(
      200,
      room.is_deleted
        ? "Habitaciones restaurado correctamente"
        : "Habitaciones eliminado correctamente",
      await HotelRoomEntity.fromObject(roomDeleted)
    );
  }

  public async restoreRoom(id: RoomDto["roomId"]) {
    return this.trashRoom({ id, deleteReason: undefined });
  }
}
