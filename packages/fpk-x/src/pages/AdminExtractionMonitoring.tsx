import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExtractionMonitoringDashboard } from "@/components/admin/ExtractionMonitoringDashboard";
import { Navigate } from "react-router-dom";

export default function AdminExtractionMonitoring() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Check if user is super admin
  const { data: isSuperAdmin, isLoading } = useQuery({
    queryKey: ["is-super-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .rpc('has_super_admin_role', { _user_id: user.id });
      
      return data || false;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return <Navigate to="/documents" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ExtractionMonitoringDashboard />
    </div>
  );
}