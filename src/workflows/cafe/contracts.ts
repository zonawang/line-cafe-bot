/** Values passed between workflow nodes; no LINE credentials belong here. */
export interface CafeLocation {
  latitude: number;
  longitude: number;
}

export interface CafeWorkflowInput {
  text: string;
  location?: CafeLocation;
}

export interface CafeSearchRequest {
  query: string;
  location?: CafeLocation;
}

export interface DemoCafe {
  id: string;
  name: string;
  features: readonly string[];
}

export interface CafeSearchResults {
  source: 'mock';
  request: CafeSearchRequest;
  cafes: readonly DemoCafe[];
}

export interface CafeWorkflowOutput {
  source: 'mock';
  text: string;
  cafeIds: readonly string[];
}
