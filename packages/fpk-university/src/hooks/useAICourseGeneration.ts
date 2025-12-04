import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CourseContentManifest, LessonContentData } from '@/types/lessonContent';

interface CourseStructure {
  courseTitle: string;
  courseDescription: string;
  units: Array<{
    unitTitle: string;
    unitDescription?: string;
    lessons: Array<{
      lessonTitle: string;
      lessonDescription: string;
    }>;
  }>;
}

interface GenerationProgress {
  current: number;
  total: number;
  stage: 'idle' | 'structure' | 'lessons' | 'complete' | 'error';
  currentLesson?: string;
}

interface UseAICourseGenerationReturn {
  generateStructure: (params: {
    topic: string;
    objectives: string[];
    targetAudience: string;
    lessonCount: number;
    framework: 'sequential' | 'interactive_micro_learning';
  }) => Promise<CourseStructure | null>;
  
  generateLessonContent: (params: {
    lessonTitle: string;
    lessonDescription: string;
    unitTitle: string;
    courseTitle: string;
    courseContext: string;
    framework: 'sequential' | 'interactive_micro_learning';
  }) => Promise<any | null>;
  
  generateFullCourse: (params: {
    topic: string;
    objectives: string[];
    targetAudience: string;
    lessonCount: number;
    framework: 'sequential' | 'interactive_micro_learning';
  }) => Promise<CourseContentManifest | null>;
  
  isGenerating: boolean;
  progress: GenerationProgress;
  error: string | null;
  reset: () => void;
}

export function useAICourseGeneration(): UseAICourseGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    current: 0,
    total: 0,
    stage: 'idle'
  });
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress({ current: 0, total: 0, stage: 'idle' });
    setError(null);
  }, []);

  const generateStructure = useCallback(async (params: {
    topic: string;
    objectives: string[];
    targetAudience: string;
    lessonCount: number;
    framework: 'sequential' | 'interactive_micro_learning';
  }): Promise<CourseStructure | null> => {
    setIsGenerating(true);
    setError(null);
    setProgress({ current: 0, total: 1, stage: 'structure' });

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-course-content', {
        body: { mode: 'structure', ...params }
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate structure');

      setProgress({ current: 1, total: 1, stage: 'complete' });
      return data.structure;
    } catch (err: any) {
      console.error('Error generating structure:', err);
      setError(err.message || 'Failed to generate course structure');
      setProgress(prev => ({ ...prev, stage: 'error' }));
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateLessonContent = useCallback(async (params: {
    lessonTitle: string;
    lessonDescription: string;
    unitTitle: string;
    courseTitle: string;
    courseContext: string;
    framework: 'sequential' | 'interactive_micro_learning';
  }): Promise<any | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-course-content', {
        body: { mode: 'lesson-content', ...params }
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate lesson content');

      return data.content;
    } catch (err: any) {
      console.error('Error generating lesson content:', err);
      setError(err.message || 'Failed to generate lesson content');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateFullCourse = useCallback(async (params: {
    topic: string;
    objectives: string[];
    targetAudience: string;
    lessonCount: number;
    framework: 'sequential' | 'interactive_micro_learning';
  }): Promise<CourseContentManifest | null> => {
    setIsGenerating(true);
    setError(null);
    setProgress({ current: 0, total: params.lessonCount + 1, stage: 'structure' });

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-course-content', {
        body: { mode: 'full-course', ...params }
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate course');

      setProgress({ 
        current: params.lessonCount + 1, 
        total: params.lessonCount + 1, 
        stage: 'complete' 
      });
      
      return data.manifest as CourseContentManifest;
    } catch (err: any) {
      console.error('Error generating full course:', err);
      setError(err.message || 'Failed to generate course');
      setProgress(prev => ({ ...prev, stage: 'error' }));
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateStructure,
    generateLessonContent,
    generateFullCourse,
    isGenerating,
    progress,
    error,
    reset
  };
}
