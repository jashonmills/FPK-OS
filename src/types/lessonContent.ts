/**
 * Lesson Content Schema for Data-Driven Lesson Engine (v2)
 * 
 * This defines the standardized JSON structure for lesson content,
 * separating content from presentation.
 */

export type LessonContentType = 'video' | 'text' | 'video+text' | 'interactive';

export interface LessonResource {
  title: string;
  url: string;
  type?: 'pdf' | 'link' | 'download';
}

export interface VideoContent {
  url: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
}

export interface BaseTextSection {
  type: 'paragraph' | 'heading' | 'list' | 'callout' | 'quote';
  content: string;
  level?: number; // For headings: 1-6
  style?: 'info' | 'warning' | 'success' | 'error' | 'teaching'; // For callouts
  items?: string[]; // For lists
}

export interface CodeBlockSection {
  type: 'code';
  content: string;
  language?: string;
}

export interface QuizSection {
  type: 'quiz';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ImageSection {
  type: 'image';
  src: string;  // Can be relative path or full Supabase URL
  alt: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
}

export interface RichTextSection {
  type: 'richText';
  content: Array<{
    type: 'subheading' | 'text';
    text: string;
  }>;
}

export interface EnhancedQuizSection {
  type: 'quiz';
  quizTitle: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctAnswer: string;
    points: number;
  }>;
  passingScore: number;
  feedback: {
    pass: string;
    fail: string;
  };
}

export type TextSection = BaseTextSection | CodeBlockSection | QuizSection | EnhancedQuizSection | RichTextSection | ImageSection;

export interface LessonContentData {
  id: number;
  title: string;
  description?: string;
  contentType: LessonContentType;
  
  // Video content
  video?: VideoContent;
  
  // Text content (structured)
  sections?: TextSection[];
  
  // Legacy: Raw markdown (fallback)
  textContent?: string;
  
  // Audio narration
  audioUrl?: string;
  
  // Downloadable resources
  resources?: LessonResource[];
  
  // Metadata
  estimatedMinutes?: number;
  unit?: string;
  unitColor?: string;
}

export interface CourseContentManifest {
  courseId: string;
  courseSlug: string;
  contentVersion: 'v2';
  title: string;
  description: string;
  lessons: LessonContentData[];
}
