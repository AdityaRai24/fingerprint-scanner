import { PrismaClient } from "@/generated/prisma";

export const db:PrismaClient = new PrismaClient();