export enum AppStep {
  Landing,
  Upload,
  Payment,
  Processing,
  Results,
}

export interface UserData {
  image: string; // base64 encoded image
  includeRegions?: string[];
  excludeRegions?: string[];
}

export interface AncestryRegion {
  region: string;
  percentage: number;
  confidence: string;
}

export interface HistoricalContext {
    region: string;
    context: string;
}

export interface AncestryReport {
  summary: string;
  regionalBreakdown: AncestryRegion[];
  historicalContexts: HistoricalContext[];
}