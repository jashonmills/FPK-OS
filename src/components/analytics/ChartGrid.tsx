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
    return (
      <div className="h-full grid" style={{
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        gap: 0
      }}>
        {/* First chart - larger, spans 4x4 */}
        {chartsForTab[0] && (
          <div style={{ gridColumn: '1 / 5', gridRow: '1 / 5' }} className="relative border-r border-b border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[0].title}</h3>
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

        {/* Centerpiece Video - center top, spans 4x3 */}
        <div style={{ gridColumn: '5 / 9', gridRow: '1 / 4' }} className="relative border-r border-b border-cyan-500/10 flex items-center justify-center p-4">
          <video
            src={tabConfig.centerpieceVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full centerpiece-video object-cover rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          />
        </div>

        {/* Second chart - top right, spans 4x3 */}
        {chartsForTab[1] && (
          <div style={{ gridColumn: '9 / 13', gridRow: '1 / 4' }} className="relative border-b border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[1].title}</h3>
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

        {/* Third chart - middle left, spans 4x4 */}
        {chartsForTab[2] && (
          <div style={{ gridColumn: '1 / 5', gridRow: '5 / 9' }} className="relative border-r border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[2].title}</h3>
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

        {/* Fourth & Fifth charts - middle row, spans 4x2 each */}
        {chartsForTab[3] && (
          <div style={{ gridColumn: '5 / 9', gridRow: '4 / 7' }} className="relative border-r border-b border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[3].title}</h3>
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

        {chartsForTab[4] && (
          <div style={{ gridColumn: '9 / 13', gridRow: '4 / 7' }} className="relative border-b border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[4].title}</h3>
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

        {/* Bottom row - 3 equal charts, spans 4x2 each */}
        {chartsForTab[5] && (
          <div style={{ gridColumn: '5 / 9', gridRow: '7 / 9' }} className="relative border-r border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[5].title}</h3>
            <SmartChartWidget
              key={chartsForTab[5].chartId}
              config={chartsForTab[5]}
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              unlockedCharts={unlockedCharts}
              subscriptionTier={subscriptionTier}
              studentName={studentName}
            />
          </div>
        )}

        {chartsForTab[6] && (
          <div style={{ gridColumn: '9 / 13', gridRow: '7 / 9' }} className="relative border-cyan-500/10">
            <h3 className="absolute top-2 left-2 z-10 text-[10px] font-bold text-cyan-400/80">{chartsForTab[6].title}</h3>
            <SmartChartWidget
              key={chartsForTab[6].chartId}
              config={chartsForTab[6]}
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              unlockedCharts={unlockedCharts}
              subscriptionTier={subscriptionTier}
              studentName={studentName}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderMosaicLayout()}
    </div>
  );
};
