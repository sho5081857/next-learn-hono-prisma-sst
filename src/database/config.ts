import { PrismaClient } from '@prisma/client'
import { Resource } from 'sst'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const databaseUrl = `postgresql://${Resource.MyPostgres.username}:${Resource.MyPostgres.password}@${Resource.MyPostgres.host}:${Resource.MyPostgres.port}/${Resource.MyPostgres.database}`

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

async function executeSqlScript() {
  const sqlFilePath = join(__dirname, '../../_tools/first.sql')
  const sql = readFileSync(sqlFilePath, 'utf-8')
  const statements = sql
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0)

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement)
    } catch (e) {
      console.error('Failed to execute SQL statement:', statement, e)
      throw e
    }
  }
}
