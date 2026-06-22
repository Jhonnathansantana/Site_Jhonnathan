export interface PagefindSearchOptions {
  filters?: Record<string, unknown>;
  sort?: Record<string, 'asc' | 'desc'>;
}

export interface PagefindSearchFragment {
  url: string;
  title: string;
  excerpt: string;
  meta?: {
    title?: string;
    [key: string]: string | undefined;
  };
  content?: string;
  word_count?: number;
}

export interface PagefindSearchResult {
  id: string;
  score: number;
  words: number[];
  data: () => Promise<PagefindSearchFragment>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
  total: number;
  filters: Record<string, Record<string, number>>;
  timings: {
    preload?: number;
    search?: number;
    total: number;
  };
}

export interface Pagefind {
  init?: () => Promise<void>;
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindSearchResponse>;
  destroy?: () => Promise<void>;
}
