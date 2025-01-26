import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()

//* MODELS
export  const ClientModel= prisma.client
export const UserModel= prisma.user
export const RoleModel= prisma.role
export const HotelModel= prisma.hotel
export const CityModel= prisma.city
export const CountryModel= prisma.country
export const DistritModel= prisma.distrit
export const HotelRoomModel= prisma.hotel_room
export const ReservationModel= prisma.reservation
export const ReservationHasCityModel= prisma.reservation_has_city
export const QuotationModel= prisma.quotation
export const VersionQuotationModel= prisma.version_quotation
export const HotelRoomQuotationModel= prisma.hotel_room_quotation
