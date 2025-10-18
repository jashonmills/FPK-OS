import { useState, useEffect } from "react";
import { Layout } from "react-grid-layout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GridPosition {
  gridColumn: string;
  gridRow: string;
}

/**
 * Hook to manage chart layout persistence
 * Converts between CSS Grid positions and React Grid Layout format
 */
export const useChartLayout = (
  familyId: string,
  studentId: string,
  tabId: string,
  chartCount: number,
  defaultPositions: GridPosition[]
) => {
  const queryClient = useQueryClient();
  const [layout, setLayout] = useState<Layout[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch saved layout from database
  const { data: savedLayout, isLoading } = useQuery({
    queryKey: ["chart-layout", familyId, studentId, tabId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_chart_layout", {
        p_family_id: familyId,
        p_student_id: studentId || null,
        p_tab_id: tabId,
      });

      if (error) throw error;
      // Parse JSONB data to Layout[] type
      return data ? (JSON.parse(JSON.stringify(data)) as Layout[]) : null;
    },
    enabled: !!familyId && !!tabId,
  });

  // Save layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: async (newLayout: Layout[]) => {
      // Convert Layout[] to JSONB-compatible format
      const { error } = await supabase.rpc("save_chart_layout", {
        p_family_id: familyId,
        p_student_id: studentId || null,
        p_tab_id: tabId,
        p_layout: JSON.parse(JSON.stringify(newLayout)) as any,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart-layout", familyId, studentId, tabId] });
      toast.success("Chart layout saved successfully");
      setHasChanges(false);
    },
    onError: (error) => {
      console.error("Failed to save layout:", error);
      toast.error("Failed to save layout. Please try again.");
    },
  });

  // Convert CSS Grid positions to React Grid Layout format
  const convertToReactGridLayout = (positions: GridPosition[], chartIds: string[]): Layout[] => {
    return positions.map((pos, index) => {
      // Parse gridColumn: "1 / 13" -> start: 0, width: 12 (for 48-column grid)
      const [colStart, colEnd] = pos.gridColumn.split(" / ").map(Number);
      const w = colEnd - colStart;
      const x = colStart - 1; // Convert to 0-indexed

      // Parse gridRow: "1 / 4" -> start: 0, height: 3
      const [rowStart, rowEnd] = pos.gridRow.split(" / ").map(Number);
      const h = rowEnd - rowStart;
      const y = rowStart - 1;

      return {
        i: chartIds[index] || `chart-${index}`,
        x,
        y,
        w,
        h,
        minW: 8,  // Minimum 8 cols (was 2 for 12-col grid)
        minH: 2,
        maxW: 48, // Maximum 48 cols (full width)
        maxH: 4,
      };
    });
  };

  // Initialize layout from saved data or defaults
  useEffect(() => {
    if (!isLoading) {
      if (savedLayout && Array.isArray(savedLayout) && savedLayout.length > 0) {
        setLayout(savedLayout);
      } else {
        // Generate chart IDs based on the tab
        const chartIds = Array.from({ length: chartCount }, (_, i) => `chart-${tabId}-${i}`);
        const defaultLayout = convertToReactGridLayout(defaultPositions, chartIds);
        setLayout(defaultLayout);
      }
    }
  }, [savedLayout, isLoading, chartCount, tabId]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    setHasChanges(true);
  };

  const saveLayout = () => {
    saveLayoutMutation.mutate(layout);
  };

  const resetLayout = () => {
    const chartIds = Array.from({ length: chartCount }, (_, i) => `chart-${tabId}-${i}`);
    const defaultLayout = convertToReactGridLayout(defaultPositions, chartIds);
    setLayout(defaultLayout);
    saveLayoutMutation.mutate(defaultLayout);
  };

  return {
    layout,
    isLoading,
    hasChanges,
    handleLayoutChange,
    saveLayout,
    resetLayout,
    isSaving: saveLayoutMutation.isPending,
  };
};
