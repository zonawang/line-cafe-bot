import { findDay1PracticeOptionByText, isDay1MenuTrigger } from '../actions/day1MessageActions.js';
import {
  buildDay1FallbackMessage,
  buildDay1PracticeMenuMessage,
  buildDay1SelectionReplyMessage
} from '../messages/day1Messages.js';
import { replyWithMessages } from '../services/replyMessageService.js';
import type { LineTextMessageEvent } from '../types/line.js';
import { logger } from '../utils/logger.js';

export async function handleTextMessage(event: LineTextMessageEvent): Promise<void> {
  const incomingText = event.message.text.trim();

  logger.info('Processing LINE text message', {
    textLength: incomingText.length
  });

  if (isDay1MenuTrigger(incomingText)) {
    logger.info('Showing Day 1 message action practice menu');
    await replyWithMessages(event.replyToken, buildDay1PracticeMenuMessage());
    return;
  }

  const selectedOption = findDay1PracticeOptionByText(incomingText);

  if (selectedOption) {
    logger.info('Recognized Day 1 message action selection', {
      label: selectedOption.label
    });

    await replyWithMessages(event.replyToken, buildDay1SelectionReplyMessage(incomingText));
    return;
  }

  logger.info('Text message did not match a Day 1 trigger, showing fallback guidance');
  await replyWithMessages(event.replyToken, buildDay1FallbackMessage());
}
