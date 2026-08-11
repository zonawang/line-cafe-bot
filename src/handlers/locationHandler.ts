import type { LineLocationMessageEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';

export async function handleLocationMessage(event: LineLocationMessageEvent): Promise<void> {
  logger.info('Location message received (Day 2 placeholder)', {
    title: event.message.title ?? null,
    address: event.message.address,
    latitude: event.message.latitude,
    longitude: event.message.longitude
  });
}
