import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import { normalizeDatabaseUrl } from "./database-url";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrisma = () => {
  const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add your Supabase Postgres connection string.");
  }

  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

const prisma =
  globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };
