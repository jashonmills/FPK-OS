
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ThresholdConfig {
  id: string;
  metric_name: string;
  upper_threshold: number;
  lower_threshold: number;
  time_window: string;
  status: 'active' | 'pending' | 'disabled';
  risk_level: 'info' | 'warning' | 'critical';
  user_segment?: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  user_count: number;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  threshold_id: string;
  user_id: string;
  changes: Record<string, any>;
  timestamp: string;
  user_email?: string;
}

export const useThresholdManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch threshold configurations
  const { data: thresholds = [], isLoading: thresholdsLoading } = useQuery({
    queryKey: ['threshold-configs'],
    queryFn: async (): Promise<ThresholdConfig[]> => {
      const { data, error } = await supabase
        .from('threshold_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'pending' | 'disabled',
        risk_level: item.risk_level as 'info' | 'warning' | 'critical'
      }));
    },
  });

  // Fetch user segments
  const { data: userSegments = [], isLoading: segmentsLoading } = useQuery({
    queryKey: ['user-segments'],
    queryFn: async (): Promise<UserSegment[]> => {
      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        criteria: item.criteria as Record<string, any>
      }));
    },
  });

  // Fetch audit log
  const { data: auditLog = [], isLoading: auditLoading } = useQuery({
    queryKey: ['threshold-audit-log'],
    queryFn: async (): Promise<AuditLogEntry[]> => {
      const { data, error } = await supabase
        .from('threshold_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []).map(entry => ({
        ...entry,
        changes: entry.changes as Record<string, any>,
        user_email: 'System User' // Since we can't join with profiles, use a default
      }));
    },
  });

  // Update threshold mutation
  const updateThresholdMutation = useMutation({
    mutationFn: async (threshold: Partial<ThresholdConfig> & { id: string }) => {
      const { data, error } = await supabase
        .from('threshold_configs')
        .update(threshold)
        .eq('id', threshold.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threshold-configs'] });
      queryClient.invalidateQueries({ queryKey: ['threshold-audit-log'] });
    },
  });

  // Create segment mutation
  const createSegmentMutation = useMutation({
    mutationFn: async (segment: Omit<UserSegment, 'id' | 'user_count' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('user_segments')
        .insert(segment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-segments'] });
    },
  });

  // Delete threshold mutation
  const deleteThresholdMutation = useMutation({
    mutationFn: async (thresholdId: string) => {
      const { error } = await supabase
        .from('threshold_configs')
        .delete()
        .eq('id', thresholdId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threshold-configs'] });
      queryClient.invalidateQueries({ queryKey: ['threshold-audit-log'] });
    },
  });

  const updateThreshold = (threshold: Partial<ThresholdConfig> & { id: string }) => {
    updateThresholdMutation.mutate(threshold);
  };

  const createSegment = (segment: Omit<UserSegment, 'id' | 'user_count' | 'created_at'>) => {
    createSegmentMutation.mutate(segment);
  };

  const deleteThreshold = (thresholdId: string) => {
    deleteThresholdMutation.mutate(thresholdId);
  };

  return {
    thresholds,
    userSegments,
    auditLog,
    isLoading: thresholdsLoading || segmentsLoading || auditLoading,
    updateThreshold,
    createSegment,
    deleteThreshold,
  };
};
