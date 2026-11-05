import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import IORedis from 'ioredis';
import { config } from '../config/env.js';

const redisClient = new IORedis(config.redisUrl);

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    prefix: 'api-limit:',
    sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as any,
  } as any),
  message: { message: 'Too many requests. Please wait and try again.' },
});

export const mailboxCreationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    prefix: 'mailbox-limit:',
    sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as any,
  } as any),
  message: { message: 'Too many mailboxes created. Please wait for 60s before creating another.' },
});
