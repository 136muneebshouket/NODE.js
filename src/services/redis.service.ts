/**
 * Redis Service (ioredis)
 */

import IORedis, { Redis } from 'ioredis';
import env from '../config/env_config';
const isProd = env.isProduction;

const baseConfig = {
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
};

// console.log(isProd)
// 
const redisConfig = isProd
  ? {
      ...baseConfig,
      ...env.redis,
      retryStrategy(times: number) {
        return Math.min(times * 100, 2000);
      },
    }
  : {
      ...baseConfig,
      host: '127.0.0.1',
      port: 6379,
    };

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new IORedis(redisConfig);
    this.setupListeners();
  }

  private setupListeners() {
    this.client.on('ready', () => {
      console.log('✅ Redis ready');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    this.client.on('reconnecting', () => {
      console.warn('🔄 Redis reconnecting...');
    });

    this.client.on('end', () => {
      console.warn('🛑 Redis connection closed');
    });
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async disconnect() {
    await this.client.quit();
  }

  isReady(): boolean {
    return this.client.status === 'ready';
  }

   getConnectionConfig() {
    return redisConfig;
  }

  checkConnection(){
    return this.client.ping()
  }
}

const redis = new RedisService();

/** Graceful shutdown */
process.on('SIGINT', async () => {
  await redis.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redis.disconnect();
  process.exit(0);
});

export default redis;
