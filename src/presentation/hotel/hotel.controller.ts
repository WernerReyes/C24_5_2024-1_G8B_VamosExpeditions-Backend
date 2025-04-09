import type { Request, Response } from "express";
import { AppController } from "../controller";
import { HotelService } from "./hotel.service";
import { GetHotelsDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import path from "path";
import * as XLSX from "xlsx";
import { InsertManyHotelExcelDto } from "../../domain/dtos/hotel/insertManyHotelExcel.dto";
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

    const [error, insertManyHotelExcelDto] =InsertManyHotelExcelDto.create(sheetData);

    if (error)  { 
      this.handleResponseError(res, CustomError.badRequest(error)) 
      return;
      
    };


    

    return this.handleError(this.HotelService.uploadExcel(insertManyHotelExcelDto!, workbook))
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
