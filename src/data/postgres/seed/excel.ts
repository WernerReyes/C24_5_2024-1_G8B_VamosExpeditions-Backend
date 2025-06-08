import {
  PrismaClient,
  city,
  country,
  distrit,
  hotel,
  hotel_room,
  service,
  service_type,
  setting_key_enum,
  settings,
  user,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as XLSX from "xlsx";
import * as path from "path";
import { DEFAULT_SETTINGS, PARNERTS, ROLES, USERS } from "./data";
import { CacheAdapter } from "@/core/adapters";

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

type ExelService = {
  Servicios: number;
  __EMPTY: string;
  __EMPTY_1: number;
  __EMPTY_2: string;
  __EMPTY_3: string | undefined;
  __EMPTY_4: number | string | undefined;
  __EMPTY_5: number | undefined;
  __EMPTY_6: number | undefined;
  __EMPTY_7: number | undefined;
  __EMPTY_8: number | undefined;
  __EMPTY_9: number | undefined;
  __EMPTY_10: number | undefined;
  __EMPTY_11: undefined; // Todo: District ID
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

    //* Get the service types formatted
    const serviceTypes = getServiceTypeFromExcel(book);

    //* Get the services formatted
    const services = getServicesFromExcel(book, districts);

    //* Delete all data
    let deletedData = false;
    await prisma
      .$transaction([
        prisma.service_trip_details.deleteMany(),
        prisma.service.deleteMany(),
        prisma.service_type.deleteMany(),
        prisma.settings.deleteMany(),
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
      .then(async () => {
        await CacheAdapter.initialize();
        CacheAdapter.getInstance().clearAll();
        deletedData = true;
      })
      .catch((error) => {
        console.error("Error deleting data", error);
      });

    if (!deletedData) return;

    //* Insert Roles
    const roles = await prisma.role.createManyAndReturn({
      data: ROLES,
    });

    //* Insert Users
    const users = await prisma.user.createManyAndReturn({
      data: [
        ...(() => {
          const users: Omit<user, "id_user">[] = [];

          for (const user of USERS) {
            users.push({
              ...user,
              id_role: roles[Math.floor(Math.random() * roles.length)].id_role,
            });
          }
          return users;
        })(),
      ],
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

    //* Insert SETTINGS
    await prisma.settings.createMany({
      data: [
        ...DEFAULT_SETTINGS,
        ...(() => {
          const settings: Omit<settings, "id">[] = [];

          for (const user of users) {
            settings.push({
              key: setting_key_enum.MAX_ACTIVE_SESSIONS,
              value: "3",
              updated_at: null,
              updated_by_id: null,
              user_id: user.id_user,
            });
          }
         
          for (const user of users) {
            settings.push({
              key: setting_key_enum.TWO_FACTOR_AUTH,
              value: "false",
              updated_at: null,
              updated_by_id: null,
              user_id: user.id_user,
            });
          }

          return settings;
        })(),
      ],
    });

    //* Insert SERVICE TYPES
    await prisma.service_type.createMany({
      data: serviceTypes,
    });

    //* Insert SERVICES
    await prisma.service.createMany({
      data: services,
    });

    console.log("Datos cargados correctamente");
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getFormattedCountryFromExcel = (book: XLSX.WorkBook): country[] => {
  const countrySheet = book.SheetNames[5];
  const sheet = book.Sheets[countrySheet];

  const countries: ExelCountry[] = XLSX.utils.sheet_to_json(sheet);
  return countries
    .filter((_, index) => index > 0)
    .map((country) => ({
      id_country: country.Pais,
      name: country.__EMPTY,
      code: country.__EMPTY_1,
      created_at: new Date(),
      updated_at: new Date(),
    }));
};

const getFormattedCityFromExcel = (book: XLSX.WorkBook): city[] => {
  const citySheet = book.SheetNames[4];
  const sheet = book.Sheets[citySheet];
  const cities: ExelCity[] = XLSX.utils.sheet_to_json(sheet);
  return cities
    .filter((_, index) => index > 0)
    .map((city) => ({
      id_city: city.__EMPTY,
      name: city.Ciudad,
      country_id: city.__EMPTY_1,
      created_at: new Date(),
      updated_at: new Date(),
    }));
};

const getFormattedDistritFromExcel = (book: XLSX.WorkBook): distrit[] => {
  const distritSheet = book.SheetNames[3];
  const sheet = book.Sheets[distritSheet];
  const distrits: ExelDistrit[] = XLSX.utils.sheet_to_json(sheet);
  return distrits
    .filter((_, index) => index > 0)
    .map((distrit) => ({
      id_distrit: distrit.__EMPTY,
      name: distrit.Distrito,
      city_id: distrit.__EMPTY_1,
      created_at: new Date(),
      updated_at: new Date(),
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
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      is_deleted: false,
      delete_reason: null,
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
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      is_deleted: false,
      delete_reason: null,
    }));
};

const getServiceTypeFromExcel = (book: XLSX.WorkBook): service_type[] => {
  const serviceTypeSheet = book.SheetNames[2];
  const sheet = book.Sheets[serviceTypeSheet];
  const exelServiceTypes: ExelService[] = XLSX.utils.sheet_to_json(sheet);
  return exelServiceTypes
    .filter((serviceType, index) => index > 0 && serviceType.__EMPTY)
    .map((serviceType) => ({
      id: serviceType.Servicios,
      name: serviceType.__EMPTY,
      created_at: new Date(),
      updated_at: new Date(),
    }));
};

const getServicesFromExcel = (
  book: XLSX.WorkBook,
  districts: distrit[]
): Omit<service, "id">[] => {
  const serviceSheet = book.SheetNames[2];
  const sheet = book.Sheets[serviceSheet];
  const exelServices: ExelService[] = XLSX.utils.sheet_to_json(sheet);

  return exelServices
    .filter((service, index) => index > 0 && service.__EMPTY_1)
    .map((service) => ({
      description: service.__EMPTY_2,
      duration: service.__EMPTY_3
        ? typeof service.__EMPTY_3 === "number"
          ? `${service.__EMPTY_3}`
          : service.__EMPTY_3
        : null,
      service_type_id: service.__EMPTY_1,
      passengers_min: parsePassenger(service.__EMPTY_4).passangers_min,
      passengers_max: parsePassenger(service.__EMPTY_4).passangers_max,
      price_usd:
        service.__EMPTY_5 && typeof service.__EMPTY_5 === "number"
          ? new Decimal(service.__EMPTY_5)
          : null,
      tax_igv_usd: service.__EMPTY_6 ? new Decimal(service.__EMPTY_6) : null,
      rate_usd: service.__EMPTY_7 ? new Decimal(service.__EMPTY_7) : null,
      price_pen: service.__EMPTY_8 ? new Decimal(service.__EMPTY_8) : null,
      tax_igv_pen: service.__EMPTY_9 ? new Decimal(service.__EMPTY_9) : null,
      rate_pen: service.__EMPTY_10 ? new Decimal(service.__EMPTY_10) : null,
      distrit_id:
        districts[Math.floor(Math.random() * districts.length)].id_distrit,
      created_at: new Date(),
      updated_at: new Date(),
    }));
};

const parsePassenger = (
  passenger?: string | number
): {
  passangers_min: number | null;
  passangers_max: number | null;
} => {
  if (!passenger) return { passangers_min: null, passangers_max: null };

  if (typeof passenger === "number" && isPossibleExcelDate(passenger)) {
    passenger = excelDateToJSMonthDay(passenger);
  }

  if (typeof passenger === "number")
    return {
      passangers_min: passenger,
      passangers_max: null,
    };

  if (passenger.includes("+")) {
    const passangers = passenger.split("+");

    return {
      passangers_min: parseInt(passangers[0]),
      passangers_max: (passangers[1] && parseInt(passangers[1])) || null,
    };
  } else if (passenger.includes("-")) {
    const passangers = passenger.split("-");
    return {
      passangers_min: parseInt(passangers[0]),
      passangers_max: (passangers[1] && parseInt(passangers[1])) || null,
    };
  } else if (passenger.includes("a")) {
    const passangers = passenger.split("a");
    return {
      passangers_min: parseInt(passangers[0]),
      passangers_max: (passangers[1] && parseInt(passangers[1])) || null,
    };
  } else if (passenger.includes("A")) {
    const passangers = passenger.split("A");
    return {
      passangers_min: parseInt(passangers[0]),
      passangers_max: (passangers[1] && parseInt(passangers[1])) || null,
    };
  } else if (passenger.includes("mín")) {
    const passangers = passenger.split("mín");
    return {
      passangers_min: parseInt(passangers[0]),
      passangers_max: null,
    };
  } else if (passenger.includes("Min")) {
    const passangers = passenger.split("Min");
    return {
      passangers_min: (passangers[1] && parseInt(passangers[1])) || null,
      passangers_max: null,
    };
  }

  return { passangers_min: null, passangers_max: null };
};

const isPossibleExcelDate = (value: string | number): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 40000 && num <= 60000;
};

function excelDateToJSMonthDay(serial: number): string {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch base (1900-01-00)
  const date = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
  const month = date.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
  const day = date.getDate();
  return `${month}-${day}`;
}
