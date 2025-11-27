import { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { CourseDraft, ModuleDraft, LessonDraft, SlideDraft, CourseDraftBackend } from '@/types/course-builder';
import { supabase } from '@/integrations/supabase/client';

interface UseCourseDraftProps {
  orgId: string;
  draftId?: string;
}

export function useCourseDraft({ orgId, draftId }: UseCourseDraftProps) {
  const [draft, setDraft] = useState<CourseDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromImport, setIsFromImport] = useState(false);

  const storageKey = useMemo(() => {
    return draftId ? `course-draft-${draftId}` : `course-draft-new-${orgId}`;
  }, [draftId, orgId]);

  // Load draft from backend or localStorage
  useEffect(() => {
    const loadDraft = async () => {
      setIsLoading(true);
      
      if (draftId) {
        try {
          // Load from backend
          const { data, error } = await supabase.functions.invoke('course-drafts', {
            method: 'GET',
            body: {},
          });

          if (error) throw error;

          const backendDraft = data as CourseDraftBackend;
          const frontendDraft: CourseDraft = {
            id: backendDraft.id,
            orgId: backendDraft.org_id,
            title: backendDraft.title,
            description: backendDraft.description,
            level: backendDraft.level,
            durationEstimateMins: backendDraft.duration_minutes,
            objectives: backendDraft.structure.objectives || [],
            prerequisites: backendDraft.structure.prerequisites || [],
            backgroundImageUrl: backendDraft.structure.backgroundImageUrl,
            modules: backendDraft.structure.modules,
            framework: 'interactive_micro_learning'
          };

          setDraft(frontendDraft);
          setIsFromImport(backendDraft.source === 'scorm');
        } catch (error) {
          console.error('Failed to load draft from backend:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };

    const loadFromLocalStorage = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDraft(parsed);
        } else if (!draftId) {
          // Initialize new draft only if no draftId
          const newDraft: CourseDraft = {
            id: crypto.randomUUID(),
            orgId,
            title: '',
            description: '',
            level: 'intro',
            durationEstimateMins: 30,
            objectives: [],
            prerequisites: [],
            modules: [],
            framework: 'interactive_micro_learning'
          };
          setDraft(newDraft);
        }
      } catch (error) {
        console.error('Error loading draft from localStorage:', error);
      }
    };

    loadDraft();
  }, [draftId, storageKey, orgId]);

  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce((draftData: CourseDraft) => {
      if (draftId) {
        // Save to backend
        saveDraftToBackend(draftData);
      } else {
        // Save to localStorage for new drafts
        localStorage.setItem(storageKey, JSON.stringify(draftData));
      }
    }, 1000),
    [storageKey, draftId]
  );

  const saveDraftToBackend = async (draftData: CourseDraft) => {
    try {
      await supabase.functions.invoke(`course-drafts/${draftId}`, {
        method: 'PATCH',
        body: {
          title: draftData.title,
          description: draftData.description,
          level: draftData.level,
          durationMinutes: draftData.durationEstimateMins,
          structure: {
            modules: draftData.modules,
            objectives: draftData.objectives,
            prerequisites: draftData.prerequisites,
            backgroundImageUrl: draftData.backgroundImageUrl
          },
          status: 'ready'
        }
      });
    } catch (error) {
      console.error('Failed to save draft to backend:', error);
    }
  };

  const saveDraft = useCallback((newDraft: CourseDraft) => {
    setDraft(newDraft);
    debouncedSave(newDraft);
  }, [debouncedSave]);

  const updateCourse = useCallback((updates: Partial<CourseDraft>) => {
    if (!draft) return;
    
    const updatedDraft = { ...draft, ...updates };
    saveDraft(updatedDraft);
  }, [draft, saveDraft]);

  const addModule = useCallback((title: string) => {
    if (!draft) return;
    
    const newModule: ModuleDraft = {
      id: crypto.randomUUID(),
      title,
      lessons: []
    };
    
    const updatedDraft = {
      ...draft,
      modules: [...draft.modules, newModule]
    };
    
    saveDraft(updatedDraft);
  }, [draft, saveDraft]);

  const addLesson = useCallback((moduleId: string, title: string, description?: string) => {
    if (!draft) return;
    
    const newLesson: LessonDraft = {
      id: crypto.randomUUID(),
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
  }, [draft, saveDraft]);

  const addSlide = useCallback((moduleId: string, lessonId: string, slide: Omit<SlideDraft, 'id'>) => {
    if (!draft) return;
    
    const newSlide: SlideDraft = {
      ...slide,
      id: crypto.randomUUID()
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
  }, [draft, saveDraft]);

  const setBackgroundImageUrl = useCallback((url: string) => {
    updateCourse({ backgroundImageUrl: url });
  }, [updateCourse]);

  // Load from import data (for SCORM imports)
  const loadFromImportData = useCallback(async (importStructure: any, sourcePackageId?: string) => {
    if (!orgId) return null;

    try {
      // Create persistent draft in backend
      const { data, error } = await supabase.functions.invoke('course-drafts', {
        method: 'POST',
        body: {
          orgId,
          source: 'scorm',
          sourcePackageId,
          title: importStructure.title || 'Imported Course',
          description: importStructure.description,
          level: importStructure.level,
          durationMinutes: importStructure.durationEstimateMins,
          framework: 'interactive_micro_learning',
          structure: {
            modules: importStructure.modules || [],
            objectives: importStructure.objectives || [],
            prerequisites: importStructure.prerequisites || [],
            backgroundImageUrl: importStructure.backgroundImageUrl
          },
          status: 'ready'
        }
      });

      if (error) throw error;

      const backendDraft = data as CourseDraftBackend;
      const frontendDraft: CourseDraft = {
        id: backendDraft.id,
        orgId: backendDraft.org_id,
        title: backendDraft.title,
        description: backendDraft.description,
        level: backendDraft.level,
        durationEstimateMins: backendDraft.duration_minutes,
        objectives: backendDraft.structure.objectives || [],
        prerequisites: backendDraft.structure.prerequisites || [],
        backgroundImageUrl: backendDraft.structure.backgroundImageUrl,
        modules: backendDraft.structure.modules,
        framework: 'interactive_micro_learning'
      };

      setDraft(frontendDraft);
      setIsFromImport(true);
      
      return backendDraft.id;
    } catch (error) {
      console.error('Failed to create draft from import:', error);
      return null;
    }
  }, [orgId]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setDraft(null);
  }, [storageKey]);

  return {
    draft,
    isLoading,
    isFromImport,
    saveDraft,
    updateCourse,
    addModule,
    addLesson,
    addSlide,
    setBackgroundImageUrl,
    loadFromImportData,
    clearDraft
  };
}