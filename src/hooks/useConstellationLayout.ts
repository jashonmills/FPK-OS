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
      { gridColumn: '1 / 13', gridRow: '1 / 6' },     // Top-left (taller)
      { gridColumn: '37 / 49', gridRow: '1 / 6' },    // Top-right (taller)
      { gridColumn: '1 / 13', gridRow: '7 / 12' },    // Bottom-left (taller)
      { gridColumn: '17 / 33', gridRow: '7 / 12' },   // Bottom-center (taller)
      { gridColumn: '37 / 49', gridRow: '7 / 12' }    // Bottom-right (taller)
    ];
  }
  
  // 6 CHARTS - Academic tab
  if (chartCount === 6) {
    return [
      { gridColumn: '1 / 13', gridRow: '1 / 6' },     // Top-left (IEP Goal Tracker) - taller
      { gridColumn: '37 / 49', gridRow: '1 / 6' },    // Top-right (Academic Fluency) - taller
      { gridColumn: '33 / 45', gridRow: '7 / 12' },   // Bottom-right (Reading Error) - taller
      { gridColumn: '1 / 13', gridRow: '7 / 12' },    // Bottom-left (Task Initiation) - taller
      { gridColumn: '17 / 29', gridRow: '7 / 12' },   // Bottom-center-left (Working Memory) - taller
      { gridColumn: '13 / 37', gridRow: '1 / 6' }     // Top-center (Daily Living Skills) - taller
    ];
  }
  
  // 7 CHARTS - Overall tab
  if (chartCount === 7) {
    return [
      { gridColumn: '1 / 13', gridRow: '1 / 5' },     // Top-left (Daily Activity) - taller
      { gridColumn: '37 / 49', gridRow: '1 / 5' },    // Top-right (Mood) - taller
      { gridColumn: '17 / 33', gridRow: '1 / 6' },    // Center (Sleep Quality) - taller
      { gridColumn: '1 / 13', gridRow: '6 / 10' },    // Mid-left (Incident) - taller
      { gridColumn: '37 / 49', gridRow: '6 / 10' },   // Mid-right (Intervention) - taller
      { gridColumn: '1 / 25', gridRow: '11 / 15' },   // Bottom-left (Top Goals) - taller & lower
      { gridColumn: '25 / 49', gridRow: '11 / 15' }   // Bottom-right (Strategy) - taller & lower
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
    const rowStart = 1 + (row * 5);  // Increased spacing (was 2, now 5 for taller charts)
    const rowEnd = rowStart + 4;     // Increased height (was 2, now 4)
    
    positions.push({
      gridColumn: `${colStart} / ${colEnd}`,
      gridRow: `${rowStart} / ${rowEnd}`
    });
  }
  
  return positions;
};
