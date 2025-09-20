import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentIEPData {
  id: string;
  student_id: string;
  org_id: string;
  status: string;
  completion_percentage: number | null;
  current_step: number | null;
  cycle_start_date: string | null;
  cycle_end_date: string | null;
  created_at: string;
  updated_at: string;
  documents?: IEPDocument[];
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

      return {
        ...mostRecentIEP,
        documents: documents || []
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