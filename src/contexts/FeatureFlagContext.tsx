import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface FeatureFlag {
  flag_name: string;
  is_enabled: boolean;
  description: string | null;
}

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  loading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  flags: {},
  loading: true,
  refreshFlags: async () => {},
});

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  }
  return context;
};

export const FeatureFlagProvider = ({ children }: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFlags = async () => {
    try {
      // First, fetch global feature flags
      const { data: globalFlags, error: globalError } = await supabase
        .from("feature_flags")
        .select("flag_name, is_enabled, description");

      if (globalError) throw globalError;

      // Then fetch user-specific overrides if user is logged in
      let userOverrides: Record<string, boolean> = {};
      if (user) {
        const { data: userFlags, error: userError } = await supabase
          .from("user_feature_flags")
          .select("flag_name, is_enabled")
          .eq("user_id", user.id);

        if (userError) throw userError;

        // Convert user flags to a lookup object
        userOverrides = (userFlags || []).reduce((acc, flag) => {
          acc[flag.flag_name] = flag.is_enabled;
          return acc;
        }, {} as Record<string, boolean>);
      }

      // Merge global flags with user overrides (user overrides take precedence)
      const mergedFlags = (globalFlags || []).reduce((acc, flag) => {
        acc[flag.flag_name] = userOverrides[flag.flag_name] ?? flag.is_enabled;
        return acc;
      }, {} as Record<string, boolean>);

      setFlags(mergedFlags);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();

    // Subscribe to feature flag changes
    const channel = supabase
      .channel("feature_flags_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feature_flags",
        },
        () => {
          fetchFlags();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_feature_flags",
        },
        () => {
          fetchFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <FeatureFlagContext.Provider value={{ flags, loading, refreshFlags: fetchFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
