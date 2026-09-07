import { existsSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

import { normalizeDatabaseUrl } from './lib/database-url'

if (existsSync('.env')) {
  process.loadEnvFile('.env')
}

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations'
  },

  datasource: {
    url: normalizeDatabaseUrl(process.env.DIRECT_URL ?? process.env.DATABASE_URL)
  }
})