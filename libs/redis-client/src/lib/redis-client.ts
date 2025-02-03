import Redis from 'ioredis';

class RedisSingleton {
  private static instance: Redis;

  static getInstance(): Redis {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new Redis({
        host: process.env['REDIS_HOST'] || 'localhost',
        port: Number(process.env['REDIS_PORT']) || 6379,
        password: process.env['REDIS_PASSWORD'] || undefined,
      });

      console.log('New Redis connection created');

      RedisSingleton.instance.on('error', (err) => {
        console.error('Redis error:', err);
      });
    }

    return RedisSingleton.instance;
  }
}

export const redisClient = RedisSingleton.getInstance();
