export type SlideKind = 'content' | 'image' | 'video' | 'pdf' | 'embed' | 'quiz' | 'activity';

export interface SlideAsset {
  name: string;
  url: string;
  kind: 'image' | 'video' | 'pdf' | 'other';
}

export interface SlideDraft {
  id: string;
  kind: SlideKind;
  title?: string;
  html?: string;        // rich text/HTML
  mediaUrl?: string;    // primary media if applicable
  assets?: SlideAsset[]; // optional extra assets
}

export interface LessonDraft {
  id: string;
  title: string;
  description?: string;
  slides: SlideDraft[];
}

export interface ModuleDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

export interface CourseDraft {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  level?: 'intro' | 'intermediate' | 'advanced';
  durationEstimateMins?: number;
  objectives?: string[];
  prerequisites?: string[];
  backgroundImageUrl?: string; // full-screen background
  modules: ModuleDraft[];
  framework: 'interactive_micro_learning';
}

// Backend persistent draft interface
export interface CourseDraftBackend {
  id: string;
  org_id: string;
  source: 'scorm' | 'manual' | 'json' | 'csv';
  source_package_id?: string;
  title: string;
  description?: string;
  level?: 'intro' | 'intermediate' | 'advanced';
  duration_minutes?: number;
  framework: 'interactive_micro_learning' | 'sequential_learning';
  structure: {
    modules: ModuleDraft[];
    objectives?: string[];
    prerequisites?: string[];
    backgroundImageUrl?: string;
  };
  status: 'parsing' | 'ready' | 'error';
  validation: {
    errors: string[];
    warnings: string[];
  };
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export type WizardStep = 'overview' | 'planning' | 'design' | 'review';