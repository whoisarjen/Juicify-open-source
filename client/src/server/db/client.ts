import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import { env } from "../../env/server.mjs";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

neonConfig.webSocketConstructor = ws
const connectionString = `${env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

export const prisma =
    global.prisma ||
    new PrismaClient({
        adapter,
        log:
            env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
