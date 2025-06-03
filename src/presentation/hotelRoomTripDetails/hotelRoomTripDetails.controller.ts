import {
  InsertManyDetailsTripDetailsDto,
  UpdateManyDetailsTripDetailsByDateDto
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { HotelRoomTripDetailsService } from "./hotelRoomTripDetails.service";

export class HotelRoomTripDetailsController extends AppController {
  constructor(
    private readonly hotelRoomTripDetailsService: HotelRoomTripDetailsService
  ) {
    super();
  }

  public insertManyHotelRoomTripDetails = async (
    req: Request,
    res: Response
  ) => {
    const [error, insertManyHotelRoomTripDetailsDto] =
      InsertManyDetailsTripDetailsDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.hotelRoomTripDetailsService.insertManyHotelRoomTripDetails(
        insertManyHotelRoomTripDetailsDto!
      )
    )
      .then((hotelRoomTripDetails) =>
        res.status(201).json(hotelRoomTripDetails)
      )
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateHotelRoomTripDetailsByDate = async (
    req: Request,
    res: Response
  ) => {
    const [error, updateManyHotelRoomTripDetailsByDateDto] =
      UpdateManyDetailsTripDetailsByDateDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.hotelRoomTripDetailsService.updateManyHotelRoomTripDetailsByDate(
        updateManyHotelRoomTripDetailsByDateDto!
      )
    )
      .then((hotelRoomTripDetails) =>
        res.status(200).json(hotelRoomTripDetails)
      )
      .catch((error) => this.handleResponseError(res, error));
  };

  public deleteHotelRoomTripDetails = async (req: Request, res: Response) => {
    const hotelRoomTripDetailsId = req.params.id;
    this.handleError(
      this.hotelRoomTripDetailsService.deleteHotelRoomTripDetails(
        +hotelRoomTripDetailsId
      )
    )
      .then((hotelRoomTripDetails) =>
        res.status(200).json(hotelRoomTripDetails)
      )
      .catch((error) => this.handleResponseError(res, error));
  };

  public deleteManyHotelRoomTripDetails = async (
    req: Request,
    res: Response
  ) => {
    const ids = Array.isArray(req.body.ids);
    if (!ids)
      return this.handleResponseError(
        res,
        CustomError.badRequest("ids must be an array")
      );
    this.handleError(
      this.hotelRoomTripDetailsService.deleteManyHotelRoomTripDetails(
        req.body.ids
      )
    )
      .then((message) => res.status(200).json(message))
      .catch((error) => this.handleResponseError(res, error));
  };
}
