import { SmartChartWidget } from "./SmartChartWidget";
import { getChartsForTab } from "@/config/chartManifest";
import { useConstellationLayout } from "@/hooks/useConstellationLayout";

interface ChartGridProps {
  tabId: string;
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  unlockedCharts: string[];
  subscriptionTier: string;
  studentName?: string;
}

export const ChartGrid = ({
  tabId,
  familyId,
  studentId,
  dateRange,
  unlockedCharts,
  subscriptionTier,
  studentName
}: ChartGridProps) => {
  const chartsForTab = getChartsForTab(tabId);
  const layoutPositions = useConstellationLayout(chartsForTab.length);

  return (
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
            />
          </div>
        );
      })}
    </div>
  );
};
