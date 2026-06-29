import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";
import { normalizeDatabaseUrl } from "./lib/database-url";

loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(process.env.DIRECT_URL ?? process.env.DATABASE_URL),
  },
});
