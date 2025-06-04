import {
  PrismaClient,
  city,
  country,
  distrit,
  hotel,
  hotel_room,
} from "@prisma/client";

import {
  GetHotelsDto,
  GetHotelsPageDto,
  HotelDto,
  TrashDto,
} from "@/domain/dtos";

import { InsertManyHotelAndRoomExcelDto } from "@/domain/dtos/hotel/insertManyHotelAndRoomExcel.dto";
import { HotelEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { Decimal } from "@prisma/client/runtime/library";
import * as XLSX from "xlsx";
import { InsertManyHotelExcelDto } from "../../domain/dtos/hotel/insertManyHotelExcel.dto";
import { ApiResponse, PaginatedResponse } from "../response";
import { HotelMapper } from "./hotel.mapper";

import {
  HotelModel,
  HotelRoomModel,
  HotelRoomTripDetailsModel,
  prisma,
} from "@/infrastructure/models";

import * as ExcelJS from "exceljs";
import { ImportHotelRoomExcel } from "./importHotelRoom.excel";

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
  | { success: true; buffer: Buffer; fileName: string }
  | { success: false; status: number; message: string };

export class HotelService {
  constructor(
    private readonly hotelMapper: HotelMapper,
    private readonly importHotelRoomExcel: ImportHotelRoomExcel
  ) {}

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
        created_at: new Date(),
        updated_at: new Date(),
      }));
  }

  private getFormattedCityFromExcel(sheet: XLSX.WorkSheet): city[] {
    return (sheet as ExelCity[])
      .filter((_, index) => index > 0)
      .map((city) => ({
        id_city: city.__EMPTY,
        name: city.Ciudad,
        country_id: city.__EMPTY_1,
        created_at: new Date(),
        updated_at: new Date(),
      }));
  }

  private getFormattedDistritFromExcel(sheet: XLSX.WorkSheet): distrit[] {
    return (sheet as ExelDistrit[])
      .filter((_, index) => index > 0)
      .map((distrit) => ({
        id_distrit: distrit.__EMPTY,
        name: distrit.Distrito,
        city_id: distrit.__EMPTY_1,
        created_at: new Date(),
        updated_at: new Date(),
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
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        delete_reason: null,
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
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        delete_reason: null,
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

  //!List of hotels, rooms and districts
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
  //!List of hotels, rooms and districts

  public async uploadExcelHotelRoom(
    insertManyHotelAndRoomExcelDto: InsertManyHotelAndRoomExcelDto,
    workbook: XLSX.WorkBook
  ): Promise<UploadExcelHotelRoomResponse> {
    return this.importHotelRoomExcel.importExcelToDb(
      insertManyHotelAndRoomExcelDto,
      workbook
    );
  }
  //

  //! start create ,update,delete hotel
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

  //!  delete logic
  public async trashHotel({ id, deleteReason }: TrashDto) {
    const hotel = await HotelModel.findUnique({
      where: {
        id_hotel: id,
      },
      select: {
        id_hotel: true,
        hotel_room: {
          select: {
            id_hotel_room: true,
          },
        },
        is_deleted: true,
      },
    });
    if (!hotel) throw CustomError.notFound("Hotel no encontrado");
    const { hotel_room } = hotel;
    const roomsWithDetailsCount = await HotelRoomTripDetailsModel.count({
      where: {
        hotel_room_id: {
          in: hotel_room.map((room) => room.id_hotel_room),
        },
      },
    });

    if (roomsWithDetailsCount > 0) {
      throw CustomError.badRequest(
        `No se puede eliminar el hotel porque tiene habitaciones con detalles de viaje asociados.`
      );
    }
    const hotelTrashed = await HotelModel.update({
      where: {
        id_hotel: id,
      },
      data: {
        deleted_at: hotel.is_deleted ? null : new Date(),
        is_deleted: !hotel.is_deleted,
        delete_reason: hotel.is_deleted ? null : deleteReason,
      },
    });

    return new ApiResponse<HotelEntity>(
      200,
      hotel.is_deleted
        ? "Hotel restaurado correctamente"
        : "Hotel eliminado correctamente",
      await HotelEntity.fromObject(hotelTrashed)
    );
  }

  public async restoreHotel(id: HotelEntity["id"]) {
    return this.trashHotel({
      id,
      deleteReason: undefined,
    });
  }
  //! end create ,update,delete hotel
}
