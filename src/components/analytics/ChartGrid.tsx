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
      {/* Dense Grid layout with centerpiece */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* First 2 charts */}
        {chartsForTab.slice(0, 2).map((chart) => (
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

        {/* Centerpiece Video - takes 2 columns on large screens */}
        <div className="lg:col-span-2 flex items-center justify-center p-4">
          <video
            src={tabConfig.centerpieceVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[400px] h-auto aspect-square centerpiece-video object-cover rounded-xl"
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
