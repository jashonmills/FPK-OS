import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/admin/useIsAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MigrationDashboard } from "@/components/admin/MigrationDashboard";
import { BedrockHealthMonitor } from "@/components/admin/BedrockHealthMonitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Database,
  TrendingUp,
  XCircle
} from "lucide-react";

export default function SuperAdminDashboard() {
  const { data: adminStatus, isLoading: isCheckingAdmin } = useIsAdmin();

  // Fetch Bedrock document stats
  const { data: bedrockStats } = useQuery({
    queryKey: ["bedrock-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bedrock_documents")
        .select("id, status, created_at")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (error) {
        console.error("Error fetching bedrock stats:", error);
        return null;
      }

      const total = data?.length || 0;
      const completed = data?.filter(d => d.status === 'completed').length || 0;
      const failed = data?.filter(d => d.status === 'failed').length || 0;
      const processing = data?.filter(d => d.status === 'processing').length || 0;
      
      return { total, completed, failed, processing };
    },
    refetchInterval: 30000,
  });

  // Fetch total document count (legacy + Bedrock)
  const { data: totalDocCount } = useQuery({
    queryKey: ["total-documents"],
    queryFn: async () => {
      const [legacyRes, bedrockRes] = await Promise.all([
        supabase.from("documents").select("id", { count: 'exact', head: true }),
        supabase.from("bedrock_documents").select("id", { count: 'exact', head: true })
      ]);
      
      return (legacyRes.count || 0) + (bedrockRes.count || 0);
    },
    refetchInterval: 30000,
  });

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!adminStatus?.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            System-wide monitoring and administration
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="migration">Migration Status</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDocCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Legacy + Bedrock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bedrock Documents</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bedrockStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{bedrockStats?.completed || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{bedrockStats?.failed || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Processing errors</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <MigrationDashboard />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <BedrockHealthMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
