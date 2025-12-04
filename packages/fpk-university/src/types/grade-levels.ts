export type EducationalStage = 'Primary School' | 'Junior Cycle' | 'Senior Cycle';

export interface GradeLevel {
  id: number;
  us_name: string;
  irish_name: string;
  stage: EducationalStage;
  display_order: number;
}

export interface GradeLevelDisplay {
  id: number;
  heading: string; // "1st Year (8th Grade)"
  stage: EducationalStage;
  display_order: number;
}

export const STAGE_ORDER: EducationalStage[] = [
  'Senior Cycle',
  'Junior Cycle',
  'Primary School'
];
