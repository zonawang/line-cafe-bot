import { middleware } from '@line/bot-sdk';
import { Router } from 'express';

import { dispatchLineEvent } from '../handlers/webhookEventDispatcher.js';
import { lineMiddlewareConfig } from '../services/lineClient.js';
import type { LineWebhookEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/', middleware(lineMiddlewareConfig), async (req, res, next) => {
  try {
    const events = ((req.body as { events?: LineWebhookEvent[] })?.events ?? []);

    logger.info('Webhook signature verified', {
      eventCount: events.length
    });

    await Promise.all(events.map((event) => dispatchLineEvent(event)));

    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
