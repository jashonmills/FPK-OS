import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, Trash2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RetentionPolicy {
  id: string;
  table_name: string;
  retention_period_days: number;
  legal_basis: string;
  is_active: boolean;
}

export function DataRetentionNotice() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRetentionPolicies();
    }
  }, [user]);

  const loadRetentionPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('data_retention_policies')
        .select('*')
        .eq('is_active', true)
        .order('table_name');

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error loading retention policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRetentionPeriod = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  };

  const getTableDisplayName = (tableName: string) => {
    const displayNames: Record<string, string> = {
      profiles: 'User Profiles',
      chat_sessions: 'Chat History',
      audit_log: 'Security Audit Logs',
      user_consent: 'Consent Records',
      goals: 'Learning Goals',
      flashcards: 'Flashcards',
      daily_activities: 'Activity Data',
      study_sessions: 'Study Sessions',
      analytics_metrics: 'Analytics Data'
    };
    return displayNames[tableName] || tableName;
  };

  const getLegalBasisColor = (basis: string) => {
    const colors: Record<string, string> = {
      contract: 'bg-blue-100 text-blue-800',
      legitimate_interest: 'bg-green-100 text-green-800',
      legal_obligation: 'bg-purple-100 text-purple-800',
      consent: 'bg-orange-100 text-orange-800'
    };
    return colors[basis] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Data Retention Information
        </CardTitle>
        <CardDescription>
          How long we keep your data and why. We automatically delete data when retention periods expire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{getTableDisplayName(policy.table_name)}</p>
                  <p className="text-sm text-muted-foreground">
                    Retained for {formatRetentionPeriod(policy.retention_period_days)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getLegalBasisColor(policy.legal_basis)}
                >
                  {policy.legal_basis.replace('_', ' ')}
                </Badge>
                <Shield className="h-4 w-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Your Rights
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Data is automatically deleted when retention periods expire</li>
            <li>• You can request immediate deletion of your data (right to erasure)</li>
            <li>• Audit logs are kept for legal compliance and security purposes</li>
            <li>• Essential data may be retained longer for legal obligations</li>
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trash2 className="h-3 w-3" />
          <span>Last automated cleanup: {new Date().toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}