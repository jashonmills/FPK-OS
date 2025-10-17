import { SmartChartWidget } from "./SmartChartWidget";
import { getChartsForTab } from "@/config/chartManifest";
import { TAB_MANIFEST } from "@/config/tabManifest";

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
  const tabConfig = TAB_MANIFEST[tabId];

  return (
    <div className="relative">
      {/* Grid layout with centerpiece */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First chart */}
        {chartsForTab[0] && (
          <SmartChartWidget
            key={chartsForTab[0].chartId}
            config={chartsForTab[0]}
            familyId={familyId}
            studentId={studentId}
            dateRange={dateRange}
            unlockedCharts={unlockedCharts}
            subscriptionTier={subscriptionTier}
            studentName={studentName}
          />
        )}

        {/* Second chart */}
        {chartsForTab[1] && (
          <SmartChartWidget
            key={chartsForTab[1].chartId}
            config={chartsForTab[1]}
            familyId={familyId}
            studentId={studentId}
            dateRange={dateRange}
            unlockedCharts={unlockedCharts}
            subscriptionTier={subscriptionTier}
            studentName={studentName}
          />
        )}

        {/* Centerpiece Video */}
        <div className="flex items-center justify-center">
          <video
            src={tabConfig.centerpieceVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-[400px] h-[400px] centerpiece-video object-cover"
          />
        </div>

        {/* Remaining charts */}
        {chartsForTab.slice(2).map((chart) => (
          <SmartChartWidget
            key={chart.chartId}
            config={chart}
            familyId={familyId}
            studentId={studentId}
            dateRange={dateRange}
            unlockedCharts={unlockedCharts}
            subscriptionTier={subscriptionTier}
            studentName={studentName}
          />
        ))}
      </div>
    </div>
  );
};
