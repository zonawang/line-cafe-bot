import { createEvent, node, Workflow, type NodeContext } from '@google/adk';
import type {
  CafeSearchRequest,
  CafeSearchResults,
  CafeWorkflowInput,
} from '../../../src/workflows/cafe/contracts.js';
import { toCafeWorkflowInput } from '../../../src/workflows/cafe/lineInputAdapter.js';
import {
  formatCafeResults,
  normalizeCafeInput,
  searchMockCafes,
} from '../../../src/workflows/cafe/mockCafePipeline.js';

// The CLI supplies text. Wrap it as a minimal LINE-like text event for practice;
// production webhook dispatch is connected in a later lesson.
const mapLineInput = node(
  (_ctx: NodeContext, text: string) =>
    createEvent({
      output: toCafeWorkflowInput({ message: { type: 'text', text } }),
    }),
  { name: 'map_line_input' },
);

const normalizeRequest = node(
  (_ctx: NodeContext, input: CafeWorkflowInput) =>
    createEvent({ output: normalizeCafeInput(input) }),
  { name: 'normalize_request' },
);

const mockSearch = node(
  (_ctx: NodeContext, request: CafeSearchRequest) =>
    createEvent({ output: searchMockCafes(request) }),
  { name: 'mock_search' },
);

const renderReply = node(
  (_ctx: NodeContext, results: CafeSearchResults) => {
    const output = formatCafeResults(results);
    // output is machine-readable; content is what the CLI/Web UI displays.
    return createEvent({
      output,
      content: { role: 'model', parts: [{ text: output.text }] },
    });
  },
  { name: 'render_reply' },
);

export const rootAgent = new Workflow({
  name: 'line_cafe_workflow_day_03',
  edges: [['START', mapLineInput, normalizeRequest, mockSearch, renderReply]],
});
