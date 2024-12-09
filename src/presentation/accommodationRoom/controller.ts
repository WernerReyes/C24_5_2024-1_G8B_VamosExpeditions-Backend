import type { Request, Response } from "express";
import { AccommodationRoomService } from "../services/accommodationRoom";
import { AppController } from "../controller";

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
