import type { messagingApi } from '@line/bot-sdk';

export type Day1PracticeOption = {
  label: string;
  text: string;
  summary: string;
};

const DAY1_PRACTICE_OPTIONS: Day1PracticeOption[] = [
  {
    label: '附近咖啡廳',
    text: '找附近適合工作的咖啡廳',
    summary: '你想先看附近有哪些可工作的候選店家。'
  },
  {
    label: '有插座',
    text: '我想找有插座的咖啡廳',
    summary: '你目前優先在意插座與筆電續航。'
  },
  {
    label: '不限時',
    text: '我想找不限時的咖啡廳',
    summary: '你希望可以久坐處理工作。'
  },
  {
    label: '安靜 Wi-Fi',
    text: '我想找安靜且有 Wi-Fi 的咖啡廳',
    summary: '你在意安靜環境與穩定網路。'
  }
];

const DAY1_MENU_TRIGGER_TEXTS = new Set([
  '開始',
  'start',
  'menu',
  'help',
  '幫助',
  'day1',
  'day 1',
  '顯示選單',
  '顯示咖啡廳條件選單'
]);

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function createMessageAction(option: Day1PracticeOption): messagingApi.MessageAction {
  return {
    type: 'message',
    label: option.label,
    text: option.text
  };
}

export function buildDay1MessageActionQuickReplyItems(): messagingApi.QuickReplyItem[] {
  return DAY1_PRACTICE_OPTIONS.map((option) => ({
    type: 'action',
    action: createMessageAction(option)
  }));
}

export function isDay1MenuTrigger(text: string): boolean {
  return DAY1_MENU_TRIGGER_TEXTS.has(normalizeText(text));
}

export function findDay1PracticeOptionByText(text: string): Day1PracticeOption | undefined {
  const normalizedText = normalizeText(text);

  return DAY1_PRACTICE_OPTIONS.find((option) => {
    return (
      normalizeText(option.text) === normalizedText || normalizeText(option.label) === normalizedText
    );
  });
}
