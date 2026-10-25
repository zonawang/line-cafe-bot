import type { CafeWorkflowInput } from './contracts.js';

/** The supported message fields from an already parsed LINE event. */
export type CafeLineEventInput =
  | { message: { type: 'text'; text: string } }
  | { message: { type: 'location'; latitude: number; longitude: number } };

/**
 * Map a supported LINE message to a workflow value.
 * This is a typed mapper, not a validator for raw webhook JSON.
 */
export function toCafeWorkflowInput(event: CafeLineEventInput): CafeWorkflowInput {
  if (event.message.type === 'text') {
    return { text: event.message.text };
  }

  return {
    text: '',
    location: {
      latitude: event.message.latitude,
      longitude: event.message.longitude,
    },
  };
}
