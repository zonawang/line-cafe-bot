import type { messagingApi } from '@line/bot-sdk';

import {
  buildDay1MessageActionQuickReplyItems,
  findDay1PracticeOptionByText
} from '../actions/day1MessageActions.js';

function createDay1TextMessage(text: string): messagingApi.TextMessage {
  return {
    type: 'text',
    text,
    quickReply: {
      items: buildDay1MessageActionQuickReplyItems()
    }
  };
}

export function buildDay1PracticeMenuMessage(): messagingApi.TextMessage {
  return createDay1TextMessage(
    'Day 1：Message action 練習。\n點下面任一個按鈕，LINE 會自動把預設文字送回 bot。這一步先確認按鈕與 webhook 收訊正常。'
  );
}

export function buildDay1SelectionReplyMessage(text: string): messagingApi.TextMessage {
  const selectedOption = findDay1PracticeOptionByText(text);

  if (!selectedOption) {
    return buildDay1FallbackMessage();
  }

  return createDay1TextMessage(
    `已收到你的條件：${selectedOption.label}。\n這表示剛剛的 Message action 已成功把文字送回 bot。\n${selectedOption.summary}\n\n目前先做到 Day 1，真正的附近搜尋流程會在後續步驟再接上。`
  );
}

export function buildDay1FallbackMessage(): messagingApi.TextMessage {
  return createDay1TextMessage(
    '目前這個 bot 只做到 Day 1 的 Message action。\n傳「開始」或直接點下面按鈕，就能測試條件文字是否有成功送回 bot。'
  );
}
