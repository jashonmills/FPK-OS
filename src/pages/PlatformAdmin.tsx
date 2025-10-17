import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { CleanupDuplicateStudentsButton } from "@/components/admin/CleanupDuplicateStudentsButton";

interface FeatureFlag {
  id: string;
  flag_key: string;
  flag_name: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  created_at: string;
  updated_at: string;
}

const PlatformAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Check super admin status
  const { data: isSuperAdmin, isLoading: checkingAdmin, error: adminError } = useQuery({
    queryKey: ["is-super-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_super_admin_role", {
        _user_id: user.id,
      });
      if (error) {
        console.error("Super admin check error:", error);
        throw error;
      }
      console.log("Super admin check result:", data);
      return data;
    },
    enabled: !!user?.id,
    retry: 2,
    staleTime: 0, // Don't cache this check
  });

  // Redirect if not super admin
  useEffect(() => {
    if (!checkingAdmin && isSuperAdmin === false) {
      console.log("Access denied - not super admin");
      toast.error("Access denied: Super admin only");
      navigate("/dashboard");
    }
  }, [isSuperAdmin, checkingAdmin, navigate]);

  // Fetch all feature flags
  const { data: flags, isLoading: loadingFlags } = useQuery({
    queryKey: ["platform-admin-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("*")
        .order("flag_key");
      if (error) throw error;
      return data as FeatureFlag[];
    },
    enabled: isSuperAdmin,
  });

  // Update flag mutation
  const updateFlagMutation = useMutation({
    mutationFn: async (flag: Partial<FeatureFlag> & { id: string }) => {
      const { error } = await supabase
        .from("feature_flags")
        .update({
          is_enabled: flag.is_enabled,
          rollout_percentage: flag.rollout_percentage,
          target_users: flag.target_users,
          flag_name: flag.flag_name,
          description: flag.description,
        })
        .eq("id", flag.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-admin-flags"] });
      toast.success("Feature flag updated");
      setEditingFlag(null);
    },
    onError: (error) => {
      toast.error("Failed to update flag: " + error.message);
    },
  });

  // Create flag mutation
  const createFlagMutation = useMutation({
    mutationFn: async (flag: Omit<FeatureFlag, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("feature_flags").insert([flag]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-admin-flags"] });
      toast.success("Feature flag created");
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create flag: " + error.message);
    },
  });

  // Delete flag mutation
  const deleteFlagMutation = useMutation({
    mutationFn: async (flagId: string) => {
      const { error } = await supabase.from("feature_flags").delete().eq("id", flagId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-admin-flags"] });
      toast.success("Feature flag deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete flag: " + error.message);
    },
  });

  if (checkingAdmin || !isSuperAdmin) {
    return null;
  }

  const activeFlags = flags?.filter((f) => f.is_enabled).length || 0;
  const totalFlags = flags?.length || 0;

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto py-6 px-3 sm:px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Platform Admin
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Manage feature flags and system configuration
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Flag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Feature Flag</DialogTitle>
                <DialogDescription>Add a new feature flag to the system</DialogDescription>
              </DialogHeader>
              <FlagForm
                onSubmit={(data) => createFlagMutation.mutate(data)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Cleanup Tools */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Cleanup Tools</CardTitle>
            <CardDescription>
              Administrative tools for cleaning up duplicate or test data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CleanupDuplicateStudentsButton />
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlags}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeFlags}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Inactive Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {totalFlags - activeFlags}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>
              Control feature availability and rollout percentages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFlags ? (
              <p className="text-center py-8 text-muted-foreground">Loading flags...</p>
            ) : flags && flags.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flag Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rollout %</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="font-mono text-sm">{flag.flag_key}</TableCell>
                      <TableCell>{flag.flag_name}</TableCell>
                      <TableCell>
                        <Badge variant={flag.is_enabled ? "default" : "secondary"}>
                          {flag.is_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>{flag.rollout_percentage}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingFlag(flag)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Feature Flag</DialogTitle>
                                <DialogDescription>
                                  Update flag settings and rollout configuration
                                </DialogDescription>
                              </DialogHeader>
                              {editingFlag && (
                                <FlagForm
                                  initialData={editingFlag}
                                  onSubmit={(data) =>
                                    updateFlagMutation.mutate({
                                      ...data,
                                      id: editingFlag.id,
                                    })
                                  }
                                  onCancel={() => setEditingFlag(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete "${flag.flag_name}"?`
                                )
                              ) {
                                deleteFlagMutation.mutate(flag.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No feature flags found. Create one to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

// Flag Form Component
interface FlagFormProps {
  initialData?: FeatureFlag;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FlagForm = ({ initialData, onSubmit, onCancel }: FlagFormProps) => {
  const [formData, setFormData] = useState({
    flag_key: initialData?.flag_key || "",
    flag_name: initialData?.flag_name || "",
    description: initialData?.description || "",
    is_enabled: initialData?.is_enabled ?? false,
    rollout_percentage: initialData?.rollout_percentage ?? 100,
    target_users: initialData?.target_users || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flag_key">Flag Key</Label>
        <Input
          id="flag_key"
          value={formData.flag_key}
          onChange={(e) => setFormData({ ...formData, flag_key: e.target.value })}
          placeholder="enable-new-feature"
          required
          disabled={!!initialData}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="flag_name">Flag Name</Label>
        <Input
          id="flag_name"
          value={formData.flag_name}
          onChange={(e) => setFormData({ ...formData, flag_name: e.target.value })}
          placeholder="New Feature"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What does this feature do?"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_enabled">Enable Flag</Label>
        <Switch
          id="is_enabled"
          checked={formData.is_enabled}
          onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rollout_percentage">
          Rollout Percentage: {formData.rollout_percentage}%
        </Label>
        <Slider
          id="rollout_percentage"
          value={[formData.rollout_percentage]}
          onValueChange={([value]) =>
            setFormData({ ...formData, rollout_percentage: value })
          }
          max={100}
          step={5}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Flag</Button>
      </div>
    </form>
  );
};

export default PlatformAdmin;
