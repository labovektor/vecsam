import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRedisClient } from "./redis";

interface RateLimiterProps {
  points: number;
  duration: number;
  keyPrefix: string;
  consumeKey: string;
}

export const rateLimiter = ({
  points,
  duration,
  keyPrefix,
  consumeKey,
}: RateLimiterProps) => {
  const limiter = new RateLimiterRedis({
    storeClient: getRedisClient(),
    keyPrefix,
    points,
    duration,
  });

  return limiter.consume(consumeKey);
};
