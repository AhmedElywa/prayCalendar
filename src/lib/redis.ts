import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let connecting = false;

export async function getRedis(): Promise<RedisClientType | null> {
  if (client?.isReady) return client;
  if (connecting) return null;

  connecting = true;
  try {
    client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    client.on('error', (err) => console.warn('Redis error:', err.message));
    await client.connect();
    return client;
  } catch (err) {
    console.warn('Redis connection failed:', (err as Error).message);
    client = null;
    return null;
  } finally {
    connecting = false;
  }
}
