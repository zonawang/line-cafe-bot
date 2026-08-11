import type { MessageEvent, PostbackEvent, WebhookEvent } from '@line/bot-sdk';

export type LineWebhookEvent = WebhookEvent;
export type LineMessageEvent = MessageEvent;
export type LinePostbackEvent = PostbackEvent;

export type LineLocationMessageEvent = MessageEvent & {
  message: {
    type: 'location';
    title?: string;
    address: string;
    latitude: number;
    longitude: number;
  };
};
