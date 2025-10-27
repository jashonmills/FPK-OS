import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type AppRole = "admin" | "moderator" | "user";

interface UserRoleContextType {
  roles: AppRole[];
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

const UserRoleContext = createContext<UserRoleContextType>({
  roles: [],
  loading: true,
  hasRole: () => false,
  isAdmin: false,
  isModerator: false,
});

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export const UserRoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;

      const userRoles = (data || []).map((r) => r.role as AppRole);
      setRoles(userRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();

    // Subscribe to role changes
    const channel = supabase
      .channel("user_roles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_roles",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchRoles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const hasRole = (role: AppRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isModerator = hasRole("moderator");

  return (
    <UserRoleContext.Provider value={{ roles, loading, hasRole, isAdmin, isModerator }}>
      {children}
    </UserRoleContext.Provider>
  );
};
