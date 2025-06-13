
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ProcessingStage } from '@/components/notes/RealTimeProcessingMeter';
import { FileText, Download, Brain, Sparkles } from 'lucide-react';

export interface ProcessingState {
  uploadId: string;
  stages: ProcessingStage[];
  currentStage: string;
  overallProgress: number;
  elapsedTime: number;
  estimatedTimeRemaining?: number;
  startTime: number;
}

export const useRealTimeProcessing = () => {
  const { user } = useAuth();
  const [processingStates, setProcessingStates] = useState<Record<string, ProcessingState>>({});

  const createDefaultStages = (): ProcessingStage[] => [
    {
      id: 'upload',
      name: 'File Upload',
      description: 'Uploading file to secure storage...',
      icon: FileText,
      status: 'completed'
    },
    {
      id: 'download',
      name: 'File Processing',
      description: 'Downloading and preparing file for analysis...',
      icon: Download,
      status: 'pending'
    },
    {
      id: 'extraction',
      name: 'Content Extraction',
      description: 'Extracting and analyzing text content...',
      icon: Brain,
      status: 'pending'
    },
    {
      id: 'generation',
      name: 'AI Generation',
      description: 'AI is generating flashcards from your content...',
      icon: Sparkles,
      status: 'pending'
    }
  ];

  const startProcessing = useCallback((uploadId: string, fileName: string, fileSize: number) => {
    const stages = createDefaultStages();
    stages[1].status = 'active'; // Start with download stage
    
    setProcessingStates(prev => ({
      ...prev,
      [uploadId]: {
        uploadId,
        stages,
        currentStage: 'download',
        overallProgress: 25,
        elapsedTime: 0,
        startTime: Date.now()
      }
    }));
  }, []);

  const updateStage = useCallback((uploadId: string, stageId: string, updates: Partial<ProcessingStage>) => {
    setProcessingStates(prev => {
      const current = prev[uploadId];
      if (!current) return prev;

      const updatedStages = current.stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates } : stage
      );

      // Calculate overall progress
      const completedStages = updatedStages.filter(s => s.status === 'completed').length;
      const activeStage = updatedStages.find(s => s.status === 'active');
      const activeProgress = activeStage?.progress || 0;
      const overallProgress = (completedStages * 25) + (activeProgress * 0.25);

      return {
        ...prev,
        [uploadId]: {
          ...current,
          stages: updatedStages,
          overallProgress: Math.min(overallProgress, 100)
        }
      };
    });
  }, []);

  const completeStage = useCallback((uploadId: string, stageId: string) => {
    setProcessingStates(prev => {
      const current = prev[uploadId];
      if (!current) return prev;

      const updatedStages = current.stages.map(stage => {
        if (stage.id === stageId) {
          return { ...stage, status: 'completed' as const, progress: 100 };
        }
        return stage;
      });

      // Find next stage to activate
      const currentIndex = updatedStages.findIndex(s => s.id === stageId);
      const nextStage = updatedStages[currentIndex + 1];
      
      if (nextStage) {
        updatedStages[currentIndex + 1].status = 'active';
      }

      const completedCount = updatedStages.filter(s => s.status === 'completed').length;
      const overallProgress = (completedCount / updatedStages.length) * 100;

      return {
        ...prev,
        [uploadId]: {
          ...current,
          stages: updatedStages,
          currentStage: nextStage?.id || stageId,
          overallProgress
        }
      };
    });
  }, []);

  const errorStage = useCallback((uploadId: string, stageId: string, errorMessage: string) => {
    setProcessingStates(prev => {
      const current = prev[uploadId];
      if (!current) return prev;

      const updatedStages = current.stages.map(stage => 
        stage.id === stageId 
          ? { ...stage, status: 'error' as const, errorMessage }
          : stage
      );

      return {
        ...prev,
        [uploadId]: {
          ...current,
          stages: updatedStages
        }
      };
    });
  }, []);

  const removeProcessing = useCallback((uploadId: string) => {
    setProcessingStates(prev => {
      const newState = { ...prev };
      delete newState[uploadId];
      return newState;
    });
  }, []);

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStates(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(uploadId => {
          const state = updated[uploadId];
          const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
          
          // Estimate remaining time based on progress
          const estimatedTotal = state.overallProgress > 0 
            ? (elapsedTime / state.overallProgress) * 100 
            : undefined;
          const estimatedTimeRemaining = estimatedTotal 
            ? Math.max(0, estimatedTotal - elapsedTime)
            : undefined;

          updated[uploadId] = {
            ...state,
            elapsedTime,
            estimatedTimeRemaining
          };
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Set up real-time subscription for processing updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('processing-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'file_uploads',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const uploadId = payload.new.id;
          const status = payload.new.processing_status;

          if (status === 'processing') {
            // Start processing if not already started
            if (!processingStates[uploadId]) {
              startProcessing(uploadId, payload.new.file_name, payload.new.file_size);
            }
          } else if (status === 'completed') {
            // Complete all stages
            completeStage(uploadId, 'generation');
            setTimeout(() => removeProcessing(uploadId), 3000);
          } else if (status === 'failed') {
            // Mark current stage as error
            const currentState = processingStates[uploadId];
            if (currentState) {
              errorStage(uploadId, currentState.currentStage, payload.new.error_message || 'Processing failed');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, processingStates, startProcessing, completeStage, errorStage, removeProcessing]);

  return {
    processingStates,
    startProcessing,
    updateStage,
    completeStage,
    errorStage,
    removeProcessing
  };
};
