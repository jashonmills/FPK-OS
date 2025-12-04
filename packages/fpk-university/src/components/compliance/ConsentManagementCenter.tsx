import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useConsent } from '@/hooks/useConsent';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

interface ConsentRecord {
  id: string;
  consent_type: string;
  is_granted: boolean;
  granted_at: string | null;
  withdrawn_at: string | null;
  legal_basis: string;
  purpose: string;
  created_at: string;
}

export function ConsentManagementCenter() {
  const { user } = useAuth();
  const { preferences, withdrawConsent, updateConsent } = useConsent();
  const { toast } = useToast();
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConsentHistory();
    }
  }, [user]);

  const loadConsentHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsentHistory(data || []);
    } catch (error) {
      console.error('Error loading consent history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (consentType: keyof typeof preferences) => {
    try {
      await withdrawConsent(consentType);
      await loadConsentHistory(); // Refresh history
      toast({
        title: "Consent withdrawn",
        description: `Your ${consentType} consent has been withdrawn and related data cleaned up.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw consent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getConsentIcon = (granted: boolean, withdrawn: boolean) => {
    if (withdrawn) return <X className="h-4 w-4 text-red-600" />;
    if (granted) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const getConsentStatus = (granted: boolean, withdrawn: boolean) => {
    if (withdrawn) return { label: 'Withdrawn', color: 'bg-red-100 text-red-800' };
    if (granted) return { label: 'Active', color: 'bg-green-100 text-green-800' };
    return { label: 'Denied', color: 'bg-yellow-100 text-yellow-800' };
  };

  const calculateComplianceScore = () => {
    const totalConsents = Object.keys(preferences).length;
    const activeConsents = Object.values(preferences).filter(Boolean).length;
    return Math.round((activeConsents / totalConsents) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const complianceScore = calculateComplianceScore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Consent Management Center</h2>
        <p className="text-muted-foreground">
          Manage your privacy preferences and view your consent history
        </p>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Compliance Overview
          </CardTitle>
          <CardDescription>
            Your current privacy settings and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consent Coverage</span>
              <span className="text-sm text-muted-foreground">{complianceScore}%</span>
            </div>
            <Progress value={complianceScore} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(preferences).map(([type, granted]) => (
              <div key={type} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {getConsentIcon(granted, false)}
                </div>
                <p className="text-xs font-medium capitalize">{type}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getConsentStatus(granted, false).color}`}
                >
                  {getConsentStatus(granted, false).label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Consent Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Consent Settings</CardTitle>
          <CardDescription>
            Manage your current privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences).map(([type, granted]) => (
            <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getConsentIcon(granted, false)}
                <div>
                  <p className="font-medium capitalize">{type} Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    {granted ? 'You have granted consent' : 'Consent not granted'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getConsentStatus(granted, false).color}>
                  {getConsentStatus(granted, false).label}
                </Badge>
                {granted && type !== 'essential' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleWithdraw(type as keyof typeof preferences)}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Consent History */}
      <Card>
        <CardHeader>
          <CardTitle>Consent History</CardTitle>
          <CardDescription>
            Complete audit trail of your consent decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consentHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No consent history available</p>
            ) : (
              consentHistory.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getConsentIcon(record.is_granted, !!record.withdrawn_at)}
                    <div>
                      <p className="font-medium capitalize">{record.consent_type} Consent</p>
                      <p className="text-sm text-muted-foreground">{record.purpose}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.withdrawn_at 
                          ? `Withdrawn: ${new Date(record.withdrawn_at).toLocaleString()}`
                          : `Granted: ${new Date(record.granted_at || record.created_at).toLocaleString()}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getConsentStatus(record.is_granted, !!record.withdrawn_at).color}>
                      {getConsentStatus(record.is_granted, !!record.withdrawn_at).label}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.legal_basis}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}