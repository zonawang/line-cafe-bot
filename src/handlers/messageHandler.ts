import type { LineLocationMessageEvent, LineMessageEvent, LineTextMessageEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';
import { handleLocationMessage } from './locationHandler.js';
import { handleTextMessage } from './textMessageHandler.js';

export async function handleMessageEvent(event: LineMessageEvent): Promise<void> {
  logger.info('Received LINE message event', {
    messageType: event.message.type,
    sourceType: event.source.type
  });

  if (event.message.type === 'location') {
    await handleLocationMessage(event as LineLocationMessageEvent);
    return;
  }

  if (event.message.type === 'text') {
    await handleTextMessage(event as LineTextMessageEvent);
    return;
  }

  logger.info('Non-text message received (no Day 1 handler yet)', {
    messageType: event.message.type
  });
}
