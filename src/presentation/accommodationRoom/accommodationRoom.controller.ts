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

  public countryAndCity = async (req: Request, res: Response) => {
    /*     const country = req.query.country as string;
        const city = req.query.city as string; */
    const { country, city } = req.params;

    this.accommodationRoomService
      .getAllHotelRooms(country, city)
      .then((rooms) => res.status(200).json(rooms))
      .catch((error) => this.handleError(res, error));
  };
}
