
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
  subject?: string[];
  description?: string | { value: string };
  covers?: number[];
  ocaid?: string;
  workKey?: string;
  isCurated?: boolean;
}

export interface OpenLibrarySearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

export interface OpenLibraryWorkResponse {
  key: string;
  title: string;
  authors?: Array<{ author: { key: string }; type: { key: string } }>;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
  created?: { value: string };
  last_modified?: { value: string };
  latest_revision?: number;
  revision?: number;
  type?: { key: string };
  ocaid?: string;
}

export interface CuratedBook {
  title: string;
  author: string;
  workKey: string;
  description?: string;
}
