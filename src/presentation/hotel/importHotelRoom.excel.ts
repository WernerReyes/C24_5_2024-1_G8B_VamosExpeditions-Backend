import { InsertManyHotelAndRoomExcelDto } from "@/domain/dtos/hotel/insertManyHotelAndRoomExcel.dto";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import { hotel, hotel_room, PrismaClient } from "@prisma/client";

import { CustomError } from "@/domain/error";
import { HotelData, RoomData } from "@/domain/type";
import { Decimal } from "@prisma/client/runtime/library";

type HeaderDef = {
  header: string;
  key: string;
  width: number;
  type?: string;
  optional?: boolean;
};

type UploadExcelHotelRoomResponse =
  | { success: true; buffer: Buffer; fileName: string }
  | { success: false; status: number; message: string };

export class ImportHotelRoomExcel {
  private readonly prisma: PrismaClient = new PrismaClient();

  private readonly HOTEL_SHEET_HEADERS = [
    {
      header: "id_hotel",
      key: "id_hotel",
      width: 10,
      type: "number",
      optional: true,
    },
    { header: "category", key: "category", width: 13, type: "string" },
    { header: "name", key: "name", width: 38, type: "string" },
    {
      header: "address",
      key: "address",
      width: 35,
      type: "string",
      optional: true,
    },
    { header: "distrit_id", key: "distrit_id", width: 10, type: "number" },
    { header: "status", key: "status", width: 10 },
  ];

  private readonly ROOM_SHEET_HEADERS = [
    {
      header: "id_hotel_room",
      key: "id_hotel_room",
      width: 15,
      type: "number",
    },
    { header: "hotel_id", key: "hotel_id", width: 10, type: "number" },
    {
      header: "room_type",
      key: "room_type",
      width: 35,
      type: "string",
      optional: true,
    },
    {
      header: "season_type",
      key: "season_type",
      width: 15,
      type: "string",
      optional: true,
    },
    {
      header: "price_usd",
      key: "price_usd",
      width: 15,
      type: "number",
      optional: true,
    },
    {
      header: "service_tax",
      key: "service_tax",
      width: 15,
      type: "number",
      optional: true,
    },
    {
      header: "rate_usd",
      key: "rate_usd",
      width: 12,
      type: "number",
      optional: true,
    },
    {
      header: "price_pen",
      key: "price_pen",
      width: 12,
      type: "number",
      optional: true,
    },
    {
      header: "capacity",
      key: "capacity",
      width: 10,
      type: "number",
      optional: true,
    },
    { header: "status", key: "status", width: 10 },
  ];
  private readonly REPORT_STYLES = {
    headerFont: { bold: true, size: 12 },
    errorCell: { fgColor: "FFFF0000", fontColor: "FF000000" },
    successCell: { fgColor: "FF00FF00", fontColor: "FF000000" },
    borderStyle: {
      style: "thin" as ExcelJS.BorderStyle,
      color: { argb: "FF000000" },
    },
  };

  private readonly HEADER_MAP = {
    Hotels: "id_hotel",
    __EMPTY: "category",
    __EMPTY_1: "name",
    __EMPTY_2: "address",
    __EMPTY_3: "distrit_id",
  };

  private readonly HEADER_MAP_ROOM = {
    Rooms: "id_hotel_room",
    __EMPTY: "hotel_id",
    __EMPTY_1: "room_type",
    __EMPTY_2: "season_type",
    __EMPTY_3: "price_usd",
    __EMPTY_4: "service_tax",
    __EMPTY_5: "rate_usd",
    __EMPTY_6: "price_pen",
    __EMPTY_7: "capacity",
  };

