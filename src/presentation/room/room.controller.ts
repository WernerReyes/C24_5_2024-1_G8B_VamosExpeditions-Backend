import { Request, Response } from "express";
import { AppController } from "../controller";
import { RoomService } from "./room.service";
import { RoomDto, TrashDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class RoomController extends AppController {
  public constructor(private readonly roomService: RoomService) {
    super();
  }

  //! start create, update and delete
  public upsertRoom = async (req: Request, res: Response) => {
    const [error, room] = RoomDto.create({
      ...req.body,
      roomId: req.params.id,
    });
    if (error) return this.handleResponseError(res, error);

    this.handleError(this.roomService.upsertRoom(room!))
      .then((room) => res.status(200).json(room))
      .catch((error) => this.handleResponseError(res, error));
  };

   public trashRoom = (req: Request, res: Response) => {
    
    const [error, trashDto] = TrashDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.roomService.trashRoom(trashDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public restoreRoom = (req: Request, res: Response) => {
    this.handleError(this.roomService.restoreRoom(+req.params.id))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

 
  //! end create, update and delete
}
