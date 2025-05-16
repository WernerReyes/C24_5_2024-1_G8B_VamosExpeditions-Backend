import {
  type city,
  type country,
  type distrit,
  type partner,
  type role,
  role_type,

  type user,


} from "@prisma/client";
import { BcryptAdapter } from "@/core/adapters";
import { HotelCategory, type IHotelModel } from "@/infrastructure/models";

export const ROLES: role[] = [
  {
    id_role: 1,
    name: role_type.MANAGER_ROLE,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_role: 2,
    name: role_type.EMPLOYEE_ROLE,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
];

export const USERS: user[] = [
  {
    id_user: 1,
    email: "test1@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 1",
    id_role: 1,
    description: "description 1",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_user: 2,
    email: "test2@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 2",
    id_role: 2,
    description: "description 2",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_user: 3,
    email: "test3@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 3",
    id_role: 1,
    description: "description 3",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_user: 4,
    email: "test4@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 4",
    id_role: 2,
    description: "description 4",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_user: 5,
    email: "test5@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 5",
    id_role: 1,
    description: "description 5",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    id_user: 6,
    email: "test6@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 6",
    id_role: 2,
    description: "description 6",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
];

export const COUNTRIES: country[] = [
  {
    id_country: 1,
    name: "Colombia",
    code: "CO",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_country: 2,
    name: "Argentina",
    code: "AR",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_country: 3,
    name: "Brasil",
    code: "BR",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_country: 4,
    name: "Peru",
    code: "PE",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_country: 5,
    name: "Chile",
    code: "CL",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const CITIES: city[] = [
  {
    id_city: 1,
    name: "Bogota",
    country_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_city: 2,
    name: "Medellin",
    country_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_city: 3,
    name: "Buenos Aires",
    country_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_city: 7,
    name: "Lima",
    country_id: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_city: 8,
    name: "Arequipa",
    country_id: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const DISTRICTS: distrit[] = [
  {
    id_distrit: 1,
    name: "Usaquen",
    city_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_distrit: 2,
    name: "Chapinero",
    city_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_distrit: 3,
    name: "Kennedy",
    city_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_distrit: 9,
    name: "Miraflores",
    city_id: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_distrit: 10,
    name: "San Isidro",
    city_id: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const HOTELS: IHotelModel[] = [
  {
    id_hotel: 1,
    name: "Hotel 1",
    category: HotelCategory.THREE,
    address: "Calle 1",
    distrit_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_hotel: 2,
    name: "Hotel 2",
    category: HotelCategory.FOUR,
    address: "Calle 2",
    distrit_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_hotel: 3,
    name: "Hotel 3",
    category: HotelCategory.FIVE,
    address: "Calle 3",
    distrit_id: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_hotel: 4,
    name: "Hotel 4",
    category: HotelCategory.BOUTIQUE,
    address: "Calle 4",
    distrit_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_hotel: 5,
    name: "Hotel 5",
    category: HotelCategory.VILLA,
    address: "Calle 5",
    distrit_id: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const PARNERTS: partner[] = [
  {
    id: 1,
    name: "Travel Local",
    created_at: new Date(),
  },
];

// export const HOTEL_ROOMS: hotel_room[] = [
//   {
//     id_hotel_room: 1,
//     room_type: "SINGLE",
//     price_usd: new Prisma.Decimal(100),
//     price_pen: new Prisma.Decimal(390),
//     capacity: 1,
//     hotel_id: 1,

//   },
//   {
//     id_hotel_room: 2,
//     room_type: "DOUBLE",
//     price_usd: new Prisma.Decimal(200),
//     price_pen: new Prisma.Decimal(780),
//     capacity: 2,
//     hotel_id: 1,
//   },
//   {
//     id_hotel_room: 3,
//     room_type: "TRIPLE",
//     price_usd: new Prisma.Decimal(300),

//     price_pen: new Prisma.Decimal(1170),
//     capacity: 3,
//     hotel_id: 1,
//   },
//   {
//     id_hotel_room: 4,
//     room_type: "SINGLE",
//     price_usd: new Prisma.Decimal(100),

//     price_pen: new Prisma.Decimal(390),
//     capacity: 1,
//     hotel_id: 2,
//   },
//   {
//     id_hotel_room: 5,
//     room_type: "DOUBLE",
//     price_usd: new Prisma.Decimal(200),

//     price_pen: new Prisma.Decimal(780),
//     capacity: 2,
//     hotel_id: 2,
//   },
// ];
