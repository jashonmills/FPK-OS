import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Advanced Conversation Memory Management Hook - Phase 1 Implementation
interface WorkingMemory {
  currentTopic: string | null;
  questionSequence: string[];
  studentResponses: string[];
  misconceptions: string[];
}

interface EpisodicMemory {
  sessionHistory: SessionData[];
  learningPatterns: string[];
  successfulStrategies: string[];
}

interface SessionData {
  timestamp: string;
  topic: string;
  performance: number;
  [key: string]: unknown;
}

interface SemanticMemory {
  conceptMap: Record<string, string[]>;
  knowledgeGaps: string[];
  masteredConcepts: string[];
}

interface ProceduralMemory {
  preferredQuestioningStyles: string[];
  effectiveScaffolding: string[];
  adaptationStrategies: string[];
}

interface ConversationMemory {
  id?: string;
  user_id: string;
  session_id: string;
  memory_type: 'working' | 'episodic' | 'semantic' | 'procedural';
  memory_data: WorkingMemory | EpisodicMemory | SemanticMemory | ProceduralMemory;
  created_at?: string;
  updated_at?: string;
}

interface MemoryState {
  working: WorkingMemory;
  episodic: EpisodicMemory;
  semantic: SemanticMemory;
  procedural: ProceduralMemory;
}

