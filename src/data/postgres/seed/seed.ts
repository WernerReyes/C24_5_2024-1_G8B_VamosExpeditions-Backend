import { PrismaClient } from "@prisma/client";
import { ROLES, USERS, 
  COUNTRIES, CITIES, DISTRICTS, HOTELS, HOTEL_ROOMS
 } from "./data";
const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  await seed();
  await prisma.$disconnect();
})();

async function seed() {
  //* Delete all data
  let deletedData = false
  await prisma.$transaction([
    prisma.hotel_room.deleteMany(),
    prisma.hotel.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.distrit.deleteMany(),
    prisma.city.deleteMany(),
    prisma.country.deleteMany(),
  ]).then(() => {
 
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

  //* Insert Countries
  await prisma.country.createMany({
    data: COUNTRIES,
  });

  //* Insert Cities
  await prisma.city.createMany({
    data: CITIES,
  });

  //* Insert Districts
  await prisma.distrit.createMany({
    data: DISTRICTS,
  });

  //* Insert HOTELS
  await prisma.hotel.createMany({
    data: HOTELS,
  });

  //* Insert HOTELS Rooms
  await prisma.hotel_room.createMany({
    data: HOTEL_ROOMS,
  });
  

  console.log("Seed completed");
}