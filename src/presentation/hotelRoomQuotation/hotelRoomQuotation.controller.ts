import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { HotelRoomQuotationService } from "./hotelRoomQuotation.service";
import {
  HotelRoomQuotationDto,
  InsertManyHotelRoomQuotationsDto,
  GetHotelRoomQuotationsDto,
  DeleteManyHotelRoomQuotationsByDateDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class HotelRoomQuotationController extends AppController {
  constructor(
    private readonly hotelRoomQuotationService: HotelRoomQuotationService
  ) {
    super();
  }

  public createHotelRoomQuotation = async (req: Request, res: Response) => {
    const [error, hotelRoomQuotationDto] = HotelRoomQuotationDto.create(
      req.body
    );
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.hotelRoomQuotationService
      .createHotelRoomQuotation(hotelRoomQuotationDto!)
      .then((hotelRoomQuotation) => res.status(201).json(hotelRoomQuotation))
      .catch((error) => this.handleError(res, error));
  };

  public insertManyHotelRoomQuotations = async (
    req: Request,
    res: Response
  ) => {
    const [error, insertManyHotelRoomQuotationsDto] =
      InsertManyHotelRoomQuotationsDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.hotelRoomQuotationService
      .insertManyHotelRoomQuotations(insertManyHotelRoomQuotationsDto!)
      .then((hotelRoomQuotations) => res.status(201).json(hotelRoomQuotations))
      .catch((error) => this.handleError(res, error));
  };

  public deleteHotelRoomQuotation = async (req: Request, res: Response) => {
    const hotelRoomQuotationId = req.params.id;
    this.hotelRoomQuotationService
      .deleteHotelRoomQuotation(+hotelRoomQuotationId)
      .then((hotelRoomQuotation) => res.status(200).json(hotelRoomQuotation))
      .catch((error) => this.handleError(res, error));
  };

  public deleteManyHotelRoomQuotations = async (
    req: Request,
    res: Response
  ) => {
    console.log("Headers: ", req.headers);
    // console.log(req.body);
    // const hotelRoomQuotationIds = req.body;
    // this.hotelRoomQuotationService
    //   .deleteManyHotelRoomQuotations(hotelRoomQuotationIds)
    //   .then((message) => res.status(204).json(message))
    //   .catch((error) => this.handleError(res, error));
  };

  public getHotelRoomQuotations = async (req: Request, res: Response) => {
    const [error, getHotelRoomQuotationsDto] = GetHotelRoomQuotationsDto.create(
      req.query
    );
    if (error) return this.handleError(res, CustomError.badRequest(error));
    this.hotelRoomQuotationService
      .getHotelRoomQuotations(getHotelRoomQuotationsDto!)
      .then((hotelRoomQuotation) => res.status(200).json(hotelRoomQuotation))
      .catch((error) => this.handleError(res, error));
  };
}