export const useConversationMemory = (sessionId: string | null) => {
  const [memory, setMemory] = useState<MemoryState>({
    working: {
      currentTopic: null,
      questionSequence: [],
      studentResponses: [],
      misconceptions: []
    },
    episodic: {
      sessionHistory: [],
      learningPatterns: [],
      successfulStrategies: []
    },
    semantic: {
      conceptMap: {},
      knowledgeGaps: [],
      masteredConcepts: []
    },
    procedural: {
      preferredQuestioningStyles: [],
      effectiveScaffolding: [],
      adaptationStrategies: []
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load conversation memory for session
  const loadMemory = async () => {
    if (!user?.id || !sessionId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

      if (error) throw error;

      // Organize memory by type
      const memoryByType = data.reduce((acc, item) => {
        acc[item.memory_type] = item.memory_data;
        return acc;
      }, {} as Record<string, unknown>);

      setMemory({
        working: (memoryByType.working as WorkingMemory) || memory.working,
        episodic: (memoryByType.episodic as EpisodicMemory) || memory.episodic,
        semantic: (memoryByType.semantic as SemanticMemory) || memory.semantic,
        procedural: (memoryByType.procedural as ProceduralMemory) || memory.procedural
      });
    } catch (error) {
      console.error('Error loading conversation memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update specific memory type
  const updateMemory = async (
    memoryType: 'working' | 'episodic' | 'semantic' | 'procedural',
    updates: Partial<WorkingMemory | EpisodicMemory | SemanticMemory | ProceduralMemory>
  ) => {
    if (!user?.id || !sessionId) return;

    try {
      const currentMemory = memory[memoryType];
      const updatedMemory = { ...currentMemory, ...updates };

      const { error } = await supabase
        .from('conversation_memory')
        .upsert({
          user_id: user.id,
          session_id: sessionId,
          memory_type: memoryType,
          memory_data: updatedMemory as any,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,session_id,memory_type'
        });

      if (error) throw error;

      setMemory(prev => ({
        ...prev,
        [memoryType]: updatedMemory
      }));
    } catch (error) {
      console.error(`Error updating ${memoryType} memory:`, error);
    }
  };

  // Working Memory Operations
  const addToQuestionSequence = (question: string) => {
    const updatedSequence = [...memory.working.questionSequence, question].slice(-10); // Keep last 10
    updateMemory('working', { questionSequence: updatedSequence });
  };

  const addStudentResponse = (response: string) => {
    const updatedResponses = [...memory.working.studentResponses, response].slice(-10); // Keep last 10
    updateMemory('working', { studentResponses: updatedResponses });
  };

  const setCurrentTopic = (topic: string) => {
    updateMemory('working', { currentTopic: topic });
  };

  const addMisconception = (misconception: string) => {
    const misconceptions = [...new Set([...memory.working.misconceptions, misconception])];
    updateMemory('working', { misconceptions });
  };

  // Episodic Memory Operations
  const addLearningPattern = (pattern: string) => {
    const patterns = [...new Set([...memory.episodic.learningPatterns, pattern])];
    updateMemory('episodic', { learningPatterns: patterns });
  };

  const addSuccessfulStrategy = (strategy: string) => {
    const strategies = [...new Set([...memory.episodic.successfulStrategies, strategy])];
    updateMemory('episodic', { successfulStrategies: strategies });
  };

  const updateSessionHistory = (sessionData: SessionData) => {
    const history = [...memory.episodic.sessionHistory, sessionData].slice(-20); // Keep last 20
    updateMemory('episodic', { sessionHistory: history });
  };

  // Semantic Memory Operations
  const updateConceptMap = (concept: string, relatedConcepts: string[]) => {
    const conceptMap = {
      ...memory.semantic.conceptMap,
      [concept]: relatedConcepts
    };
    updateMemory('semantic', { conceptMap });
  };

  const addKnowledgeGap = (gap: string) => {
    const gaps = [...new Set([...memory.semantic.knowledgeGaps, gap])];
    updateMemory('semantic', { knowledgeGaps: gaps });
  };

  const addMasteredConcept = (concept: string) => {
    const mastered = [...new Set([...memory.semantic.masteredConcepts, concept])];
    // Remove from knowledge gaps if present
    const gaps = memory.semantic.knowledgeGaps.filter(gap => gap !== concept);
    updateMemory('semantic', { 
      masteredConcepts: mastered,
      knowledgeGaps: gaps 
    });
  };

  // Procedural Memory Operations
  const addPreferredQuestioningStyle = (style: string) => {
    const styles = [...new Set([...memory.procedural.preferredQuestioningStyles, style])];
    updateMemory('procedural', { preferredQuestioningStyles: styles });
  };

  const addEffectiveScaffolding = (scaffolding: string) => {
    const scaffolds = [...new Set([...memory.procedural.effectiveScaffolding, scaffolding])];
    updateMemory('procedural', { effectiveScaffolding: scaffolds });
  };

  const addAdaptationStrategy = (strategy: string) => {
    const strategies = [...new Set([...memory.procedural.adaptationStrategies, strategy])];
    updateMemory('procedural', { adaptationStrategies: strategies });
  };

  // Analysis functions
  const getConversationInsights = () => {
    return {
      topicProgression: memory.working.questionSequence.length,
      identifiedMisconceptions: memory.working.misconceptions.length,
      learningPatterns: memory.episodic.learningPatterns,
      knowledgeGaps: memory.semantic.knowledgeGaps.length,
      masteredConcepts: memory.semantic.masteredConcepts.length,
      preferredStrategies: memory.procedural.preferredQuestioningStyles
    };
  };

  const getAdaptationRecommendations = () => {
    const insights = getConversationInsights();
    const recommendations = [];

    if (insights.identifiedMisconceptions > 3) {
      recommendations.push({
        type: 'misconception_focus',
        message: 'Focus on addressing core misconceptions before advancing',
        priority: 'high'
      });
    }

    if (insights.knowledgeGaps > insights.masteredConcepts) {
      recommendations.push({
        type: 'foundation_building',
        message: 'Strengthen foundational concepts',
        priority: 'medium'
      });
    }

    if (memory.procedural.preferredQuestioningStyles.length > 0) {
      recommendations.push({
        type: 'questioning_adaptation',
        message: `Use preferred questioning style: ${memory.procedural.preferredQuestioningStyles[0]}`,
        priority: 'low'
      });
    }

    return recommendations;
  };

  // Clear memory for new session
  const clearWorkingMemory = () => {
    updateMemory('working', {
      currentTopic: null,
      questionSequence: [],
      studentResponses: [],
      misconceptions: []
    });
  };

  useEffect(() => {
    if (sessionId && user?.id) {
      loadMemory();
    }
  }, [sessionId, user?.id]);

  return {
    memory,
    isLoading,
    
    // Working Memory
    addToQuestionSequence,
    addStudentResponse,
    setCurrentTopic,
    addMisconception,
    
    // Episodic Memory
    addLearningPattern,
    addSuccessfulStrategy,
    updateSessionHistory,
    
    // Semantic Memory
    updateConceptMap,
    addKnowledgeGap,
    addMasteredConcept,
    
    // Procedural Memory
    addPreferredQuestioningStyle,
    addEffectiveScaffolding,
    addAdaptationStrategy,
    
    // Analysis
    getConversationInsights,
    getAdaptationRecommendations,
    clearWorkingMemory,
    refreshMemory: loadMemory
  };
};