import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tempbox',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  mailDomain: process.env.MAIL_DOMAIN || 'tempbox.dev',
  mailboxTtlMinutes: parseInt(process.env.MAILBOX_TTL_MINUTES || '20', 10),
  maxEmailSizeMb: parseInt(process.env.MAX_EMAIL_SIZE_MB || '10', 10),
  jwtSecret: process.env.JWT_SECRET || 'tempbox-secret-key-change-in-production',
};
