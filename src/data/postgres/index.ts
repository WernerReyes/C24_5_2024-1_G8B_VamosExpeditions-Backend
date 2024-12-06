import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//* MODELS
export const UserModel = prisma.user