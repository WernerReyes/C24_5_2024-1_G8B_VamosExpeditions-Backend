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
import { GetHotelsDto, HotelDto, PaginationDto, RoomDto } from "@/domain/dtos";
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
import ExcelJS from "exceljs";

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
      }));
  }

  private getFormattedCityFromExcel(sheet: XLSX.WorkSheet): city[] {
    return (sheet as ExelCity[])
      .filter((_, index) => index > 0)
      .map((city) => ({
        id_city: city.__EMPTY,
        name: city.Ciudad,
        country_id: city.__EMPTY_1,
      }));
  }

  private getFormattedDistritFromExcel(sheet: XLSX.WorkSheet): distrit[] {
    return (sheet as ExelDistrit[])
      .filter((_, index) => index > 0)
      .map((distrit) => ({
        id_distrit: distrit.__EMPTY,
        name: distrit.Distrito,
        city_id: distrit.__EMPTY_1,
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

  public async registerHotelandRoom(
    data: HotelAndRoomInterface | HotelDto | RoomDto,
    type: HotelRoomType
  ) {
    switch (type) {
      case HotelRoomType.HOTEL:
        return this.registerHotel(data as HotelDto);
      case HotelRoomType.ROOM:
        return this.registerRoom(data as RoomDto);
      case HotelRoomType.HOTELANDROOM:
        return this.registerHotelandRooms(data as HotelAndRoomInterface);
      default:
        throw CustomError.badRequest("Tipo de registro no valido");
    }
  }

  private registerHotel(data: HotelDto) {
    console.log("HotelDto ----------", data);
    return {
      status: 200,
      message: "Hotel registrado correctamente",
    };
  }
  private registerRoom(data: RoomDto) {
    console.log("RoomDto ----------", data);
    return {
      status: 200,
      message: "Habitacion registrada correctamente",
    };
  }

  private registerHotelandRooms(data: HotelAndRoomInterface) {
    console.log("HotelAndRoomInterface ----------", data);
    return {
      status: 200,
      message: "Hotel y habitaciones registrados correctamente",
    };
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

  public async getAllHotelsRoomsAndDistricts(PaginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = PaginationDto;

    const hotels = await HotelModel.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ name: "asc" }],
      include: this.hotelMapper.toSelectInclude,
    });

    const totalCount = await HotelModel.count({});
    const content = await Promise.all(
      hotels.map((hotel) => HotelEntity.fromObject(hotel))
    );

    return new ApiResponse<PaginatedResponse<HotelEntity>>(
      200,
      "Lista de hoteles, habitaciones y distritos",
      {
        content: content,
        total: totalCount,
        page: PaginationDto.page ?? 1,
        limit: PaginationDto.limit ?? 10,
        totalPages: Math.ceil(totalCount / (PaginationDto.limit ?? 10)),
      }
    );
  }

  public async uploadExcelHotelRoom(
    insertManyHotelAndRoomExcelDto: InsertManyHotelAndRoomExcelDto,
    workbook: XLSX.WorkBook
  ) {
    try {
      const keys = Object.keys(insertManyHotelAndRoomExcelDto);

      const sheetNameHoteles = keys[0];
      const sheetNameHabitaciones = keys[1];

      if (
        !workbook.SheetNames.includes(sheetNameHabitaciones) ||
        !workbook.SheetNames.includes(sheetNameHoteles)
      ) {
        return new ApiResponse<any>(
          400,
          "No se encontraron las hojas necesarias",
          ""
        );
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
        const [existingHotels, existingRooms] = await Promise.all([
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
          existingHotels.length > 0 &&
          existingHotels.length === hotels.length &&
          existingRooms.length > 0 &&
          existingRooms.length === hotelRooms.length
          /* &&
        hotels.every((h) => h.id_hotel && h.name && h.address && h.category && h.distrit_id ) &&
        existingHotels.every((h) => h.id_hotel && h.name && h.address && h.category && h.distrit_id ) &&
        hotelRooms.every((r) => r.id_hotel_room && r.room_type && r.capacity && r.hotel_id && r.price_pen && r.price_usd && r.rate_usd && r.season_type && r.service_tax) &&
        existingRooms.every((r) => r.id_hotel_room && r.room_type && r.capacity && r.hotel_id && r.price_pen && r.price_usd && r.rate_usd && r.season_type && r.service_tax) */
        ) {
          const excelBuffer = await this.createExcelHotelAndRoom(
            existingHotels,
            existingRooms,
            keys,
            true
          );

          return excelBuffer;
        }
        //
        const [newHotels, newHotelRooms] = await Promise.all([
          prisma.hotel.createManyAndReturn({ data: hotels }),
          prisma.hotel_room.createManyAndReturn({ data: hotelRooms }),
        ]);

        return await this.createExcelHotelAndRoom(
          newHotels,
          newHotelRooms,
          keys,
          false
        );
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      throw CustomError.internalServer("Error al cargar los datos",);
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
      }));
  }

  public async createExcelHotelAndRoom(
    hotels: hotel[],
    hotelRooms: hotel_room[],
    key: string[],
    status: boolean
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const hotelSheet = workbook.addWorksheet(key[0]);
    const hotelRoomSheet = workbook.addWorksheet(key[1]);

    // Definición de las columnas para ambas hojas
    hotelSheet.columns = [
      { header: "id_hotel", key: "id_hotel", width: 10 },
      { header: "category", key: "category", width: 13 },
      { header: "name", key: "name", width: 38 },
      { header: "address", key: "address", width: 35 },
      { header: "distrit_id", key: "distrit_id", width: 10 },
      { header: "status", key: "status", width: 10 },
    ];

    hotelRoomSheet.columns = [
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

    // Mapeo de datos con un solo paso
    const hotelRows = hotels.map((hotel) => ({
      ...hotel,
      status: status ? "Ya existe" : "Nuevo",
    }));

    const hotelRooms_v1 = hotelRooms.map((hotelRoom) => ({
      ...hotelRoom,
      status: status ? "Ya existe" : "Nuevo",
    }));

    hotelSheet.getRow(1).font = { bold: true, size: 12 };
    hotelRoomSheet.getRow(1).font = { bold: true, size: 12 };

    hotelSheet.addRows(hotelRows);
    hotelRoomSheet.addRows(hotelRooms_v1);

    hotelSheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });

    hotelRoomSheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });

    this.applyStatusCellStyle(hotelSheet, status);
    this.applyStatusCellStyle(hotelRoomSheet, status);

    /* workbook.xlsx.writeFile("hotels_and_rooms.xlsx") */
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private applyStatusCellStyle(sheet: ExcelJS.Worksheet, status: boolean) {
    const statusCol = sheet.getColumn("status");

    // Aplicar estilo solo si la columna existe
    if (statusCol) {
      statusCol.eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: status ? "FFFF0000" : "FF00FF00" },
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
}
