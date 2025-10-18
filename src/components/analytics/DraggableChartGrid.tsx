import { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { SmartChartWidget } from "./SmartChartWidget";

const GridLayout = WidthProvider(RGL);
import { getChartsForTab } from "@/config/chartManifest";
import { useConstellationLayout } from "@/hooks/useConstellationLayout";
import { useChartLayout } from "@/hooks/useChartLayout";
import { Button } from "@/components/ui/button";
import { GripVertical, Save, RotateCcw } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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
  const defaultPositions = useConstellationLayout(chartsForTab.length);
  
  const {
    layout,
    isLoading,
    hasChanges,
    handleLayoutChange,
    saveLayout,
    resetLayout,
    isSaving
  } = useChartLayout(
    familyId,
    studentId,
    tabId,
    chartsForTab.length,
    defaultPositions
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-cyan-400 text-sm">Loading layout...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Edit Mode Controls */}
      <div className="absolute top-2 right-2 z-30 flex gap-2">
        {isEditMode && hasChanges && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              onClick={resetLayout}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
              onClick={saveLayout}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save Layout"}
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="outline"
          className={`border-cyan-500/30 hover:bg-cyan-500/20 transition-all ${
            isEditMode 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' 
              : 'bg-cyan-500/10 text-cyan-400'
          }`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <GripVertical className="h-4 w-4 mr-1" />
          {isEditMode ? "Done Editing" : "Edit Layout"}
        </Button>
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={48}
        rowHeight={30}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={handleLayoutChange}
        compactType="vertical"
        preventCollision={false}
        margin={[4, 4]}
        containerPadding={[12, 12]}
        useCSSTransforms={true}
        style={{
          minHeight: '100%',
          position: 'relative'
        }}
      >
        {chartsForTab.map((chart, index) => (
          <div 
            key={layout[index]?.i || `chart-${tabId}-${index}`}
            className={`transition-all ${isEditMode ? 'cursor-move' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column'
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
        ))}
      </GridLayout>
    </div>
  );
};