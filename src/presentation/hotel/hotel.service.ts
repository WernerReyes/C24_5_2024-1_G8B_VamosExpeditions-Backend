import {
  PrismaClient,
  city,
  country,
  distrit,
  hotel,
  hotel_room,
} from "@prisma/client";
import {
  CityModel,
  CountryModel,
  DistritModel,
  HotelModel,
  HotelRoomModel,
  prisma,
} from "@/data/postgres";
import {
  GetHotelsDto,
  GetHotelsPageDto,
  HotelDto,
  PaginationDto,
  RoomDto,
} from "@/domain/dtos";
import { HotelMapper } from "./hotel.mapper";
import { CustomError } from "@/domain/error";
import { ApiResponse, PaginatedResponse } from "../response";
import { HotelEntity } from "@/domain/entities";
import { InsertManyHotelExcelDto } from "../../domain/dtos/hotel/insertManyHotelExcel.dto";
import * as XLSX from "xlsx";
import { Decimal } from "@prisma/client/runtime/library";
import { HotelAndRoomInterface } from "@/domain/interfaces";
import { HotelRoomType } from "@/domain/enum";
import { InsertManyHotelAndRoomExcelDto } from "@/domain/dtos/hotel/insertManyHotelAndRoomExcel.dto";
import { HotelData, RoomData } from "@/domain/type";
import * as ExcelJS from "exceljs";
import { Distrit } from "../../domain/entities/distrit.entity";
import utils from "util";

type ExelCountry = {
  Pais: number;
  __EMPTY: string;
  __EMPTY_1: string;
};

type ExelCity = {
  Ciudad: string;
  __EMPTY: number;
  __EMPTY_1: number;
};

type ExelDistrit = {
  Distrito: string;
  __EMPTY: number;
  __EMPTY_1: number;
};

type ExelHotels = {
  Hoteles: number;
  __EMPTY: string | number;
  __EMPTY_1: string;
  __EMPTY_2: string | undefined;
  __EMPTY_3: number;
};

type ExelHotelRoom = {
  Habitaciones: number;
  __EMPTY: number;
  __EMPTY_1: string;
  __EMPTY_2: string | undefined;
  __EMPTY_3: number | undefined;
  __EMPTY_4: number | undefined;
  __EMPTY_5: number | undefined;
  __EMPTY_6: number | undefined;
};

type UploadExcelHotelRoomResponse =
  | { success: true; buffer: Buffer }
  | { success: false; status: number; message: string };

export class HotelService {
  constructor(private readonly hotelMapper: HotelMapper) {}

