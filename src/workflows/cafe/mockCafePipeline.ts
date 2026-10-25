import type {
  CafeSearchRequest,
  CafeSearchResults,
  CafeWorkflowInput,
  CafeWorkflowOutput,
  DemoCafe,
} from './contracts.js';

const DEMO_CAFES: readonly DemoCafe[] = [
  { id: 'demo-cafe-a', name: '示範咖啡 A', features: ['Wi-Fi', '插座'] },
  { id: 'demo-cafe-b', name: '示範咖啡 B', features: ['安靜座位'] },
];

export function normalizeCafeInput(input: CafeWorkflowInput): CafeSearchRequest {
  const request: CafeSearchRequest = { query: input.text.trim() || '咖啡廳' };
  if (input.location) {
    request.location = { ...input.location };
  }
  return request;
}

/** Fixed fictional data: no API call, proximity search, or preference ranking. */
export function searchMockCafes(request: CafeSearchRequest): CafeSearchResults {
  return {
    source: 'mock',
    request,
    cafes: DEMO_CAFES.map((cafe) => ({ ...cafe, features: [...cafe.features] })),
  };
}

export function formatCafeResults(results: CafeSearchResults): CafeWorkflowOutput {
  const rows = results.cafes.map(
    (cafe, index) => `${index + 1}. ${cafe.name}：${cafe.features.join('、')}`,
  );
  return {
    source: 'mock',
    text: [
      '【教學假資料，非真實店家／附近搜尋結果】',
      `需求：${results.request.query}`,
      ...rows,
    ].join('\n'),
    cafeIds: results.cafes.map((cafe) => cafe.id),
  };
}
