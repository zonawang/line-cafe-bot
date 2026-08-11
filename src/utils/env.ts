import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_KEYS = ['LINE_CHANNEL_SECRET', 'LINE_CHANNEL_ACCESS_TOKEN'] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function getRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function getPort(): number {
  const rawPort = process.env.PORT ?? '3000';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: getPort(),
  LINE_CHANNEL_SECRET: getRequiredEnv('LINE_CHANNEL_SECRET'),
  LINE_CHANNEL_ACCESS_TOKEN: getRequiredEnv('LINE_CHANNEL_ACCESS_TOKEN')
} as const;
