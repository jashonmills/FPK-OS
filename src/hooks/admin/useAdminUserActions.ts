import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { UserRole, AccountStatus } from "@/types/admin/users";

export const useAdminUserActions = () => {
  const queryClient = useQueryClient();

  const suspendUser = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-update-user-status", {
        body: { userId, newStatus: "suspended", reason },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail"] });
      toast({
        title: "User Suspended",
        description: "The user account has been suspended successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to suspend user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const activateUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("admin-update-user-status", {
        body: { userId, newStatus: "active" },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail"] });
      toast({
        title: "User Activated",
        description: "The user account has been activated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to activate user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase.functions.invoke("admin-manage-roles", {
        body: { userId, action: "add", role },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail"] });
      toast({
        title: "Role Added",
        description: "The role has been added to the user successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add role: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase.functions.invoke("admin-manage-roles", {
        body: { userId, action: "remove", role },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail"] });
      toast({
        title: "Role Removed",
        description: "The role has been removed from the user successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove role: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ userId, email }: { userId: string; email: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-reset-password", {
        body: { userId, email },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Sent",
        description: "A password reset email has been sent to the user.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send password reset: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    suspendUser,
    activateUser,
    addRole,
    removeRole,
    resetPassword,
  };
};
