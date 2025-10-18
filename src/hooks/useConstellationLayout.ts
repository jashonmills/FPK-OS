/**
 * Dynamic Constellation Layout Engine
 * Generates optimal grid layouts for any number of charts
 * Ensures all charts fit on a single non-scrolling screen
 */

export interface GridPosition {
  gridColumn: string;
  gridRow: string;
}

export const useConstellationLayout = (chartCount: number): GridPosition[] => {
  // All layouts designed to preserve the central "brain video" reveal
  // Grid: 48 columns × 8 rows (scaled from 12 cols by 4x for fine-grained movement)
  const COLUMN_MULTIPLIER = 4; // Converts 12-column grid to 48-column grid
  
  if (chartCount === 0) return [];
  
  // 5 CHARTS - Behavioral, Social, Sensory/Executive
  if (chartCount === 5) {
    return [
      { gridColumn: '1 / 13', gridRow: '1 / 4' },     // Top-left (1-4 * 4 = 1-13)
      { gridColumn: '37 / 49', gridRow: '1 / 4' },    // Top-right (10-13 * 4 = 37-49)
      { gridColumn: '1 / 13', gridRow: '5 / 9' },     // Bottom-left
      { gridColumn: '17 / 33', gridRow: '6 / 9' },    // Bottom-center (5-9 * 4 = 17-33)
      { gridColumn: '37 / 49', gridRow: '5 / 9' }     // Bottom-right
    ];
  }
  
  // 6 CHARTS - Academic tab
  if (chartCount === 6) {
    return [
      { gridColumn: '1 / 13', gridRow: '1 / 4' },     // Top-left (IEP Goal Tracker)
      { gridColumn: '37 / 49', gridRow: '1 / 4' },    // Top-right (Academic Fluency)
      { gridColumn: '33 / 45', gridRow: '6 / 9' },    // Bottom-right (Reading Error - 9-12 * 4 = 33-45)
      { gridColumn: '1 / 13', gridRow: '5 / 9' },     // Bottom-left (Task Initiation)
      { gridColumn: '17 / 29', gridRow: '6 / 9' },    // Bottom-center-left (Working Memory - 5-8 * 4 = 17-29)
      { gridColumn: '13 / 37', gridRow: '1 / 4' }     // Top-center (Daily Living Skills - 4-10 * 4 = 13-37)
    ];
  }
  
  // 7 CHARTS - Overall tab
  if (chartCount === 7) {
    return [
      { gridColumn: '1 / 13', gridRow: '1 / 4' },     // Top-left (Daily Activity)
      { gridColumn: '37 / 49', gridRow: '1 / 4' },    // Top-right (Mood)
      { gridColumn: '17 / 33', gridRow: '2 / 5' },    // Center (Sleep Quality - 5-9 * 4 = 17-33)
      { gridColumn: '1 / 13', gridRow: '5 / 8' },     // Mid-left (Incident)
      { gridColumn: '37 / 49', gridRow: '5 / 8' },    // Mid-right (Intervention)
      { gridColumn: '1 / 25', gridRow: '8 / 9' },     // Bottom-left (Top Goals - 1-7 * 4 = 1-25)
      { gridColumn: '25 / 49', gridRow: '8 / 9' }     // Bottom-right (Strategy - 7-13 * 4 = 25-49)
    ];
  }
  
  // Fallback for other counts - use a balanced grid (scaled to 48 columns)
  const cols = Math.min(Math.ceil(Math.sqrt(chartCount * 1.5)), 4);
  const positions: GridPosition[] = [];
  
  for (let i = 0; i < chartCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const colStart = 1 + (col * 12); // 3 * 4 = 12 columns per chart
    const colEnd = colStart + 12;
    const rowStart = 1 + (row * 2);
    const rowEnd = rowStart + 2;
    
    positions.push({
      gridColumn: `${colStart} / ${colEnd}`,
      gridRow: `${rowStart} / ${rowEnd}`
    });
  }
  
  return positions;
};
