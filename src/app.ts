import express, { type NextFunction, type Request, type Response } from 'express';

import webhookRouter from './routes/webhook.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/webhook', webhookRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof err.status === 'number'
        ? err.status
        : 500;

    const message =
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof err.message === 'string'
        ? err.message
        : 'Internal Server Error';

    logger.error('Unhandled request error', { status, message });
    res.status(status).json({ error: message });
  });

  return app;
}

export const app = createApp();
