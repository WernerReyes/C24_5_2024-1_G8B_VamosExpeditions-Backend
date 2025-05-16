import { Request, Response } from "express";
import { AppController } from "../controller";
import { RoomService } from "./room.service";
import { RoomDto } from "@/domain/dtos";

export class RoomController extends AppController {
  public constructor(private readonly roomService: RoomService) {
    super();
  }

  public upsertRoom = async (req: Request, res: Response) => {
    const [error, room] = RoomDto.create({
      ...req.body,
      roomId: req.params.id,
    });
    console.log("room", room);
    if (error) return this.handleResponseError(res, error);

    this.handleError(this.roomService.upsertRoom(room!))
      .then((room) => res.status(200).json(room))
      .catch((error) => this.handleResponseError(res, error));
  };
}
