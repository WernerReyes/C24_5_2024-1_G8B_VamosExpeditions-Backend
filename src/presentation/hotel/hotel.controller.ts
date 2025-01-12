import type { Request, Response } from "express";
import { AppController } from "../controller";
import { HotelService } from "./hotel.service";
import { GetHotelsDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class HotelController extends AppController {
  constructor(private readonly HotelService: HotelService) {
    super();
  }
  public getAll = async (req: Request, res: Response) => {
    const [error, getHotelsDto] = GetHotelsDto.create(req.query);
    if (error) return this.handleError(res, CustomError.badRequest(error));
    return this.HotelService.getAll(getHotelsDto!)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleError(res, error));
  };

  // public countryAndCity = async (req: Request, res: Response) => {
  //   /*     const country = req.query.country as string;
  //       const city = req.query.city as string; */
  //   const { country, city } = req.params;

  //   this.HotelService.getAllHotelRooms(country, city)
  //     .then((rooms) => res.status(200).json(rooms))
  //     .catch((error) => this.handleError(res, error));
  // };
}
