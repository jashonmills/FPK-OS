import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface IEPGoal {
  id: string;
  iep_plan_id: string;
  domain: string;
  goal_type: string;
  baseline: string;
  annual_goal: string;
  measurement_method: string;
  success_criterion: string;
  progress_schedule: string;
  curriculum_mapping: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface IEPService {
  id: string;
  iep_plan_id: string;
  service_type: string;
  provider_role: string;
  minutes_per_week: number | null;
  setting_type: string | null;
  frequency: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface IEPAccommodation {
  id: string;
  iep_plan_id: string;
  accommodation_type: string;
  context: string;
  description: string;
  is_modification: boolean | null;
  notes: string | null;
  created_at: string;
}

export interface StudentIEPData {
  id: string;
  student_id: string;
  org_id: string;
  jurisdiction: string;
  status: string;
  referral_reason: string | null;
  suspected_disability_categories: string[] | null;
  completion_percentage: number | null;
  current_step: number | null;
  cycle_start_date: string | null;
  cycle_end_date: string | null;
  created_at: string;
  updated_at: string;
  documents?: IEPDocument[];
  goals?: IEPGoal[];
  services?: IEPService[];
  accommodations?: IEPAccommodation[];
}

export interface IEPDocument {
  id: string;
  entity_id: string;
  entity_type: string;
  file_name: string;
  file_type: string;
  file_url: string;
  document_category: string | null;
  upload_date: string;
  uploaded_by: string;
}

export function useStudentIEP(orgId: string, studentId: string) {
  const { toast } = useToast();

  const { data: iepData, isLoading, error, refetch } = useQuery({
    queryKey: ['student-iep', orgId, studentId],
    queryFn: async () => {
      // First, get IEP plans for this student
      const { data: iepPlans, error: iepError } = await supabase
        .from('iep_plans')
        .select('*')
        .eq('org_id', orgId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (iepError) {
        console.error('Error fetching IEP plans:', iepError);
        throw iepError;
      }

      const mostRecentIEP = iepPlans?.[0];

      if (!mostRecentIEP) {
        return null; // No IEP found
      }

      // Get documents for this IEP plan
      const { data: documents, error: docsError } = await supabase
        .from('iep_documents')
        .select('*')
        .eq('entity_type', 'iep_plan')
        .eq('entity_id', mostRecentIEP.id)
        .order('upload_date', { ascending: false });

      if (docsError) {
        console.error('Error fetching IEP documents:', docsError);
        // Don't throw here, just log the error
      }

      // Get goals for this IEP plan
      const { data: goals, error: goalsError } = await supabase
        .from('iep_goals')
        .select('*')
        .eq('iep_plan_id', mostRecentIEP.id)
        .order('domain', { ascending: true });

      if (goalsError) {
        console.error('Error fetching IEP goals:', goalsError);
      }

      // Get services for this IEP plan
      const { data: services, error: servicesError } = await supabase
        .from('iep_services')
        .select('*')
        .eq('iep_plan_id', mostRecentIEP.id)
        .order('service_type', { ascending: true });

      if (servicesError) {
        console.error('Error fetching IEP services:', servicesError);
      }

      // Get accommodations for this IEP plan
      const { data: accommodations, error: accommodationsError } = await supabase
        .from('iep_accommodations')
        .select('*')
        .eq('iep_plan_id', mostRecentIEP.id)
        .order('accommodation_type', { ascending: true });

      if (accommodationsError) {
        console.error('Error fetching IEP accommodations:', accommodationsError);
      }

      return {
        ...mostRecentIEP,
        documents: documents || [],
        goals: goals || [],
        services: services || [],
        accommodations: accommodations || []
      } as StudentIEPData;
    },
    enabled: !!(orgId && studentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getIEPStatus = (): 'none' | 'in_progress' | 'completed' => {
    if (!iepData) return 'none';
    
    if (iepData.status === 'completed' || iepData.completion_percentage === 100) {
      return 'completed';
    }
    
    if (iepData.status === 'in_progress' || (iepData.completion_percentage && iepData.completion_percentage > 0)) {
      return 'in_progress';
    }
    
    return 'none';
  };

  const hasDocuments = iepData?.documents && iepData.documents.length > 0;

  return {
    iepData,
    isLoading,
    error,
    refetch,
    status: getIEPStatus(),
    hasDocuments,
    currentStep: iepData?.current_step || 1,
    completionPercentage: iepData?.completion_percentage || 0,
    documents: iepData?.documents || []
  };
}