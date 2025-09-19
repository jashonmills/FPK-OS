import { useState, useEffect, useCallback, useRef } from 'react';
import { CourseDraft, ModuleDraft, LessonDraft, SlideDraft } from '@/types/course-builder';
import { toast } from 'sonner';

interface UseCourseDraftProps {
  orgId: string;
  draftId?: string;
}

export const useCourseDraft = ({ orgId, draftId }: UseCourseDraftProps) => {
  const [draft, setDraft] = useState<CourseDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `course-draft-${orgId}-${draftId || 'new'}`;

  // Load draft from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setDraft(JSON.parse(stored));
      } else if (!draftId) {
        // Create new draft
        const newDraft: CourseDraft = {
          id: `draft-${Date.now()}`,
          orgId,
          title: '',
          framework: 'interactive_micro_learning',
          modules: []
        };
        setDraft(newDraft);
      }
    } catch (error) {
      console.error('Error loading course draft:', error);
      toast.error('Failed to load course draft');
    } finally {
      setIsLoading(false);
    }
  }, [storageKey, orgId, draftId]);

  // Autosave to localStorage
  const saveDraft = useCallback((newDraft: CourseDraft) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newDraft));
      setDraft(newDraft);
    } catch (error) {
      console.error('Error saving course draft:', error);
      toast.error('Failed to save draft');
    }
  }, [storageKey]);

  // Update course metadata
  const updateCourse = useCallback((updates: Partial<CourseDraft>) => {
    if (!draft) return;
    
    const updatedDraft = { ...draft, ...updates };
    // Update state immediately for responsive UI
    setDraft(updatedDraft);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce the localStorage save to avoid constant writes
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedDraft));
      } catch (error) {
        console.error('Error saving course draft:', error);
        toast.error('Failed to save draft');
      }
    }, 300);
  }, [draft, storageKey]);

  // Add module
  const addModule = useCallback((title: string) => {
    if (!draft) return;
    
    const newModule: ModuleDraft = {
      id: `module-${Date.now()}`,
      title,
      lessons: []
    };
    
    const updatedDraft = {
      ...draft,
      modules: [...draft.modules, newModule]
    };
    saveDraft(updatedDraft);
    return newModule.id;
  }, [draft, saveDraft]);

  // Add lesson to module
  const addLesson = useCallback((moduleId: string, title: string, description?: string) => {
    if (!draft) return;
    
    const newLesson: LessonDraft = {
      id: `lesson-${Date.now()}`,
      title,
      description,
      slides: []
    };
    
    const updatedDraft = {
      ...draft,
      modules: draft.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    };
    saveDraft(updatedDraft);
    return newLesson.id;
  }, [draft, saveDraft]);

  // Add slide to lesson
  const addSlide = useCallback((moduleId: string, lessonId: string, slide: Omit<SlideDraft, 'id'>) => {
    if (!draft) return;
    
    const newSlide: SlideDraft = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    
    const updatedDraft = {
      ...draft,
      modules: draft.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, slides: [...lesson.slides, newSlide] }
                  : lesson
              )
            }
          : module
      )
    };
    saveDraft(updatedDraft);
    return newSlide.id;
  }, [draft, saveDraft]);

  // Set background image URL
  const setBackgroundImageUrl = useCallback((url: string) => {
    updateCourse({ backgroundImageUrl: url });
  }, [updateCourse]);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setDraft(null);
  }, [storageKey]);

  return {
    draft,
    isLoading,
    updateCourse,
    addModule,
    addLesson,
    addSlide,
    setBackgroundImageUrl,
    clearDraft,
    saveDraft
  };
};