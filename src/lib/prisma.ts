import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg'
import { attachDatabasePool } from '@vercel/functions'

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });

attachDatabasePool(pool)

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

export { prisma };
