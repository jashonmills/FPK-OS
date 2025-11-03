import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface AICoachStudyPlan {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: number;  // in hours
  progress: number;       // percentage (0-100)
  created_at: string;
}

export function useAICoachStudyPlans(orgId?: string) {
  const { user } = useAuth();
  const [activeStudyPlan, setActiveStudyPlan] = useState<AICoachStudyPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const fetchActiveStudyPlan = async () => {
    if (!user?.id) {
      setIsLoadingPlan(false);
      return;
    }

    try {
      setIsLoadingPlan(true);

      const query = orgId
        ? supabase.from('ai_coach_study_plans').select('id, title, description, progress, estimated_hours, created_at').eq('user_id', user.id).eq('org_id', orgId).lt('progress', 100).order('created_at', { ascending: false }).limit(1)
        : supabase.from('ai_coach_study_plans').select('id, title, description, progress, estimated_hours, created_at').eq('user_id', user.id).lt('progress', 100).order('created_at', { ascending: false }).limit(1);

      const { data, error } = await query.maybeSingle();

      if (error) throw error;

      if (data) {
        // Extract topics from description or use empty array
        // In future, you might add a dedicated topics column
        const topics = extractTopicsFromDescription(data.description);

        setActiveStudyPlan({
          id: data.id,
          title: data.title,
          description: data.description,
          topics,
          estimatedTime: data.estimated_hours || 0,
          progress: data.progress || 0,
          created_at: data.created_at
        });
      } else {
        setActiveStudyPlan(null);
      }
    } catch (error) {
      console.error('Error fetching study plan:', error);
      toast.error('Failed to load study plan');
      setActiveStudyPlan(null);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const createStudyPlan = async (
    title: string,
    description: string,
    estimatedHours: number
  ): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      const insertData: any = {
        user_id: user.id,
        title,
        description,
        estimated_hours: estimatedHours,
        progress: 0
      };

      if (orgId) {
        insertData.org_id = orgId;
      }

      const { data, error } = await supabase
        .from('ai_coach_study_plans')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Study plan created successfully');
      await fetchActiveStudyPlan();
      
      return data.id;
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast.error('Failed to create study plan');
      return null;
    }
  };

  const updateStudyPlanProgress = async (
    planId: string,
    newProgress: number
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('ai_coach_study_plans')
        .update({ progress: Math.min(100, Math.max(0, newProgress)) })
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchActiveStudyPlan();
      return true;
    } catch (error) {
      console.error('Error updating study plan progress:', error);
      toast.error('Failed to update progress');
      return false;
    }
  };

  useEffect(() => {
    fetchActiveStudyPlan();
  }, [user?.id, orgId]);

  return {
    activeStudyPlan,
    isLoadingPlan,
    createStudyPlan,
    updateStudyPlanProgress,
    refetchStudyPlan: fetchActiveStudyPlan
  };
}

// Helper function to extract topics from description text
// This is a simple implementation - you might want to make it smarter
function extractTopicsFromDescription(description: string): string[] {
  // Simple extraction: look for bullet points, numbered lists, or comma-separated items
  const lines = description.split('\n');
  const topics: string[] = [];

  lines.forEach(line => {
    // Match bullet points (-, *, •)
    const bulletMatch = line.match(/^[\s]*[-*•]\s*(.+)$/);
    if (bulletMatch) {
      topics.push(bulletMatch[1].trim());
      return;
    }

    // Match numbered lists (1., 2., etc.)
    const numberedMatch = line.match(/^[\s]*\d+\.\s*(.+)$/);
    if (numberedMatch) {
      topics.push(numberedMatch[1].trim());
      return;
    }
  });

  // If no topics found in structured format, return first 3 sentences as topics
  if (topics.length === 0) {
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 3).map(s => s.trim());
  }

  return topics.slice(0, 5); // Limit to 5 topics
}