  public async getAll(getHotelsDto: GetHotelsDto) {
    this.hotelMapper.setDto = getHotelsDto;
    const accommodationRooms = await HotelModel.findMany({
      where: this.hotelMapper.toFilterForGetAll,
      include: this.hotelMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error.message}`);
    });

    return new ApiResponse<HotelEntity[]>(
      200,
      "Lista de hoteles",
      await Promise.all(
        accommodationRooms.map((hotel) => HotelEntity.fromObject(hotel))
      )
    );
  }

  public async uploadExcel(
    insertManyHotelExcelDto: InsertManyHotelExcelDto,
    workbook: any
  ) {
    try {
      const key = Object.keys(insertManyHotelExcelDto);

      const sheetNameHabitaciones = key[0];
      const sheetNameHoteles = key[1];
      const sheetNameDistritos = key[2];
      const sheetNameCiudades = key[3];
      const sheetNamePais = key[4];

      if (
        !workbook.SheetNames.includes(sheetNamePais) ||
        !workbook.SheetNames.includes(sheetNameHabitaciones) ||
        !workbook.SheetNames.includes(sheetNameHoteles) ||
        !workbook.SheetNames.includes(sheetNameDistritos) ||
        !workbook.SheetNames.includes(sheetNameCiudades)
      ) {
        return new ApiResponse<any>(
          400,
          "No se encontraron las hojas necesarias",
          ""
        );
      }

      const [countries, cities, districts, hotels, hotelRooms] =
        await Promise.all([
          this.getFormattedCountryFromExcel(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamePais])
          ),

          this.getFormattedCityFromExcel(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameCiudades])
          ),

          this.getFormattedDistritFromExcel(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameDistritos])
          ),

          await this.getFormattedHotelFromExcel(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHoteles])
          ),

          this.getFormattedHotelRoomFromExcel(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHabitaciones])
          ),
        ]);
      const prisma = new PrismaClient();
      return await prisma.$transaction(async (prisma) => {
        const [
          existingCountries,
          existingCities,
          existingDistricts,
          existingHotels,
          existingRooms,
        ] = await Promise.all([
          prisma.country.findMany({
            where: { id_country: { in: countries.map((c) => c.id_country) } },
          }),
          prisma.city.findMany({
            where: { id_city: { in: cities.map((c) => c.id_city) } },
          }),
          prisma.distrit.findMany({
            where: { id_distrit: { in: districts.map((d) => d.id_distrit) } },
          }),
          prisma.hotel.findMany({
            where: { id_hotel: { in: hotels.map((h) => h.id_hotel) } },
          }),
          prisma.hotel_room.findMany({
            where: {
              id_hotel_room: { in: hotelRooms.map((r) => r.id_hotel_room) },
            },
          }),
        ]);

        if (
          existingCities.length > 0 &&
          existingCities.length === cities.length &&
          existingCountries.length > 0 &&
          existingCountries.length === countries.length &&
          existingDistricts.length > 0 &&
          existingDistricts.length === districts.length &&
          existingHotels.length > 0 &&
          existingHotels.length === hotels.length &&
          existingRooms.length > 0 &&
          existingRooms.length === hotelRooms.length
        ) {
          const excelBuffer = this.exportAllToExcel(
            existingCountries,
            existingCities,
            existingDistricts,
            existingHotels,
            existingRooms,
            key,
            true
          );

          return excelBuffer;
        }

        await Promise.all([
          prisma.country.createMany({ data: countries }),
          prisma.city.createMany({ data: cities }),
          prisma.distrit.createMany({ data: districts }),
          prisma.hotel.createMany({ data: hotels }),
          prisma.hotel_room.createMany({ data: hotelRooms }),
        ]);

        const excelBuffer = this.exportAllToExcel(
          countries,
          cities,
          districts,
          hotels,
          hotelRooms,
          key,
          false
        );

        return excelBuffer;
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      throw CustomError.internalServer("Error al cargar los datos");
    }
  }

  private getFormattedCountryFromExcel(sheet: XLSX.WorkSheet): country[] {
    return (sheet as ExelCountry[])
      .filter((_, index) => index > 0)
      .map((country) => ({
        id_country: country.Pais,
        name: country.__EMPTY,
        code: country.__EMPTY_1,
        created_at: null,
        updated_at: null,
      }));
  }

  private getFormattedCityFromExcel(sheet: XLSX.WorkSheet): city[] {
    return (sheet as ExelCity[])
      .filter((_, index) => index > 0)
      .map((city) => ({
        id_city: city.__EMPTY,
        name: city.Ciudad,
        country_id: city.__EMPTY_1,
        created_at: null,
        updated_at: null,
      }));
  }

  private getFormattedDistritFromExcel(sheet: XLSX.WorkSheet): distrit[] {
    return (sheet as ExelDistrit[])
      .filter((_, index) => index > 0)
      .map((distrit) => ({
        id_distrit: distrit.__EMPTY,
        name: distrit.Distrito,
        city_id: distrit.__EMPTY_1,
        created_at: null,
        updated_at: null,
      }));
  }

  private getFormattedHotelFromExcel(sheet: XLSX.WorkSheet): hotel[] {
    return (sheet as ExelHotels[])
      .filter((_, index) => index > 0)
      .map((hotel) => ({
        id_hotel: hotel.Hoteles,
        category: hotel.__EMPTY.toString().toUpperCase(),
        name: hotel.__EMPTY_1,
        address: hotel.__EMPTY_2 || null,
        distrit_id: hotel.__EMPTY_3,
        created_at: null,
        updated_at: null,
      }));
  }

  private getFormattedHotelRoomFromExcel(sheet: XLSX.WorkSheet): hotel_room[] {
    return (sheet as ExelHotelRoom[])
      .filter((_, index) => index > 0 && _.__EMPTY_1)
      .map((hotelRoom) => ({
        id_hotel_room: hotelRoom.Habitaciones,
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
        created_at: null,
        updated_at: null,
      }));
  }

  public exportAllToExcel(
    countries: country[],
    cities: city[],
    districts: distrit[],
    hotels: hotel[],
    hotelRooms: hotel_room[],
    key: string[],
    status: boolean
  ): Buffer {
    const workbook = XLSX.utils.book_new();

    const countrySheet = XLSX.utils.json_to_sheet(
      countries.map((country) => ({
        id_country: country.id_country,
        name: country.name,
        code: country.code,
        status: status ? "Ya existe" : "Nuevo",
      }))
    );

    const citySheet = XLSX.utils.json_to_sheet(
      cities.map((city) => ({
        id_city: city.id_city,
        name: city.name,
        country_id: city.country_id,
        status: status ? "Ya existe" : "Nuevo",
      }))
    );

    const distritSheet = XLSX.utils.json_to_sheet(
      districts.map((distrit) => ({
        id_distrit: distrit.id_distrit,
        name: distrit.name,
        city_id: distrit.city_id,
        status: status ? "Ya existe" : "Nuevo",
      }))
    );

    const hotelSheet = XLSX.utils.json_to_sheet(
      hotels.map((hotel) => ({
        id_hotel: hotel.id_hotel,
        category: hotel.category,
        name: hotel.name,
        address: hotel.address,
        distrit_id: hotel.distrit_id,
        status: status ? "Ya existe" : "Nuevo",
      }))
    );

    const hotelRoomSheet = XLSX.utils.json_to_sheet(
      hotelRooms.map((hotelRoom) => ({
        id_hotel_room: hotelRoom.id_hotel_room,
        hotel_id: hotelRoom.hotel_id,
        room_type: hotelRoom.room_type,
        season_type: hotelRoom.season_type,
        price_usd: hotelRoom.price_usd?.toNumber() || null,
        service_tax: hotelRoom.service_tax?.toNumber() || null,
        rate_usd: hotelRoom.rate_usd?.toNumber() || null,
        price_pen: hotelRoom.price_pen?.toNumber() || null,
        capacity: hotelRoom.capacity,

        status: status ? "Ya existe" : "Nuevo",
      }))
    );

    XLSX.utils.book_append_sheet(workbook, countrySheet, key[4]);
    XLSX.utils.book_append_sheet(workbook, citySheet, key[3]);
    XLSX.utils.book_append_sheet(workbook, distritSheet, key[2]);
    XLSX.utils.book_append_sheet(workbook, hotelSheet, key[1]);
    XLSX.utils.book_append_sheet(workbook, hotelRoomSheet, key[0]);

    return XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
      cellStyles: true,
      bookSST: false,
    });
  }

  public async getAllHotel() {
    const hotels = await HotelModel.findMany({
      omit: {
        category: true,
        address: true,
        distrit_id: true,
      },
    });

    return new ApiResponse<HotelEntity[]>(
      200,
      "Lista de hoteles",
      await Promise.all(
        hotels.map((hotel) => HotelEntity.fromOmittedObject(hotel))
      )
    );
  }

  //List of hotels, rooms and districts
  public async getAllHotelsRoomsAndDistricts(
    getHotelsPageDto: GetHotelsPageDto
  ) {
    this.hotelMapper.setDto = getHotelsPageDto;
    const hotels = await HotelModel.findMany({
      take: getHotelsPageDto.limit,
      skip: (getHotelsPageDto.page - 1) * getHotelsPageDto.limit,
      orderBy: [{ created_at: "desc" }],
      where: this.hotelMapper.getHotelWhere,
      include: this.hotelMapper.toSelectInclude,
    });

    const totalCount = await HotelModel.count({
      where: this.hotelMapper.getHotelWhere,
    });
    const content = await Promise.all(
      hotels.map((hotel) => HotelEntity.fromObject(hotel))
    );

    return new ApiResponse<PaginatedResponse<HotelEntity>>(
      200,
      "Lista de hoteles, habitaciones y distritos",
      {
        content: content,
        total: totalCount,
        page: getHotelsPageDto.page,
        limit: getHotelsPageDto.limit,
        totalPages: Math.ceil(totalCount / getHotelsPageDto.limit),
      }
    );
  }
  //List of hotels, rooms and districts

  public async uploadExcelHotelRoom(
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

      const [hotels, hotelRooms] = await Promise.all([
        this.getFormattedHotelExcel(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHoteles])
        ),
        this.getFormatteRoomExcel(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameHabitaciones])
        ),
      ]);

      return await prisma.$transaction(async (prisma) => {
        // start Distrit
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
          });
          return {
            success: true,
            buffer: bufferNoExist,
          };
        }
        // end Distrit

        // start Hotel
        //send funtion create excel hotels[]
        const hotelIdsFromExistDatabase: hotel[] = await prisma.hotel.findMany({
          where: { id_hotel: { in: hotels.map((h) => h.id_hotel) } },
        });

        const hotelIdsFromNoExistDatabase: hotel[] = hotels.filter(
          (h) =>
            !hotelIdsFromExistDatabase
              .map((hotel) => hotel.id_hotel)
              .includes(h.id_hotel)
        );

        //send funtion create excel hotelNew[]
        let hotelsCreateDB: hotel[] = [];

        if (hotelIdsFromNoExistDatabase.length > 0) {
          hotelsCreateDB = await prisma.hotel.createManyAndReturn({
            data: hotelIdsFromNoExistDatabase,
          });
        }
        // end Hotel

        // start verify hotels
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
          });
          return {
            success: true,
            buffer: bufferNoExist,
          };
        }
        // end verify hotels

        // start HotelRoom

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
        }

        // end HotelRoom

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
        };
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      throw CustomError.internalServer("Error al cargar los datos");
    }
  }

  private getFormattedHotelExcel(sheet: XLSX.WorkSheet): hotel[] {
    return (sheet as HotelData[])
      .filter((_, index) => index > 0)
      .map((hotel) => ({
        id_hotel: hotel.Hotels,
        category: hotel.__EMPTY.toString().toUpperCase(),
        name: hotel.__EMPTY_1,
        address: hotel.__EMPTY_2 || null,
        distrit_id: hotel.__EMPTY_3,
        created_at: null,
        updated_at: null,
      }));
  }
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
        created_at: null,
        updated_at: null,
      }));
  }

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

    const headerHotelColum = [
      { header: "id_hotel", key: "id_hotel", width: 10 },
      { header: "category", key: "category", width: 13 },
      { header: "name", key: "name", width: 38 },
      { header: "address", key: "address", width: 35 },
      { header: "distrit_id", key: "distrit_id", width: 10 },
      { header: "status", key: "status", width: 10 },
    ];

    const headerRoomColum = [
      { header: "id_hotel_room", key: "id_hotel_room", width: 15 },
      { header: "hotel_id", key: "hotel_id", width: 10 },
      { header: "room_type", key: "room_type", width: 35 },
      { header: "season_type", key: "season_type", width: 15 },
      { header: "price_usd", key: "price_usd", width: 15 },
      { header: "service_tax", key: "service_tax", width: 15 },
      { header: "rate_usd", key: "rate_usd", width: 12 },
      { header: "price_pen", key: "price_pen", width: 12 },
      { header: "capacity", key: "capacity", width: 10 },
      { header: "status", key: "status", width: 10 },
    ];

    hotelSheet.columns = headerHotelColum;
    hotelRoomSheet.columns = headerRoomColum;

    hotelSheetNew.columns = headerHotelColum;
    hotelRoomSheetNew.columns = headerRoomColum;

    hotelSheet.getRow(1).font = { bold: true, size: 12 };
    hotelRoomSheet.getRow(1).font = { bold: true, size: 12 };
    hotelSheetNew.getRow(1).font = { bold: true, size: 12 };
    hotelRoomSheetNew.getRow(1).font = { bold: true, size: 12 };

    //exist hotel
    hotelSheet.addRows(
      hotels.map((hotel) => ({
        ...hotel,
        status: "Ya existe",
      }))
    );
    // exist room
    hotelRoomSheet.addRows(
      hotelRooms.map((hotelRoom) => ({
        ...hotelRoom,
        status: "Ya existe",
      }))
    );
    // new hotel
    hotelSheetNew.addRows(
      hotelsNew.map((hotel) => ({
        ...hotel,
        status: "Nuevo",
      }))
    );
    // new room
    hotelRoomSheetNew.addRows(
      hotelRoomsNew.map((hotelRoom) => ({
        ...hotelRoom,
        status: "Nuevo",
      }))
    );

    //borders
    this.applyBordersToSheet(hotelSheet);
    this.applyBordersToSheet(hotelRoomSheet);
    this.applyBordersToSheet(hotelSheetNew);
    this.applyBordersToSheet(hotelRoomSheetNew);
    // cell
    this.applyStatusCellStyle(hotelSheet, "status", "Ya existe");
    this.applyStatusCellStyle(hotelRoomSheet, "status", "Ya existe");
    this.applyStatusCellStyle(hotelSheetNew, "status", "Ya existe");
    this.applyStatusCellStyle(hotelRoomSheetNew, "status", "Ya existe");

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  //

  private async verifyDistritAndHotel(params: {
    hotels: number[];
    distrits: number[];
  }): Promise<Buffer> {
    const { hotels, distrits } = params;

    const workbook = new ExcelJS.Workbook();

    let hotelsIdsSheet: ExcelJS.Worksheet | undefined;
    let distritsIdsSheet: ExcelJS.Worksheet | undefined;
    const headerColumns = [
      { header: "information", key: "information", width: 55 },
    ];

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
  //
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
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        }
      });
    }
  }

  //
  private applyBordersToSheet(sheet: ExcelJS.Worksheet) {
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });
  }
  //

  // start create ,update,delete hotel
  public async upsertHotel(hotelDto: HotelDto) {
    this.hotelMapper.setDto = hotelDto;
    let hotel: hotel;
    try {
      const existingHotel = await HotelModel.findUnique({
        where: {
          id_hotel: hotelDto.id,
        },
      });
      if (existingHotel) {
        hotel = await HotelModel.update({
          where: {
            id_hotel: hotelDto.id,
          },
          data: this.hotelMapper.updateHotel,
        });
        console.log("hotel", hotel);
      } else {
        
        hotel = await HotelModel.create({
          data: this.hotelMapper.createHotel,
        });
        
      }

      return new ApiResponse<hotel>(
        200,
        hotelDto.id > 0
          ? "Hotel actualizado correctamente"
          : "Hotel creado correctamente",
        hotel
      );
    } catch (error: any) {
      console.error("Error al crear el hotel:", error);
      throw CustomError.internalServer(
        `Error al crear el hotel: ${error.message}`
      );
    }
  }

  public deleteHotel() {}
  // end create ,update,delete hotel
}
