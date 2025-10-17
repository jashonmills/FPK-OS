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
  // Grid: 12 columns × 8 rows
  
  if (chartCount === 0) return [];
  
  // 5 CHARTS - Behavioral, Social, Sensory/Executive
  if (chartCount === 5) {
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 4' },     // Top-left
      { gridColumn: '10 / 13', gridRow: '1 / 4' },   // Top-right
      { gridColumn: '1 / 4', gridRow: '5 / 9' },     // Bottom-left
      { gridColumn: '5 / 9', gridRow: '6 / 9' },     // Bottom-center
      { gridColumn: '10 / 13', gridRow: '5 / 9' }    // Bottom-right
    ];
  }
  
  // 6 CHARTS - Academic tab
  if (chartCount === 6) {
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 4' },     // Top-left
      { gridColumn: '10 / 13', gridRow: '1 / 4' },   // Top-right
      { gridColumn: '1 / 4', gridRow: '5 / 9' },     // Bottom-left
      { gridColumn: '5 / 8', gridRow: '6 / 9' },     // Bottom-center-left
      { gridColumn: '9 / 12', gridRow: '6 / 9' },    // Bottom-center-right
      { gridColumn: '1 / 7', gridRow: '4 / 6' }      // Middle-left (small)
    ];
  }
  
  // 7 CHARTS - Overall tab
  if (chartCount === 7) {
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 4' },     // Top-left (Daily Activity)
      { gridColumn: '10 / 13', gridRow: '1 / 4' },   // Top-right (Mood)
      { gridColumn: '5 / 9', gridRow: '2 / 5' },     // Center (Sleep Quality)
      { gridColumn: '1 / 4', gridRow: '5 / 8' },     // Mid-left (Incident)
      { gridColumn: '10 / 13', gridRow: '5 / 8' },   // Mid-right (Intervention)
      { gridColumn: '1 / 7', gridRow: '8 / 9' },     // Bottom-left (Top Goals)
      { gridColumn: '7 / 13', gridRow: '8 / 9' }     // Bottom-right (Strategy)
    ];
  }
  
  // Fallback for other counts - use a balanced grid
  const cols = Math.min(Math.ceil(Math.sqrt(chartCount * 1.5)), 4);
  const positions: GridPosition[] = [];
  
  for (let i = 0; i < chartCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const colStart = 1 + (col * 3);
    const colEnd = colStart + 3;
    const rowStart = 1 + (row * 2);
    const rowEnd = rowStart + 2;
    
    positions.push({
      gridColumn: `${colStart} / ${colEnd}`,
      gridRow: `${rowStart} / ${rowEnd}`
    });
  }
  
  return positions;
};
