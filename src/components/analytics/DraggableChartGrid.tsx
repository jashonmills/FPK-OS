import { useState } from "react";
import { SmartChartWidget } from "./SmartChartWidget";
import { getChartsForTab } from "@/config/chartManifest";
import { useConstellationLayout } from "@/hooks/useConstellationLayout";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface DraggableChartGridProps {
  tabId: string;
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  unlockedCharts: string[];
  subscriptionTier: string;
  studentName?: string;
  isSuperAdmin?: boolean;
}

export const DraggableChartGrid = ({
  tabId,
  familyId,
  studentId,
  dateRange,
  unlockedCharts,
  subscriptionTier,
  studentName,
  isSuperAdmin = false
}: DraggableChartGridProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const chartsForTab = getChartsForTab(tabId);
  const layoutPositions = useConstellationLayout(chartsForTab.length);

  return (
    <div className="relative h-full">
      {/* Edit Mode Toggle - Coming Soon */}
      <div className="absolute top-2 right-2 z-30">
        <Button
          size="sm"
          variant="outline"
          className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 opacity-50 cursor-not-allowed"
          disabled
          title="Drag-and-drop customization coming soon!"
        >
          <GripVertical className="h-4 w-4 mr-1" />
          Edit Layout (Soon)
        </Button>
      </div>

      <div 
        className="h-full grid" 
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          gap: '0.25rem',
          padding: '0.75rem'
        }}
      >
        {chartsForTab.map((chart, index) => {
          const position = layoutPositions[index];
          if (!position) return null;

          return (
            <div 
              key={chart.chartId}
              style={{ 
                gridColumn: position.gridColumn, 
                gridRow: position.gridRow 
              }}
            >
              <SmartChartWidget
                config={chart}
                familyId={familyId}
                studentId={studentId}
                dateRange={dateRange}
                unlockedCharts={unlockedCharts}
                subscriptionTier={subscriptionTier}
                studentName={studentName}
                isSuperAdmin={isSuperAdmin}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};