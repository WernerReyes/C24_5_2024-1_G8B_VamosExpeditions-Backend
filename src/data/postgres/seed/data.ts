import { BcryptAdapter } from "@/core/adapters";
import {
  role,
  user,
  role_type,
  country,
  city,
  distrit,
  accommodation_room,
  Prisma,
  accommodation,
} from "@prisma/client";

export const ROLES: role[] = [
  {
    id_role: 1,
    name: role_type.MANAGER_ROLE,
  },
  {
    id_role: 2,
    name: role_type.EMPLOYEE_ROLE,
  },
];

export const USERS: user[] = [
  {
    id_user: 1,
    email: "test1@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 1",
    id_role: 1,
  },
  {
    id_user: 2,
    email: "test2@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 2",
    id_role: 2,
  },
  {
    id_user: 3,
    email: "test3@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 3",
    id_role: 1,
  },
  {
    id_user: 4,
    email: "test4@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 4",
    id_role: 2,
  },
  {
    id_user: 5,
    email: "test5@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 5",
    id_role: 1,
  },
  {
    id_user: 6,
    email: "test6@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 6",
    id_role: 2,
  },
];

export const COUNTRIES: country[] = [
  {
    id_country: 1,
    name: "Colombia",
    code: "CO",
  },
  {
    id_country: 2,
    name: "Argentina",
    code: "AR",
  },
  {
    id_country: 3,
    name: "Brasil",
    code: "BR",
  },
  {
    id_country: 4,
    name: "Peru",
    code: "PE",
  },
  {
    id_country: 5,
    name: "Chile",
    code: "CL",
  },
];

export const CITIES: city[] = [
  {
    id_city: 1,
    name: "Bogota",
    country_id: 1,
  },
  {
    id_city: 2,
    name: "Medellin",
    country_id: 1,
  },
  {
    id_city: 3,
    name: "Buenos Aires",
    country_id: 2,
  },
  {
    id_city: 7,
    name: "Lima",
    country_id: 4,
  },
  {
    id_city: 8,
    name: "Arequipa",
    country_id: 4,
  },
];

export const DISTRICTS: distrit[] = [
  {
    id_distrit: 1,
    name: "Usaquen",
    city_id: 1,
  },
  {
    id_distrit: 2,
    name: "Chapinero",
    city_id: 1,
  },
  {
    id_distrit: 3,
    name: "Kennedy",
    city_id: 1,
  },
  {
    id_distrit: 9,
    name: "Miraflores",
    city_id: 7,
  },
  {
    id_distrit: 10,
    name: "San Isidro",
    city_id: 7,
  },
];

export const ACCOMMODATIONS: accommodation[] = [
  {
    id_accommodation: 1,
    name: "Hotel 1",
    rating: 5,
    category: "5 Estrellas",
    address: "Calle 1",
    distrit_id_distrit: 1,
    email: "hotel1@gmail.com",
  },
  {
    id_accommodation: 2,
    name: "Hotel 2",
    rating: 4,
    category: "4 Estrellas",
    address: "Calle 2",
    distrit_id_distrit: 2,
    email: "hotel2@gmail.com",
  },
  {
    id_accommodation: 3,
    name: "Hotel 3",
    rating: 3,
    category: "3 Estrellas",
    address: "Calle 3",
    distrit_id_distrit: 3,
    email: "hotel3@gmail.com",
  },
  {
    id_accommodation: 4,
    name: "Hotel 4",
    rating: 2,
    category: "2 Estrellas",
    address: "Calle 4",
    distrit_id_distrit: 9,
    email: "hotel4@gmail.com",
  },
  {
    id_accommodation: 5,
    name: "Hotel 5",
    rating: 1,
    category: "1 Estrellas",
    address: "Calle 5",
    distrit_id_distrit: 10,
    email: "hotel5@gmail.com",
  },
];

export const ACCOMMODATION_ROOMS: accommodation_room[] = [
  {
    id_accommodation_room: 1,
    room_type: "SINGLE",
    price_usd: new Prisma.Decimal(100),
    service_tax: new Prisma.Decimal(0.18),
    rate_usd: new Prisma.Decimal(3.9),
    price_pen: new Prisma.Decimal(390),
    capacity: 1,
    available: true,
    accommodation_id: 1,
  },
  {
    id_accommodation_room: 2,
    room_type: "DOUBLE",
    price_usd: new Prisma.Decimal(200),
    service_tax: new Prisma.Decimal(0.18),
    rate_usd: new Prisma.Decimal(3.9),
    price_pen: new Prisma.Decimal(780),
    capacity: 2,
    available: true,
    accommodation_id: 1,
  },
  {
    id_accommodation_room: 3,
    room_type: "TRIPLE",
    price_usd: new Prisma.Decimal(300),
    service_tax: new Prisma.Decimal(0.18),
    rate_usd: new Prisma.Decimal(3.9),
    price_pen: new Prisma.Decimal(1170),
    capacity: 3,
    available: true,
    accommodation_id: 1,
  },
  {
    id_accommodation_room: 4,
    room_type: "SINGLE",
    price_usd: new Prisma.Decimal(100),
    service_tax: new Prisma.Decimal(0.18),
    rate_usd: new Prisma.Decimal(3.9),
    price_pen: new Prisma.Decimal(390),
    capacity: 1,
    available: true,
    accommodation_id: 2,
  },
  {
    id_accommodation_room: 5,
    room_type: "DOUBLE",
    price_usd: new Prisma.Decimal(200),
    service_tax: new Prisma.Decimal(0.18),
    rate_usd: new Prisma.Decimal(3.9),
    price_pen: new Prisma.Decimal(780),
    capacity: 2,
    available: true,
    accommodation_id: 2,
  },
]