  // ! importar el excel a la base de datos
  public async importExcelToDb(
    insertManyHotelAndRoomExcelDto: InsertManyHotelAndRoomExcelDto,
    workbook: XLSX.WorkBook
  ): Promise<UploadExcelHotelRoomResponse> {
    try {
      const keys = Object.keys(insertManyHotelAndRoomExcelDto);

      const sheetNameHoteles = keys[0];
      const sheetNameHabitaciones = keys[1];

      if (
        !workbook.SheetNames.includes(sheetNameHabitaciones) ||
        !workbook.SheetNames.includes(sheetNameHoteles)
      ) {
        return {
          success: false,
          status: 400,
          message: "No se encontraron las hojas necesarias",
        };
      }
      //! validar data excel
      const { ErrorHotel, ErrorRoom } = this.validateDataExcel({
        workbook: workbook,
        dto: insertManyHotelAndRoomExcelDto,
      });
      if (ErrorHotel.length > 0) {
        const bufferError = await this.verifyDistritAndHotel({
          hotels: ErrorHotel,
          distrits: [],
          rooms: [],
        });
        return {
          success: true,
          buffer: bufferError,
          fileName: "CAMPOS VACIOS HOTEL",
        };
      }
      if (ErrorRoom.length > 0) {
        const bufferError = await this.verifyDistritAndHotel({
          hotels: [],
          distrits: [],
          rooms: ErrorRoom,
        });
        return {
          success: true,
          buffer: bufferError,
          fileName: "CAMPOS VACIOS HABITACION",
        };
      }
      //! end

      const [hotels, hotelRooms] = await Promise.all([
        this.getFormattedHotelExcel(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHoteles])
        ),
        this.getFormatteRoomExcel(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHabitaciones])
        ),
      ]);

      return await this.prisma.$transaction(async (prisma) => {
        //! start Distrit

        const existingDistritDB: number[] = (
          await prisma.distrit.findMany({
            where: { id_distrit: { in: hotels.map((h) => h.distrit_id) } },
            select: {
              id_distrit: true,
            },
          })
        ).map((distrit) => distrit.id_distrit);

        const uniqueDistrictIdsExcelArray = Array.from(
          new Set(hotels.map((h) => h.distrit_id).sort((a, b) => a - b))
        );

        const compareBDandExcel: number[] = uniqueDistrictIdsExcelArray.filter(
          (id) => !existingDistritDB.includes(id)
        );

        if (compareBDandExcel.length > 0) {
          const bufferNoExist = await this.verifyDistritAndHotel({
            hotels: [],
            distrits: compareBDandExcel,
            rooms: [],
          });
          return {
            success: true,
            buffer: bufferNoExist,
            fileName: "NO EXIST DISTRIT",
          };
        }
        //! end Distrit

        //! start Hotel

        const hotelIdsFromExistDatabase: hotel[] = await prisma.hotel.findMany({
          where: { id_hotel: { in: hotels.map((h) => h.id_hotel) } },
        });

        const hotelIdsFromNoExistDatabase: hotel[] = hotels.filter(
          (h) =>
            !hotelIdsFromExistDatabase
              .map((hotel) => hotel.id_hotel)
              .includes(h.id_hotel)
        );

        //!send funtion create excel hotelNew[]
        let hotelsCreateDB: hotel[] = [];

        if (hotelIdsFromNoExistDatabase.length > 0) {
          hotelsCreateDB = await prisma.hotel.createManyAndReturn({
            data: hotelIdsFromNoExistDatabase,
          });
          await prisma.$executeRaw`
          SELECT setval('hotel_id_hotel_seq', COALESCE((SELECT MAX(id_hotel) FROM hotel), 1), false)`;
        }

        if (hotelsCreateDB.length > 0) {
          const excelBuffer = await this.createExcelHotelAndRoom({
            hotels: [],
            hotelRooms: [],
            key: keys,
            hotelsNew: hotelsCreateDB,
            hotelRoomsNew: [],
          });

          return {
            success: true,
            buffer: excelBuffer,
            fileName: "HOTEL NUEVO IMPORTADO",
          };
        }
        //! end Hotel

        //! start verify hotels
        const hotelIdsDB = hotelIdsFromExistDatabase.map((h) => h.id_hotel);

        const hotelsIdsExcel = Array.from(
          new Set(hotelRooms.map((h) => h.hotel_id).sort((a, b) => a - b))
        );

        const compareBDandExcelHotel = hotelsIdsExcel.filter(
          (id) => !hotelIdsDB.includes(id)
        );

        if (compareBDandExcelHotel.length > 0) {
          const bufferNoExist = await this.verifyDistritAndHotel({
            hotels: compareBDandExcelHotel,
            distrits: [],
            rooms: [],
          });
          return {
            success: true,
            buffer: bufferNoExist,
            fileName: "NO EXIST HOTEL",
          };
        }
        //! end verify hotels

        //! start HotelRoom

        //send funtion create excel hotelRooms[]
        const hotelRoomIdsFromExistDatabase: hotel_room[] =
          await prisma.hotel_room.findMany({
            where: {
              id_hotel_room: { in: hotelRooms.map((h) => h.id_hotel_room) },
            },
          });

        const hotelRoomIdsFromNoExistDatabase: hotel_room[] = hotelRooms.filter(
          (h) =>
            !hotelRoomIdsFromExistDatabase
              .map((hotel) => hotel.id_hotel_room)
              .includes(h.id_hotel_room)
        );

        //send funtion create hotelRoomsNew[]
        let hotelRoomsCreateDB: hotel_room[] = [];

        if (hotelRoomIdsFromNoExistDatabase.length > 0) {
          hotelRoomsCreateDB = await prisma.hotel_room.createManyAndReturn({
            data: hotelRoomIdsFromNoExistDatabase,
          });
          await prisma.$executeRaw`SELECT setval('hotel_room_id_hotel_room_seq', COALESCE((SELECT MAX(id_hotel_room) FROM hotel_room), 1), false)`;
        }

        //! end HotelRoom

        if (hotelsCreateDB.length > 0 || hotelRoomsCreateDB.length > 0) {
          const excelBuffer = await this.createExcelHotelAndRoom({
            hotels: hotelIdsFromExistDatabase,
            hotelRooms: hotelRoomIdsFromExistDatabase,
            key: keys,
            hotelsNew: hotelsCreateDB,
            hotelRoomsNew: hotelRoomsCreateDB,
          });

          return {
            success: true,
            buffer: excelBuffer,
            fileName: "DATA IMPORTADA",
          };
        }

        const excelBuffer = await this.createExcelHotelAndRoom({
          hotels: hotelIdsFromExistDatabase,
          hotelRooms: hotelRoomIdsFromExistDatabase,
          key: keys,
          hotelsNew: hotelsCreateDB,
          hotelRoomsNew: hotelRoomsCreateDB,
        });

        return {
          success: true,
          buffer: excelBuffer,
          fileName: "DATA EXISTENTE",
        };
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      throw CustomError.internalServer("Error al cargar los datos");
    }
  }

  //! obtener el excel de los hoteles
  private getFormattedHotelExcel(sheet: XLSX.WorkSheet): hotel[] {
    return (sheet as HotelData[])
      .filter((_, index) => index > 0)
      .map((hotel) => ({
        id_hotel: hotel.Hotels,
        category: hotel.__EMPTY.toString().toUpperCase(),
        name: hotel.__EMPTY_1,
        address: hotel.__EMPTY_2 || null,
        distrit_id: hotel.__EMPTY_3,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        delete_reason: null,
      }));
  }

  //! obtener el excel de las habitaciones
  private getFormatteRoomExcel(sheet: XLSX.WorkSheet): hotel_room[] {
    return (sheet as RoomData[])
      .filter((_, index) => index > 0 && _.__EMPTY_1)
      .map((hotelRoom) => ({
        id_hotel_room: hotelRoom.Rooms,
        hotel_id: hotelRoom.__EMPTY,
        room_type: hotelRoom.__EMPTY_1,
        season_type: hotelRoom.__EMPTY_2 || null,
        price_usd: hotelRoom.__EMPTY_3
          ? new Decimal(hotelRoom.__EMPTY_3)
          : null,
        service_tax: hotelRoom.__EMPTY_4
          ? new Decimal(hotelRoom.__EMPTY_4)
          : null,
        rate_usd: hotelRoom.__EMPTY_5 ? new Decimal(hotelRoom.__EMPTY_5) : null,
        price_pen: hotelRoom.__EMPTY_6
          ? new Decimal(hotelRoom.__EMPTY_6)
          : null,
        capacity: Math.floor(Math.random() * 10) + 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        delete_reason: null,
      }));
  }

  //! crear el excel de los hoteles y habitaciones
  private async createExcelHotelAndRoom(params: {
    hotels: hotel[];
    hotelRooms: hotel_room[];
    key: string[];
    hotelsNew: hotel[];
    hotelRoomsNew: hotel_room[];
  }): Promise<Buffer> {
    const { hotels, hotelRooms, key, hotelsNew, hotelRoomsNew } = params;
    const workbook = new ExcelJS.Workbook();

    const hotelSheet = workbook.addWorksheet(`${key[0]}-Exist`);
    const hotelRoomSheet = workbook.addWorksheet(`${key[1]}-Exist`);

    const hotelSheetNew = workbook.addWorksheet(`${key[0]}-New`);
    const hotelRoomSheetNew = workbook.addWorksheet(`${key[1]}-New`);

    hotelSheet.columns = this.HOTEL_SHEET_HEADERS;
    hotelRoomSheet.columns = this.ROOM_SHEET_HEADERS;

    hotelSheetNew.columns = this.HOTEL_SHEET_HEADERS;
    hotelRoomSheetNew.columns = this.ROOM_SHEET_HEADERS;

    hotelSheet.getRow(1).font = this.REPORT_STYLES.headerFont;
    hotelRoomSheet.getRow(1).font = this.REPORT_STYLES.headerFont;
    hotelSheetNew.getRow(1).font = this.REPORT_STYLES.headerFont;
    hotelRoomSheetNew.getRow(1).font = this.REPORT_STYLES.headerFont;

    //!exist hotel
    hotelSheet.addRows(
      hotels.map((hotel) => ({
        ...hotel,
        status: "Ya existe",
      }))
    );
    //! exist room
    hotelRoomSheet.addRows(
      hotelRooms.map((hotelRoom) => ({
        ...hotelRoom,
        status: "Ya existe",
      }))
    );
    //! new hotel
    hotelSheetNew.addRows(
      hotelsNew.map((hotel) => ({
        ...hotel,
        status: "Nuevo",
      }))
    );
    //! new room
    hotelRoomSheetNew.addRows(
      hotelRoomsNew.map((hotelRoom) => ({
        ...hotelRoom,
        status: "Nuevo",
      }))
    );

    //! borders
    this.applyBordersToSheet(hotelSheet);
    this.applyBordersToSheet(hotelRoomSheet);
    this.applyBordersToSheet(hotelSheetNew);
    this.applyBordersToSheet(hotelRoomSheetNew);
    //! cell
    this.applyStatusCellStyle(hotelSheet, "status", "Ya existe");
    this.applyStatusCellStyle(hotelRoomSheet, "status", "Ya existe");
    this.applyStatusCellStyle(hotelSheetNew, "status", "Nuevo");
    this.applyStatusCellStyle(hotelRoomSheetNew, "status", "Nuevo");

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  //! verificar si el hotel y el distrito existen
  private async verifyDistritAndHotel(params: {
    hotels: number[] | string[];
    distrits: number[];
    rooms: number[] | string[];
  }): Promise<Buffer> {
    const { hotels, distrits, rooms } = params;

    const workbook = new ExcelJS.Workbook();

    let hotelsIdsSheet: ExcelJS.Worksheet | undefined;
    let distritsIdsSheet: ExcelJS.Worksheet | undefined;
    const headerColumns = [
      { header: "information", key: "information", width: 55 },
    ];

    if (Array.isArray(hotels) && hotels.every((h) => typeof h === "string")) {
      if (hotels && hotels.length > 0) {
        hotelsIdsSheet = workbook.addWorksheet("CAMPOS VACIOS HOTEL");
        hotelsIdsSheet.columns = headerColumns;
        const hotelRows = hotels.map((h) => ({
          information: `${h} `,
        }));
        hotelsIdsSheet.addRows(hotelRows);

        this.applyStatusCellStyle(
          hotelsIdsSheet,
          "information",
          hotelRows.map((r) => r.information)
        );
      }
    } else {
      if (hotels && hotels.length > 0) {
        hotelsIdsSheet = workbook.addWorksheet("NO EXIST HOTEL");
        hotelsIdsSheet.columns = headerColumns;
        const hotelRows = hotels.map((h) => ({
          information: `El hotel no existe en la base de datos con este número ${h}`,
        }));
        hotelsIdsSheet.addRows(hotelRows);
        this.applyStatusCellStyle(
          hotelsIdsSheet,
          "information",
          hotelRows.map((r) => r.information)
        );
      }
    }

    if (Array.isArray(rooms) && rooms.every((d) => typeof d === "string")) {
      if (rooms && rooms.length > 0) {
        hotelsIdsSheet = workbook.addWorksheet("CAMPOS VACIOS HABITACION");
        hotelsIdsSheet.columns = headerColumns;
        const hotelRows = rooms.map((h) => ({
          information: `${h} `,
        }));
        hotelsIdsSheet.addRows(hotelRows);
        this.applyStatusCellStyle(
          hotelsIdsSheet,
          "information",
          hotelRows.map((r) => r.information)
        );
      }
    }

    if (distrits && distrits.length > 0) {
      distritsIdsSheet = workbook.addWorksheet("NO EXIST DISTRIT");
      distritsIdsSheet.columns = headerColumns;

      const distritRows = distrits.map((d) => ({
        information: `El distrito no existe en la base de datos con este número ${d}`,
      }));

      distritsIdsSheet.addRows(distritRows);
      this.applyStatusCellStyle(
        distritsIdsSheet,
        "information",
        distritRows.map((d) => d.information)
      );
    }

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  //! start
  private validateDataExcel(params: {
    workbook: XLSX.WorkBook;
    dto: InsertManyHotelAndRoomExcelDto;
  }): { ErrorHotel: string[]; ErrorRoom: string[] } {
    const { workbook, dto } = params;
    const [hotelsKey, roomKey] = Object.keys(dto);

    const ErrorHotel = this.validateData({
      workbook: workbook,
      key: hotelsKey,
      headers: this.HOTEL_SHEET_HEADERS,
      header: this.HEADER_MAP,
    });

    const ErrorRoom = this.validateData({
      workbook: workbook,
      key: roomKey,
      headers: this.ROOM_SHEET_HEADERS,
      header: this.HEADER_MAP_ROOM,
    });
    return {
      ErrorHotel,
      ErrorRoom,
    };
  }

  private validateData(params: {
    workbook: XLSX.WorkBook;
    key: string;
    headers: HeaderDef[];
    header: { [key: string]: string };
  }): string[] {
    const { workbook, key, header, headers } = params;
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[key]);
    const Mapped = dataExcel.map((row: any) => {
      const newRow: any = {};
      Object.entries(header).forEach(([excelKey, realKey]) => {
        newRow[realKey] = row[excelKey];
      });
      return newRow;
    });

    const data = Mapped.slice(1);
    const errors: string[] = [];
    data.forEach((row: any, idx) => {
      headers
        .filter((req: any) => req.header !== "status") //! <--- IGNORA el campo 'status'
        .forEach((req: any) => {
          if (
            !req.optional && //! solo valida vacíos si no es opcional
            (row[req.header] === undefined ||
              row[req.header] === null ||
              row[req.header] === "")
          ) {
            errors.push(
              `${key} - Fila ${idx + 2}: El campo ${req.header} está vacío.`
            );
          } else if (
            row[req.header] !== undefined &&
            row[req.header] !== null &&
            row[req.header] !== "" &&
            req.type === "number" &&
            isNaN(Number(row[req.header]))
          ) {
            errors.push(
              `${key} - Fila ${idx + 2}: El campo ${
                req.header
              } debe ser numérico.`
            );
          }
        });
    });

    return errors;
  }

  //! aplicar color a las celdas de la hoja
  private applyStatusCellStyle(
    sheet: ExcelJS.Worksheet,
    column: string,
    text: string | string[]
  ) {
    const statusCol = sheet.getColumn(column);
    if (statusCol) {
      statusCol.eachCell((cell, rowNumber) => {
        if (rowNumber > 1 && typeof cell.value === "string") {
          const match = Array.isArray(text)
            ? text.includes(cell.value)
            : cell.value === text;
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: match ? "FFFF0000" : "FF00FF00",
            },
          };
          cell.font = {
            color: { argb: "FF000000" },
            bold: true,
          };
          cell.border = {
            top: this.REPORT_STYLES.borderStyle,
            bottom: this.REPORT_STYLES.borderStyle,
            left: this.REPORT_STYLES.borderStyle,
            right: this.REPORT_STYLES.borderStyle,
          };
        }
      });
    }
  }

  // ! aplicar bordes a todas las celdas de la hoja
  private applyBordersToSheet(sheet: ExcelJS.Worksheet) {
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: this.REPORT_STYLES.borderStyle,
          bottom: this.REPORT_STYLES.borderStyle,
          left: this.REPORT_STYLES.borderStyle,
          right: this.REPORT_STYLES.borderStyle,
        };
      });
    });
  }
}
