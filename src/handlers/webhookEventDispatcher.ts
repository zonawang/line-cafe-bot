import type { LineMessageEvent, LinePostbackEvent, LineWebhookEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';
import { handleMessageEvent } from './messageHandler.js';
import { handlePostbackEvent } from './postbackHandler.js';

export async function dispatchLineEvent(event: LineWebhookEvent): Promise<void> {
  logger.info('Received LINE event', {
    eventType: event.type
  });

  switch (event.type) {
    case 'message':
      await handleMessageEvent(event as LineMessageEvent);
      break;
    case 'postback':
      await handlePostbackEvent(event as LinePostbackEvent);
      break;
    default:
      logger.info('No handler implemented for this event type yet', {
        eventType: event.type
      });
  }
}
