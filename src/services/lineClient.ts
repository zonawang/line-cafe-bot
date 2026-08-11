import { messagingApi, type MiddlewareConfig } from '@line/bot-sdk';

import { env } from '../utils/env.js';

export const lineMiddlewareConfig: MiddlewareConfig = {
  channelSecret: env.LINE_CHANNEL_SECRET,
  channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN
};

export const lineMessagingClient = new messagingApi.MessagingApiClient({
  channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN
});
