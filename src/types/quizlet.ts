
export interface QuizletSet {
  id: string;
  title: string;
  creator: string;
  termCount: number;
  description?: string;
  created_date?: string;
  modified_date?: string;
  lang_terms?: string;
  lang_definitions?: string;
}

export interface QuizletTerm {
  term: string;
  definition: string;
  id?: string;
  image?: string;
}

export interface QuizletSearchResponse {
  sets: QuizletSet[];
  total_results: number;
  page: number;
}

export interface QuizletSetDetails extends QuizletSet {
  terms: QuizletTerm[];
}
