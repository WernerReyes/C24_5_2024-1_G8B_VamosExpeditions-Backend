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
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    return this.handleError(this.HotelService.getAll(getHotelsDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };
}
