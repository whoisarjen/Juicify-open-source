import { createClient } from 'redis';
import { env } from "@/env/server.mjs";

export const redis = createClient({
    url: env.REDIS_URL,
});

// Initialization of redis server
(async () => await redis.connect())()

redis.on('error', (err: any) => console.log('Redis Client Error', err))