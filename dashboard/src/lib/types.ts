export interface SolarSystem {
  id: number;
  name: string;
  constellationId: number;
  regionId: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Ship {
  id: number;
  name: string;
  classId: number;
  className: string;
  description: string;
}

export interface Tribe {
  id: number;
  name: string;
  nameShort: string;
  description: string;
  taxRate: number;
  tribeUrl: string;
}

export interface Constellation {
  id: number;
  name: string;
  regionId: number;
}

export interface GameType {
  id: number;
  name: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMeta;
}

export interface NormalizedSystem extends SolarSystem {
  nx: number;
  ny: number;
  nz: number;
  size: number;
  hue: number;
}

export interface AssemblyObject {
  address: string;
  contents: Record<string, unknown> | null;
}

export interface AssemblyPage {
  objects: AssemblyObject[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface SuiEvent {
  id: { txDigest: string; eventSeq: string };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: Record<string, unknown>;
  timestampMs: string;
}

export interface SuiEventPage {
  data: SuiEvent[];
  hasNextPage: boolean;
  nextCursor: { txDigest: string; eventSeq: string } | null;
}

export interface SearchResult {
  type: "system" | "tribe" | "assembly";
  id: string;
  name: string;
  subtitle?: string;
}

export interface GalaxyEdge {
  from: number;
  to: number;
}

export interface StatusBreakdown {
  type: string;
  label: string;
  online: number;
  offline: number;
  total: number;
  color: string;
}
