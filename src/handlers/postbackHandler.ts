import type { LinePostbackEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';

export async function handlePostbackEvent(event: LinePostbackEvent): Promise<void> {
  logger.info('Postback event received (future implementation placeholder)', {
    data: event.postback.data,
    params: event.postback.params ?? null
  });
}
