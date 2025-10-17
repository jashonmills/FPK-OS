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

  // Define mosaic layout patterns based on number of charts
  const renderMosaicLayout = () => {
    const chartCount = chartsForTab.length;

    return (
      <div className="h-full grid gap-2" style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)'
      }}>
        {/* First chart - larger, spans 2x2 */}
        {chartsForTab[0] && (
          <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
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
          </div>
        )}

        {/* Centerpiece Video - top right, spans 2x1 */}
        <div style={{ gridColumn: '3 / 5', gridRow: '1 / 2' }} className="flex items-center justify-center p-2">
          <video
            src={tabConfig.centerpieceVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full centerpiece-video object-cover rounded-lg"
          />
        </div>

        {/* Second & Third charts - right side, middle */}
        {chartsForTab[1] && (
          <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
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
          </div>
        )}

        {chartsForTab[2] && (
          <div style={{ gridColumn: '4 / 5', gridRow: '2 / 3' }}>
            <SmartChartWidget
              key={chartsForTab[2].chartId}
              config={chartsForTab[2]}
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              unlockedCharts={unlockedCharts}
              subscriptionTier={subscriptionTier}
              studentName={studentName}
            />
          </div>
        )}

        {/* Bottom row - 4 equal charts */}
        {chartsForTab.slice(3, 7).map((chart, idx) => (
          <div 
            key={chart.chartId}
            style={{ 
              gridColumn: `${idx + 1} / ${idx + 2}`, 
              gridRow: '3 / 4' 
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
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderMosaicLayout()}
    </div>
  );
};
