import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AuditEvent {
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'access';
  tableName: string;
  recordId?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  legalBasis?: string;
  purpose?: string;
}

export function useAuditLog() {
  const { user } = useAuth();

  const logEvent = async (event: AuditEvent) => {
    if (!user) return;

    try {
      await supabase.rpc('record_audit_event', {
        p_user_id: user.id,
        p_action: event.action,
        p_table_name: event.tableName,
        p_record_id: event.recordId || null,
        p_old_values: event.oldValues as any || null,
        p_new_values: event.newValues as any || null,
        p_legal_basis: event.legalBasis || null,
        p_purpose: event.purpose || null,
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  };

  const logDataAccess = async (tableName: string, recordId?: string, purpose?: string) => {
    await logEvent({
      action: 'read',
      tableName,
      recordId,
      purpose: purpose || `User accessed ${tableName} data`,
      legalBasis: 'legitimate_interest',
    });
  };

  const logDataExport = async (dataTypes: string[], recordCount: number) => {
    await logEvent({
      action: 'export',
      tableName: 'user_data_export',
      newValues: {
        exported_data_types: dataTypes,
        record_count: recordCount,
        export_format: 'JSON',
      },
      purpose: 'User requested data export (GDPR Article 20)',
      legalBasis: 'legal_obligation',
    });
  };

  const logDataDeletion = async (tableName: string, recordId: string, reason: string) => {
    await logEvent({
      action: 'delete',
      tableName,
      recordId,
      purpose: reason,
      legalBasis: reason.includes('GDPR') ? 'legal_obligation' : 'contract',
    });
  };

  const getUserAuditLogs = async (limit: number = 100) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(limit);

    return { data, error };
  };

  return {
    logEvent,
    logDataAccess,
    logDataExport,
    logDataDeletion,
    getUserAuditLogs,
  };
}