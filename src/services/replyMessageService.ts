import type { messagingApi } from '@line/bot-sdk';

import { logger } from '../utils/logger.js';
import { lineMessagingClient } from './lineClient.js';

export async function replyWithMessages(
  replyToken: string,
  messages: messagingApi.Message | messagingApi.Message[]
): Promise<void> {
  const messageList = Array.isArray(messages) ? messages : [messages];

  logger.info('Replying to LINE event', {
    messageCount: messageList.length,
    messageTypes: messageList.map((message) => message.type)
  });

  await lineMessagingClient.replyMessage({
    replyToken,
    messages: messageList
  });
}
