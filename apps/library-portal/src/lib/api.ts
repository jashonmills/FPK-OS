/**
 * API Service for FPK Library Portal
 * Communicates with the library-portal-api Edge Function
 */

// For static deployment, hardcode the values
const API_URL = 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/library-portal-api';
const API_KEY = 'fe38cbda-22b2-4958-83ee-b407e249ce88';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnY2Vna21xZmd6bmJwZHBsc2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDcxNTgsImV4cCI6MjA2NDk4MzE1OH0.RCtAqfgz7aqjG-QWiOqFBCG5xg2Rok9T4tbyGQMnCm8';

export interface Course {
  id: string;
  title: string;
  description: string;
  asset_path: string | null;
  featured: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  transcript: string;
  video_url: string | null;
  lesson_number: number;
  course_id: string;
}

// Database uses flat lessons structure, not units
// Keeping Unit interface for compatibility but it won't be used

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  asset_path: string | null;
  featured: boolean;
}

export interface LessonDetail {
  id: string;
  title: string;
  transcript: string;
  video_url: string | null;
  lesson_number: number;
  course_id: string;
}

async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'x-library-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchCourses(): Promise<Course[]> {
  const data = await fetchAPI('?mode=list');
  // Edge Function returns array directly for list mode
  return Array.isArray(data) ? data : [];
}

export async function fetchCourseDetail(courseId: string): Promise<{
  course: CourseDetail;
  lessons: Lesson[];
}> {
  const data = await fetchAPI(`?mode=course&id=${courseId}`);
  return data;
}

export async function fetchLessonDetail(courseId: string, lessonId: string): Promise<{
  lesson: LessonDetail;
  course: { id: string; title: string };
  allLessons: Array<{ id: string; title: string; lesson_number: number }>;
}> {
  const data = await fetchAPI(`?mode=lesson&id=${courseId}&lessonId=${lessonId}`);
  return data;
}
