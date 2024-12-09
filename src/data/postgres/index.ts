import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

//* MODELS

export  const ClienModel= prisma.client
export const UserModel= prisma.user
export const RoleModel= prisma.role
export const AccommodationModel= prisma.accommodation
export const CytyModel= prisma.city
export const CountryModel= prisma.country
export const DistritModel= prisma.distrit
export const AccommodationRoomModel= prisma.accommodation_room
export const ReservationModel= prisma.reservation
export const ReservationDetailModel= prisma.reservation_has_city
