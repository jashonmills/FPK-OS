import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface LearningPathConcept {
  concept_id: string;
  concept_name: string;
  concept_slug: string;
  domain: string;
  difficulty_level: number;
  mastery_level: number;
  status: 'not_started' | 'learning' | 'in_progress' | 'mastered';
  prerequisites: Array<{
    id: string;
    name: string;
    slug: string;
    type: 'required' | 'recommended' | 'related';
    strength: number;
  }>;
  related_concepts: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  last_interaction: string | null;
}

export interface RecommendedConcept {
  concept_id: string;
  concept_name: string;
  concept_slug: string;
  domain: string;
  difficulty_level: number;
  recommendation_score: number;
  reason: string;
}

export const useLearningPath = (domain?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['learning-path', user?.id, domain],
    queryFn: async (): Promise<LearningPathConcept[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase.rpc('get_user_learning_path', {
        p_user_id: user.id,
        p_domain: domain || null,
      });

      if (error) {
        console.error('Error fetching learning path:', error);
        throw error;
      }

      return (data || []) as LearningPathConcept[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecommendedConcepts = (limit: number = 5) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recommended-concepts', user?.id, limit],
    queryFn: async (): Promise<RecommendedConcept[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase.rpc('get_recommended_concepts', {
        p_user_id: user.id,
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching recommended concepts:', error);
        throw error;
      }

      return (data || []) as RecommendedConcept[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
