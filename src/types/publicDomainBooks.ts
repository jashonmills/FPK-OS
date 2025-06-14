
export interface PublicDomainBook {
  id: string;
  title: string;
  author: string;
  subjects: string[];
  cover_url?: string;
  epub_url: string;
  gutenberg_id: number;
  description?: string;
  language?: string;
  last_updated: string;
  created_at: string;
}

export interface OPDSEntry {
  id: string;
  title: string;
  author: string;
  summary?: string;
  subjects: string[];
  links: Array<{
    href: string;
    type: string;
    rel: string;
  }>;
  updated: string;
}

export interface OPDSFeed {
  title: string;
  updated: string;
  entries: OPDSEntry[];
}
