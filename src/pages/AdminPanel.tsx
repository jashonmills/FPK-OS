import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Flag } from "lucide-react";
import { toast } from "sonner";

interface FeatureFlag {
  id: string;
  flag_name: string;
  is_enabled: boolean;
  description: string | null;
}

export default function AdminPanel() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { refreshFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!roleLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchFlags();
    }
  }, [isAdmin]);

  const fetchFlags = async () => {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("flag_name");

    if (error) {
      toast.error("Failed to load feature flags");
      console.error(error);
      return;
    }

    setFlags(data || []);
  };

  const toggleFlag = async (flagId: string, currentValue: boolean) => {
    setUpdating(flagId);
    
    const { error } = await supabase
      .from("feature_flags")
      .update({ is_enabled: !currentValue })
      .eq("id", flagId);

    if (error) {
      toast.error("Failed to update feature flag");
      console.error(error);
    } else {
      toast.success(`Feature ${!currentValue ? "enabled" : "disabled"}`);
      await fetchFlags();
      await refreshFlags(); // Refresh the global context
    }

    setUpdating(null);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="container max-w-4xl mx-auto p-6 space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              <CardTitle>Feature Flags</CardTitle>
            </div>
            <CardDescription>
              Control which features are enabled for all users. Changes take effect immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor={flag.flag_name}
                    className="text-base font-medium cursor-pointer"
                  >
                    {formatFlagName(flag.flag_name)}
                  </Label>
                  {flag.description && (
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  )}
                </div>
                <Switch
                  id={flag.flag_name}
                  checked={flag.is_enabled}
                  onCheckedChange={() => toggleFlag(flag.id, flag.is_enabled)}
                  disabled={updating === flag.id}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Feature Flags</CardTitle>
            <CardDescription>
              Feature flags allow you to enable or disable features without deploying new code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Changes take effect immediately for all users</p>
            <p>• User-specific overrides can be set in the database for beta testing</p>
            <p>• All flags are disabled by default for safety</p>
            <p>• Flags can be toggled on/off at any time without data loss</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatFlagName(flagName: string): string {
  return flagName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace("Enabled", "");
}
