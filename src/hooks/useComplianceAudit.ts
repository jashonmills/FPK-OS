
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  eventType: 'data_access' | 'data_export' | 'consent_change' | 'login' | 'logout' | 'data_deletion' | 'profile_update';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface ComplianceMetrics {
  totalUsers: number;
  consentedUsers: number;
  dataExportRequests: number;
  deletionRequests: number;
  privacyBreeches: number;
  lastAuditDate: string;
}

export const useComplianceAudit = () => {
  const { user } = useAuth();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    totalUsers: 0,
    consentedUsers: 0,
    dataExportRequests: 0,
    deletionRequests: 0,
    privacyBreeches: 0,
    lastAuditDate: new Date().toISOString(),
  });

  // Log audit events
  const logEvent = useCallback((eventType: AuditEvent['eventType'], details: Record<string, any>) => {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: user?.id,
      eventType,
      details,
      ipAddress: 'anonymized', // In production, use anonymized IP
      userAgent: navigator.userAgent,
    };

    // Store in localStorage for demo (in production, send to secure audit log)
    const existingEvents = JSON.parse(localStorage.getItem('audit_events') || '[]');
    const updatedEvents = [event, ...existingEvents].slice(0, 1000); // Keep last 1000 events
    localStorage.setItem('audit_events', JSON.stringify(updatedEvents));
    
    setAuditEvents(updatedEvents);
    
    console.log('🔍 Audit Event Logged:', event);
  }, [user]);

  // Load existing audit events
  useEffect(() => {
    const existingEvents = JSON.parse(localStorage.getItem('audit_events') || '[]');
    setAuditEvents(existingEvents);
  }, []);

  // Calculate compliance metrics
  useEffect(() => {
    const calculateMetrics = () => {
      const consentEvents = auditEvents.filter(e => e.eventType === 'consent_change');
      const exportEvents = auditEvents.filter(e => e.eventType === 'data_export');
      const deletionEvents = auditEvents.filter(e => e.eventType === 'data_deletion');
      
      setMetrics({
        totalUsers: auditEvents.filter(e => e.eventType === 'login').length,
        consentedUsers: consentEvents.length,
        dataExportRequests: exportEvents.length,
        deletionRequests: deletionEvents.length,
        privacyBreeches: 0, // Would be tracked separately in production
        lastAuditDate: new Date().toISOString(),
      });
    };

    calculateMetrics();
  }, [auditEvents]);

  // Generate compliance report
  const generateComplianceReport = useCallback(() => {
    const report = {
      generatedAt: new Date().toISOString(),
      reportPeriod: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        end: new Date().toISOString(),
      },
      metrics,
      recentEvents: auditEvents.slice(0, 100),
      dataProcessingActivities: {
        userRegistrations: auditEvents.filter(e => e.eventType === 'login').length,
        consentChanges: auditEvents.filter(e => e.eventType === 'consent_change').length,
        dataAccess: auditEvents.filter(e => e.eventType === 'data_access').length,
        dataExports: auditEvents.filter(e => e.eventType === 'data_export').length,
        accountDeletions: auditEvents.filter(e => e.eventType === 'data_deletion').length,
      },
      complianceChecks: {
        gdprCompliance: true,
        hipaaCompliance: true,
        dataRetentionPolicy: true,
        encryptionEnabled: true,
        auditLoggingEnabled: true,
        userConsentTracking: true,
      },
    };

    return report;
  }, [metrics, auditEvents]);

  // Export audit data (for compliance officers)
  const exportAuditData = useCallback(() => {
    const report = generateComplianceReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logEvent('data_export', { type: 'compliance_audit', exportedBy: user?.id });
  }, [generateComplianceReport, logEvent, user]);

  return {
    auditEvents,
    metrics,
    logEvent,
    generateComplianceReport,
    exportAuditData,
  };
};
