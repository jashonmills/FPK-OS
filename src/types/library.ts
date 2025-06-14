
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  workKey?: string;
  cover_i?: number | null;
  first_publish_year?: number;
  subject?: string[];
  description?: string;
  isCurated?: boolean;
  ocaid?: string;
  // Additional properties for backward compatibility
  isbn?: string[];
  publisher?: string[];
  // Public domain book specific fields
  epub_url?: string;
  isPublicDomain?: boolean;
  gutenberg_id?: number;
}

export interface CuratedBook {
  title: string;
  author: string;
  workKey: string;
  description: string;
  coverId?: number;
}

export interface OpenLibrarySearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

export interface OpenLibraryWorkResponse {
  key: string;
  title: string;
  authors?: Array<{ author: { key: string } }>;
  covers?: number[];
  description?: string | { value: string };
  subjects?: string[];
  first_publish_date?: string;
}
