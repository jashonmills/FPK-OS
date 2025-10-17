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

  // Define mosaic layout patterns - no centerpiece video, more space for charts
  const renderMosaicLayout = () => {
    return (
      <div className="h-full grid" style={{
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        gap: '0.5rem'
      }}>
        {/* First chart - larger, spans 6x4 */}
        {chartsForTab[0] && (
          <div style={{ gridColumn: '1 / 7', gridRow: '1 / 5' }} className="relative">
            <h3 className="absolute top-3 left-3 z-10 text-[10px] font-bold text-cyan-400/90">{chartsForTab[0].title}</h3>
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

        {/* Second chart - top right, spans 6x4 */}
        {chartsForTab[1] && (
          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 5' }} className="relative">
            <h3 className="absolute top-3 left-3 z-10 text-[10px] font-bold text-cyan-400/90">{chartsForTab[1].title}</h3>
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

        {/* Third chart - bottom left, spans 4x4 */}
        {chartsForTab[2] && (
          <div style={{ gridColumn: '1 / 5', gridRow: '5 / 9' }} className="relative">
            <h3 className="absolute top-3 left-3 z-10 text-[10px] font-bold text-cyan-400/90">{chartsForTab[2].title}</h3>
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

        {/* Fourth chart - bottom middle, spans 4x4 */}
        {chartsForTab[3] && (
          <div style={{ gridColumn: '5 / 9', gridRow: '5 / 9' }} className="relative">
            <h3 className="absolute top-3 left-3 z-10 text-[10px] font-bold text-cyan-400/90">{chartsForTab[3].title}</h3>
            <SmartChartWidget
              key={chartsForTab[3].chartId}
              config={chartsForTab[3]}
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              unlockedCharts={unlockedCharts}
              subscriptionTier={subscriptionTier}
              studentName={studentName}
            />
          </div>
        )}

        {/* Fifth chart - bottom right, spans 4x4 */}
        {chartsForTab[4] && (
          <div style={{ gridColumn: '9 / 13', gridRow: '5 / 9' }} className="relative">
            <h3 className="absolute top-3 left-3 z-10 text-[10px] font-bold text-cyan-400/90">{chartsForTab[4].title}</h3>
            <SmartChartWidget
              key={chartsForTab[4].chartId}
              config={chartsForTab[4]}
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              unlockedCharts={unlockedCharts}
              subscriptionTier={subscriptionTier}
              studentName={studentName}
            />
          </div>
        )}

        {/* Additional charts if needed - hidden for now to maintain clean 5-chart layout */}
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderMosaicLayout()}
    </div>
  );
};
