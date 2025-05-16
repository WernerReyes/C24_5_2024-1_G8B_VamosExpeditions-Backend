import {
  PrismaClient,
  city,
  country,
  distrit,
  hotel,
  hotel_room,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as XLSX from "xlsx";
import * as path from "path";
import { PARNERTS, ROLES, USERS } from "./data";

const prisma = new PrismaClient();

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

(async () => {
  await prisma.$connect();
  const rutaArchivo = path.resolve(
    __dirname,
    "TARIFAS HOTELES Y SERVICIOS 2025.xlsx"
  );
  await cargarDatosDesdeExcel(rutaArchivo);
  await prisma.$disconnect();
})();

async function cargarDatosDesdeExcel(rutaArchivo: string) {
  try {
    //* Read the file
    const book = XLSX.readFile(rutaArchivo);

    //* Get the countries formatted
    const countries = getFormattedCountryFromExcel(book);

    //* Get the cities formatted
    const cities = getFormattedCityFromExcel(book);

    //* Get the distrits formatted
    const districts = getFormattedDistritFromExcel(book);

    //* Get the hotels formatted
    const hotels = getFormattedHotelFromExcel(book);

    //* Get the hotel rooms formatted
    const hotelRooms = getFormattedHotelRoomFromExcel(book);

    const missingTypeRooms = hotelRooms.filter(
      (hotelRoom) => !hotelRoom.room_type
    );

    //* Delete all data
    let deletedData = false;
    await prisma
      .$transaction([
        prisma.reservation.deleteMany(),
        prisma.hotel_room_trip_details.deleteMany(),
        prisma.trip_details_has_city.deleteMany(),
        prisma.trip_details.deleteMany(),
        prisma.version_quotation.deleteMany(),
        prisma.quotation.deleteMany(),
        prisma.client.deleteMany(),
        prisma.hotel_room.deleteMany(),
        prisma.hotel.deleteMany(),
        prisma.user.deleteMany(),
        prisma.partner.deleteMany(),
        prisma.role.deleteMany(),
        prisma.distrit.deleteMany(),
        prisma.city.deleteMany(),
        prisma.country.deleteMany(),
      ])
      .then(() => {
        deletedData = true;
      })
      .catch((error) => {
        console.error("Error deleting data", error);
      });

    if (!deletedData) return;

    //* Insert Roles
    await prisma.role.createMany({
      data: ROLES,
    });

    //* Insert Users
    await prisma.user.createMany({
      data: USERS,
    });

    //* Insert Partners
    await prisma.partner.createMany({
      data: PARNERTS,
    });

    //* Insert Countries
    await prisma.country.createMany({
      data: countries,
    });

    //* Insert Cities
    await prisma.city.createMany({
      data: cities,
    });

    //* Insert Districts
    await prisma.distrit.createMany({
      data: districts,
    });

    //* Insert HOTELS
    await prisma.hotel.createMany({
      data: hotels,
    });

    //* Insert HOTEL ROOMS
    await prisma.hotel_room.createMany({
      data: hotelRooms,
    });

    console.log("Datos cargados correctamente");
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getFormattedCountryFromExcel = (book: XLSX.WorkBook): country[] => {
  const countrySheet = book.SheetNames[4];
  const sheet = book.Sheets[countrySheet];

  const countries: ExelCountry[] = XLSX.utils.sheet_to_json(sheet);
  return countries
    .filter((_, index) => index > 0)
    .map((country) => ({
      id_country: country.Pais,
      name: country.__EMPTY,
      code: country.__EMPTY_1,
      created_at: null,
      updated_at: null,
    }));
};

const getFormattedCityFromExcel = (book: XLSX.WorkBook): city[] => {
  const citySheet = book.SheetNames[3];
  const sheet = book.Sheets[citySheet];
  const cities: ExelCity[] = XLSX.utils.sheet_to_json(sheet);
  return cities
    .filter((_, index) => index > 0)
    .map((city) => ({
      id_city: city.__EMPTY,
      name: city.Ciudad,
      country_id: city.__EMPTY_1,
      created_at: null,
      updated_at: null,
    }));
};

const getFormattedDistritFromExcel = (book: XLSX.WorkBook): distrit[] => {
  const distritSheet = book.SheetNames[2];
  const sheet = book.Sheets[distritSheet];
  const distrits: ExelDistrit[] = XLSX.utils.sheet_to_json(sheet);
  return distrits
    .filter((_, index) => index > 0)
    .map((distrit) => ({
      id_distrit: distrit.__EMPTY,
      name: distrit.Distrito,
      city_id: distrit.__EMPTY_1,
      created_at: null,
      updated_at: null,
    }));
};

const getFormattedHotelFromExcel = (book: XLSX.WorkBook): hotel[] => {
  const hotelSheet = book.SheetNames[1];
  const sheet = book.Sheets[hotelSheet];
  const hotels: ExelHotels[] = XLSX.utils.sheet_to_json(sheet);
  return hotels
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
};

const getFormattedHotelRoomFromExcel = (book: XLSX.WorkBook): hotel_room[] => {
  const hotelRoomSheet = book.SheetNames[0];
  const sheet = book.Sheets[hotelRoomSheet];
  const hotelRooms: ExelHotelRoom[] = XLSX.utils.sheet_to_json(sheet);
  return hotelRooms
    .filter((_, index) => index > 0 && _.__EMPTY_1)
    .map((hotelRoom) => ({
      id_hotel_room: hotelRoom.Habitaciones,
      hotel_id: hotelRoom.__EMPTY,
      room_type: hotelRoom.__EMPTY_1,
      season_type: hotelRoom.__EMPTY_2 || null,
      price_usd: hotelRoom.__EMPTY_3 ? new Decimal(hotelRoom.__EMPTY_3) : null,
      service_tax: hotelRoom.__EMPTY_4
        ? new Decimal(hotelRoom.__EMPTY_4)
        : null,
      rate_usd: hotelRoom.__EMPTY_5 ? new Decimal(hotelRoom.__EMPTY_5) : null,
      price_pen: hotelRoom.__EMPTY_6 ? new Decimal(hotelRoom.__EMPTY_6) : null,
      capacity: Math.floor(Math.random() * 10) + 1,
      created_at: null,
      updated_at: null,
    }));
};
