import type { Request, Response } from "express";
import { AppController } from "../controller";
import { HotelService } from "./hotel.service";
import { GetHotelsDto, HotelDto, PaginationDto, RoomDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import path from "path";
import * as XLSX from "xlsx";
import { InsertManyHotelExcelDto } from "../../domain/dtos/hotel/insertManyHotelExcel.dto";
import { HotelRoomType } from "@/domain/enum";
import { InsertManyHotelAndRoomExcelDto } from "@/domain/dtos/hotel/insertManyHotelAndRoomExcel.dto";

interface HotelAndRoomDto {
  hotel: HotelDto;
  room: RoomDto;
}

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

  public uploadExcel = async (req: Request, res: Response) => {
    if (!req.file)
      return res
        .status(400)
        .json({ message: "No se ha subido ningun archivo" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const json0 = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      { header: 1 }
    );
    const json1 = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[1]],
      { header: 1 }
    );
    const json2 = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[2]],
      { header: 1 }
    );
    const json3 = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[3]],
      { header: 1 }
    );
    const json4 = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[4]],
      { header: 1 }
    );

    const sheetData = {
      [workbook.SheetNames[0]]: { column: json0[1] as string[] },
      [workbook.SheetNames[1]]: { column: json1[1] as string[] },
      [workbook.SheetNames[2]]: { column: json2[1] as string[] },
      [workbook.SheetNames[3]]: { column: json3[1] as string[] },
      [workbook.SheetNames[4]]: { column: json4[1] as string[] },
    };

    const [error, insertManyHotelExcelDto] =
      InsertManyHotelExcelDto.create(sheetData);

    if (error) {
      this.handleResponseError(res, CustomError.badRequest(error));
      return;
    }

    return this.handleError(
      this.HotelService.uploadExcel(insertManyHotelExcelDto!, workbook)
    )
      .then((response) => {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=hotels.xlsx"
        );

        res.end(response);
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public registerHotelandRoom = async (req: Request, res: Response) => {
    const { type } = req.body;

    if (!Object.values(HotelRoomType).includes(type)) {
      return this.handleResponseError(
        res,
        CustomError.badRequest("Tipo de hotel o habitación no válido")
      );
    }
    const createDto = async (DtoClass: any): Promise<HotelDto | RoomDto> => {
      const [error, dto] = DtoClass.create(req.body);
      if (error) {
        this.handleResponseError(res, CustomError.badRequest(error));
      }
      return dto;
    };

    let dto: HotelAndRoomDto | HotelDto | RoomDto;

    switch (type) {
      case HotelRoomType.HOTEL:
        dto = await createDto(HotelDto);
        break;
      case HotelRoomType.ROOM:
        dto = await createDto(RoomDto);
        break;
      case HotelRoomType.HOTELANDROOM:
        const room = await createDto(RoomDto);
        const hotel = await createDto(HotelDto);
        dto = { hotel, room } as HotelAndRoomDto;
        break;
      default:
        return this.handleResponseError(
          res,
          CustomError.badRequest("Tipo de hotel o habitación no válido")
        );
    }

    if (!dto) {
      return this.handleResponseError(
        res,
        CustomError.badRequest("Error al crear el DTO")
      );
    }

    this.handleError(this.HotelService.registerHotelandRoom(dto!, type))
      .then((response) => res.status(201).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getAllHotel = async (req: Request, res: Response) => {
    this.handleError(this.HotelService.getAllHotel())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getAllHotelsRoomsAndDistricts = async (
    req: Request,
    res: Response
  ) => {
    const [error, paginationDto] = PaginationDto.create(req.query);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.HotelService.getAllHotelsRoomsAndDistricts(paginationDto!)
    )
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  //
  public uploadExcelHotelRoom = async (req: Request, res: Response) => {
    if (!req.file)
      return res
        .status(400)
        .json({ message: "No se ha subido ningun archivo" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheet0 = workbook.Sheets[workbook.SheetNames[0]];
    const sheet1 = workbook.Sheets[workbook.SheetNames[1]];
    
  /*   console.log(XLSX.utils.sheet_to_json(sheet1)); */
    // Solo leer la segunda fila (índice 1)
    const headers0 = (XLSX.utils.sheet_to_json(sheet0, { header: 1, range: 1, raw: false })[0] || []) as string[];
    const headers1 = (XLSX.utils.sheet_to_json(sheet1, { header: 1, range: 1, raw: false })[0] || []) as string[];
    
    
    const sheetData = {
      [workbook.SheetNames[0]]: { column: headers0 },
      [workbook.SheetNames[1]]: { column: headers1 },
    };
    
    const [error,insertManyHotelAndRoomExcelDto]=InsertManyHotelAndRoomExcelDto.create(sheetData);

    if (error) {
      this.handleResponseError(res, CustomError.badRequest(error));
      return;
    }

    
    return this.handleError(
      this.HotelService.uploadExcelHotelRoom(insertManyHotelAndRoomExcelDto!, workbook)
    )
      .then((response) => {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=hotels.xlsx"
        );

        res.end(response);
      })
      .catch((error) => this.handleResponseError(res, error));


    
  };
}
