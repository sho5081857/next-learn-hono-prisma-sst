import { PrismaClient } from "@prisma/client";
import { Resource } from "sst";
import { readFileSync } from "fs";
import { join } from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = `postgresql://${Resource.MyPostgres.username}:${Resource.MyPostgres.password}@${Resource.MyPostgres.host}:${Resource.MyPostgres.port}/${Resource.MyPostgres.database}`;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function executeSqlScript() {
  const sqlFilePath = join(__dirname, "../../_tools/first.sql");
  const sql = readFileSync(sqlFilePath, "utf-8");
  await prisma.$executeRawUnsafe(sql);
}

executeSqlScript().catch((e) => {
  console.error("Failed to execute SQL script:", e);
  process.exit(1);
});
