import { defineConfig } from "prisma/config";
import { normalizeDatabaseUrl } from "./lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(process.env.DIRECT_URL ?? process.env.DATABASE_URL),
  },
});
