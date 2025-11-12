import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { IUserManagementView, IUserFilters, IUserSort } from "@/types/admin/users";

interface UseAdminUsersParams {
  filters?: IUserFilters;
  sort?: IUserSort;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface AdminUsersResponse {
  users: IUserManagementView[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const useAdminUsers = ({
  filters,
  sort,
  search,
  page = 1,
  pageSize = 25,
}: UseAdminUsersParams = {}) => {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin-users", filters, sort, search, page, pageSize],
    queryFn: async () => {
      const offset = (page - 1) * pageSize;
      
      const { data, error } = await supabase.rpc("get_comprehensive_user_data", {
        p_user_id: null,
        p_search: search || null,
        p_status_filter: filters?.status || null,
        p_role_filter: filters?.roles || null,
        p_date_after: filters?.dateCreatedAfter?.toISOString() || null,
        p_date_before: filters?.dateCreatedBefore?.toISOString() || null,
        p_limit: pageSize,
        p_offset: offset,
      });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      const users = (data || []).map((user: any) => ({
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        fullName: user.full_name,
        photoUrl: user.photo_url,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        accountStatus: user.account_status,
        roles: user.roles || [],
        families: typeof user.families === 'string' ? JSON.parse(user.families) : (user.families || []),
        engagementMetrics: typeof user.engagement_metrics === 'string' 
          ? JSON.parse(user.engagement_metrics) 
          : user.engagement_metrics,
        lastModifiedBy: user.last_modified_by,
        lastModifiedAt: user.last_modified_at,
      }));

      const totalCount = users.length > 0 ? Number(data[0].total_count) : 0;

      return {
        users,
        totalCount,
        page,
        pageSize,
      };
    },
  });
};
