import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Download,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ComplianceMetrics {
  totalUsers: number;
  activeConsents: number;
  withdrawnConsents: number;
  pendingRequests: number;
  completedRequests: number;
  overdue: number;
  recentBreaches: number;
}

interface DataSubjectRequest {
  id: string;
  request_type: string;
  status: string;
  description: string;
  due_date: string;
  created_at: string;
  user_id: string;
}

export function ComplianceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    totalUsers: 0,
    activeConsents: 0,
    withdrawnConsents: 0,
    pendingRequests: 0,
    completedRequests: 0,
    overdue: 0,
    recentBreaches: 0
  });
  const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      // Load compliance metrics
      const [
        { count: totalUsers },
        { count: activeConsents },
        { count: withdrawnConsents },
        { count: pendingRequests },
        { count: completedRequests },
        { count: overdueRequests },
        { count: recentBreaches },
        { data: requestsData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_consent').select('*', { count: 'exact', head: true }).eq('is_granted', true).is('withdrawn_at', null),
        supabase.from('user_consent').select('*', { count: 'exact', head: true }).not('withdrawn_at', 'is', null),
        supabase.from('data_subject_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('data_subject_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('data_subject_requests').select('*', { count: 'exact', head: true }).lt('due_date', new Date().toISOString()).neq('status', 'completed'),
        supabase.from('data_breach_incidents').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('data_subject_requests').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      setMetrics({
        totalUsers: totalUsers || 0,
        activeConsents: activeConsents || 0,
        withdrawnConsents: withdrawnConsents || 0,
        pendingRequests: pendingRequests || 0,
        completedRequests: completedRequests || 0,
        overdue: overdueRequests || 0,
        recentBreaches: recentBreaches || 0
      });

      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load compliance dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runDataCleanup = async () => {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_data');
      
      if (error) throw error;

      toast({
        title: "Data cleanup completed",
        description: `Cleaned up data from ${data?.length || 0} tables.`,
      });

      loadComplianceData(); // Refresh metrics
    } catch (error) {
      console.error('Error running cleanup:', error);
      toast({
        title: "Cleanup failed",
        description: "Failed to run data cleanup.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <FileText className="h-4 w-4" />;
      case 'erasure': return <Trash2 className="h-4 w-4" />;
      case 'portability': return <Download className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
          <p className="text-muted-foreground">Monitor GDPR compliance and data governance</p>
        </div>
        <Button onClick={runDataCleanup} variant="outline">
          <Database className="mr-2 h-4 w-4" />
          Run Data Cleanup
        </Button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Consents</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConsents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.withdrawnConsents} withdrawn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.overdue} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${metrics.recentBreaches > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentBreaches}</div>
            <p className="text-xs text-muted-foreground">Breaches (30 days)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Data Subject Requests</TabsTrigger>
          <TabsTrigger value="processing">Processing Activities</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Data Subject Requests</CardTitle>
              <CardDescription>
                GDPR requests from users (Articles 15-22)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent requests</p>
                ) : (
                  requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getRequestTypeIcon(request.request_type)}
                        <div>
                          <p className="font-medium">{request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)} Request</p>
                          <p className="text-sm text-muted-foreground">{request.description || 'No description'}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(request.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Processing Activities</CardTitle>
              <CardDescription>
                Legal basis documentation (GDPR Article 30)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Processing activities management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>
                Automated data cleanup and retention management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Retention policy management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}