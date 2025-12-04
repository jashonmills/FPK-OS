import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { isAdmin: false, isSuperAdmin: false };
      }

      const { data: hasAdminRole, error: adminError } = await supabase.rpc(
        "has_role",
        { _user_id: user.id, _role: "admin" }
      );

      const { data: hasSuperAdminRole, error: superAdminError } = await supabase.rpc(
        "has_super_admin_role",
        { _user_id: user.id }
      );

      if (adminError || superAdminError) {
        console.error("Error checking admin status:", adminError || superAdminError);
        return { isAdmin: false, isSuperAdmin: false };
      }

      return {
        isAdmin: hasAdminRole || hasSuperAdminRole,
        isSuperAdmin: hasSuperAdminRole
      };
    },
  });
};
