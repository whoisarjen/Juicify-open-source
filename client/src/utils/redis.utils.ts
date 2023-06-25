import { createClient } from 'redis';
import { env } from "@/env/server.mjs";

export const redis = createClient({
    url: env.REDIS_URL,
});

// Initialization start of server for Redis
(async () => await redis.connect())()

redis.on('error', (err: any) => console.error('Redis Client Error', err))