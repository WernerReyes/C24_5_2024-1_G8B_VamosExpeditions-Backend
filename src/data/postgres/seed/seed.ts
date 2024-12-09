import { PrismaClient } from "@prisma/client";
import { ROLES, USERS, 
  COUNTRIES, CITIES, DISTRICTS, ACCOMMODATIONS, ACCOMMODATION_ROOMS
 } from "./data";
const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  await seed();
  await prisma.$disconnect();
})();

async function seed() {
  //* Delete all data
  await Promise.all([
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.country.deleteMany(),
    prisma.city.deleteMany(),
    prisma.distrit.deleteMany(),
    prisma.accommodation.deleteMany(),
    prisma.accommodation_room.deleteMany(),
  ]);

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

  //* Insert Accommodations
  await prisma.accommodation.createMany({
    data: ACCOMMODATIONS,
  });

  //* Insert Accommodation Rooms
  await prisma.accommodation_room.createMany({
    data: ACCOMMODATION_ROOMS,
  });
  

  console.log("Seed completed");
}
