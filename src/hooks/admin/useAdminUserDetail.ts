import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { IUserManagementView } from "@/types/admin/users";

export const useAdminUserDetail = (userId: string | null) => {
  return useQuery<IUserManagementView | null>({
    queryKey: ["admin-user-detail", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase.rpc("get_comprehensive_user_data", {
        p_user_id: userId,
        p_search: null,
        p_status_filter: null,
        p_role_filter: null,
        p_date_after: null,
        p_date_before: null,
        p_limit: 1,
        p_offset: 0,
      });

      if (error) {
        console.error("Error fetching user detail:", error);
        throw error;
      }

      if (!data || data.length === 0) return null;

      const user = data[0];
      return {
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        fullName: user.full_name,
        photoUrl: user.photo_url,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        accountStatus: user.account_status as import("@/types/admin/users").AccountStatus,
        roles: (user.roles || []) as import("@/types/admin/users").UserRole[],
        families: typeof user.families === 'string' ? JSON.parse(user.families) : (user.families || []),
        engagementMetrics: typeof user.engagement_metrics === 'string' 
          ? JSON.parse(user.engagement_metrics) 
          : user.engagement_metrics,
        lastModifiedBy: user.last_modified_by,
        lastModifiedAt: user.last_modified_at,
      } as IUserManagementView;
    },
    enabled: !!userId,
  });
};
