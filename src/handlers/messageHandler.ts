import type { LineLocationMessageEvent, LineMessageEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';
import { handleLocationMessage } from './locationHandler.js';

export async function handleMessageEvent(event: LineMessageEvent): Promise<void> {
  logger.info('Received LINE message event', {
    messageType: event.message.type,
    sourceType: event.source.type
  });

  if (event.message.type === 'location') {
    await handleLocationMessage(event as LineLocationMessageEvent);
    return;
  }

  logger.info('Message handler placeholder executed', {
    messageType: event.message.type
  });
}
