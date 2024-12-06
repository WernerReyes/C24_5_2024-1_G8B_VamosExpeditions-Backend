import { PrismaClient } from "@prisma/client";
import { ROLES, USERS } from "./data";
const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  await seed();
  await prisma.$disconnect();
})();

async function seed() {
  //* Delete all data
  await Promise.all([prisma.user.deleteMany(), prisma.role.deleteMany()]);

  //* Insert Roles
  await prisma.role.createMany({
    data: ROLES,
  });

  //* Insert Users
  await prisma.user.createMany({
    data: USERS,
  });

  console.log("Seed completed");
}
