import { NodeContext, Workflow, node } from '@google/adk';

function normalizeCafeRequest(_context: NodeContext, input: string): string {
  return input.trim();
}

function explainNextStep(_context: NodeContext, request: string): string {
  if (!request) {
    return '請輸入你想找的咖啡廳條件。';
  }

  return `收到需求：「${request}」。下一步會檢查位置，再搜尋附近咖啡廳。`;
}

export const rootAgent = new Workflow({
  name: 'line_cafe_workflow_day_02',
  edges: [
    [
      'START',
      node(normalizeCafeRequest, { name: 'normalize_cafe_request' }),
      node(explainNextStep, { name: 'explain_next_step' }),
    ],
  ],
});
