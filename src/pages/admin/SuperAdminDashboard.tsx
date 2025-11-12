import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/admin/useIsAdmin";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Building2, 
  FileText, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Database,
  Upload
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SuperAdminDashboard() {
  const { data: adminStatus, isLoading: isCheckingAdmin } = useIsAdmin();

  // Fetch system health metrics
  const { data: healthMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["system-health-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!adminStatus?.isSuperAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent error logs
  const { data: errorLogs, isLoading: isLoadingErrors } = useQuery({
    queryKey: ["system-error-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_error_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Fetch user profiles separately for matched user_ids
      const userIds = data.map(log => log.user_id).filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, full_name')
        .in('id', userIds);
      
      // Merge profiles with logs
      const logsWithProfiles = data.map(log => ({
        ...log,
        profile: profiles?.find(p => p.id === log.user_id) || null
      }));
      
      return logsWithProfiles;
    },
    enabled: !!adminStatus?.isSuperAdmin,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch upload failure statistics
  const { data: uploadStats } = useQuery({
    queryKey: ["upload-failure-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_error_log')
        .select('error_type, context_data')
        .eq('error_type', 'document_upload_failure')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      // Aggregate by file type
      const byFileType: Record<string, number> = {};
      data.forEach(log => {
        const contextData = log.context_data as Record<string, any> || {};
        const fileType = contextData.fileType || 'unknown';
        byFileType[fileType] = (byFileType[fileType] || 0) + 1;
      });
      
      return { total: data.length, byFileType };
    },
    enabled: !!adminStatus?.isSuperAdmin,
  });

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!adminStatus?.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System-wide metrics and platform health monitoring
        </p>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{healthMetrics?.new_users_30d || 0} this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.active_users_24h || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.active_organizations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  of {healthMetrics?.total_organizations || 0} total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.errors_24h || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document & Storage Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.total_documents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{healthMetrics?.documents_uploaded_24h || 0} today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {((healthMetrics?.total_storage_kb || 0) / 1024 / 1024).toFixed(2)} GB
                </div>
                <p className="text-xs text-muted-foreground">
                  Total storage
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload Failures</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{healthMetrics?.upload_failures_24h || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Logs Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Errors</TabsTrigger>
          <TabsTrigger value="uploads">Upload Failures</TabsTrigger>
          <TabsTrigger value="404">404 Errors</TabsTrigger>
          <TabsTrigger value="api">API Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Errors</CardTitle>
              <CardDescription>
                Last 50 errors across all types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingErrors ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : errorLogs && errorLogs.length > 0 ? (
                <div className="space-y-3">
                  {errorLogs.map((log: any) => {
                    const contextData = log.context_data as Record<string, any> || {};
                    return (
                    <Alert key={log.id} variant={log.error_type === 'document_upload_failure' ? 'destructive' : 'default'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="font-semibold">{log.user_action}</div>
                            <div className="text-sm">{log.error_message}</div>
                            {contextData && Object.keys(contextData).length > 0 && (
                              <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                                {log.error_type === 'document_upload_failure' && (
                                  <>
                                    <div>File: {contextData.fileName}</div>
                                    <div>Size: {((contextData.fileSize || 0) / 1024).toFixed(2)} KB</div>
                                    <div>Type: {contextData.fileType}</div>
                                  </>
                                )}
                                {log.error_type === 'page_not_found' && (
                                  <div>Route: {contextData.route}</div>
                                )}
                                {log.error_type === 'api_error' && (
                                  <div>Endpoint: {contextData.apiEndpoint}</div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            <div>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</div>
                            <div className="mt-1">
                              {log.profile?.display_name || log.profile?.full_name || 'Unknown user'}
                            </div>
                            {log.error_code && (
                              <div className="mt-1 font-semibold">Code: {log.error_code}</div>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No errors logged yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload Failures</CardTitle>
              <CardDescription>
                Detailed view of failed document uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadStats && (
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="font-semibold mb-2">Last 7 Days Summary</div>
                  <div className="text-2xl font-bold mb-2">{uploadStats.total} failures</div>
                  <div className="text-sm space-y-1">
                    <div className="font-medium">By File Type:</div>
                    {Object.entries(uploadStats.byFileType).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span>{type}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {errorLogs?.filter((log: any) => log.error_type === 'document_upload_failure').map((log: any) => {
                  const contextData = log.context_data as Record<string, any> || {};
                  return (
                  <Alert key={log.id} variant="destructive">
                    <Upload className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">Upload Failed</div>
                          <div className="text-sm">{log.error_message}</div>
                          <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                            <div>File: {contextData.fileName}</div>
                            <div>Size: {((contextData.fileSize || 0) / 1024).toFixed(2)} KB</div>
                            <div>Type: {contextData.fileType}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          <div>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</div>
                          <div className="mt-1">
                            {log.profile?.display_name || log.profile?.full_name || 'Unknown user'}
                          </div>
                          {log.error_code && (
                            <div className="mt-1 font-semibold">Code: {log.error_code}</div>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="404" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>404 Not Found Errors</CardTitle>
              <CardDescription>
                Pages users tried to access but don't exist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs?.filter((log: any) => log.error_type === 'page_not_found').map((log: any) => {
                  const contextData = log.context_data as Record<string, any> || {};
                  return (
                  <Alert key={log.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">Page Not Found</div>
                          <div className="text-sm">Route: {contextData.route}</div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          <div>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</div>
                          <div className="mt-1">
                            {log.profile?.display_name || log.profile?.full_name || 'Unknown user'}
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Errors</CardTitle>
              <CardDescription>
                Failed API requests and backend errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs?.filter((log: any) => log.error_type === 'api_error').map((log: any) => {
                  const contextData = log.context_data as Record<string, any> || {};
                  return (
                  <Alert key={log.id} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">API Error</div>
                          <div className="text-sm">{log.error_message}</div>
                          {contextData.apiEndpoint && (
                            <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                              Endpoint: {contextData.apiEndpoint}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          <div>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</div>
                          <div className="mt-1">
                            {log.profile?.display_name || log.profile?.full_name || 'Unknown user'}
                          </div>
                          {log.error_code && (
                            <div className="mt-1 font-semibold">Code: {log.error_code}</div>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
