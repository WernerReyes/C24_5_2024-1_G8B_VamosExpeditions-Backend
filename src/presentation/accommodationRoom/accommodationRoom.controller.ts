import type { Request, Response } from "express";
import { AppController } from "../controller";
import { AccommodationRoomService } from "./accommodationRoom.service";

export class AccommodationRoomController extends AppController {
  constructor(
    private readonly accommodationRoomService: AccommodationRoomService
  ) {
    super();
  }
  public getAll = async (req: Request, res: Response) => {
    return this.accommodationRoomService
      .getAll()
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleError(res, error));
  };
}
