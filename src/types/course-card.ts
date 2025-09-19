export interface CourseCard {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  tags?: string[];
  
  // Course metadata
  source: 'platform' | 'builder' | 'scorm' | 'native';
  status: 'draft' | 'preview' | 'published' | 'archived';
  discoverable: boolean;
  
  // Source table info
  source_table: 'courses' | 'org_courses' | 'native_courses';
  
  // Organization context
  org_id?: string;
  
  // Assignment context (if assigned to user)
  assignment?: {
    id: string;
    required: boolean;
    due_at?: string;
    instructions?: string;
    assigned_by: string;
  };
  
  // Progress context (if user has progress)
  progress?: {
    completion_percentage: number;
    enrolled_at?: string;
    last_accessed?: string;
  };
  
  // Display badges
  badges: CourseCardBadge[];
  
  // Routing information
  route: string;
}

export interface CourseCardBadge {
  type: 'platform' | 'org' | 'scorm' | 'native' | 'assigned' | 'due_soon' | 'completed' | 'in_progress';
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  color?: string;
}

export interface OrgCatalogResponse {
  platform: CourseCard[];
  org: CourseCard[];
}