
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  summary: string;
  keyFindings: string[];
  policyImplementations: string[];
  similarTopics: string[];
  citationCount?: string; // Estimated
  url?: string;
  paperId?: string; // DOI, NBER Number, etc.
}

export interface SearchResponse {
  papers: ResearchPaper[];
  clarifications: string[];
  totalResultsEstimate?: string;
}

export enum LoadingStage {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING', // Interfacing with search engine
  SYNTHESIZING = 'SYNTHESIZING', // Formatting and summarizing
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
