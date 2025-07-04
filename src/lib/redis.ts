import Redis from "ioredis";

export const createRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: Number(process.env.REDIS_DB),
  });
};

let redis: Redis | undefined = undefined;

export const getRedisClient = () => {
  if (!redis) {
    redis = createRedisClient();
  }
  return redis;
};
