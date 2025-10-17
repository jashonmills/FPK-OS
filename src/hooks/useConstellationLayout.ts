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
  // 12-column × 8-row grid system
  // Central "brain zone" should remain relatively clear (cols 5-9, rows 3-6)
  
  if (chartCount === 0) return [];
  
  // Layout recipes for different chart counts
  if (chartCount <= 2) {
    return [
      { gridColumn: '1 / 7', gridRow: '1 / 5' },
      { gridColumn: '7 / 13', gridRow: '1 / 5' }
    ].slice(0, chartCount);
  }
  
  if (chartCount === 3) {
    return [
      { gridColumn: '1 / 7', gridRow: '1 / 5' },
      { gridColumn: '7 / 13', gridRow: '1 / 5' },
      { gridColumn: '1 / 13', gridRow: '5 / 9' }
    ];
  }
  
  if (chartCount === 4) {
    return [
      { gridColumn: '1 / 7', gridRow: '1 / 5' },
      { gridColumn: '7 / 13', gridRow: '1 / 5' },
      { gridColumn: '1 / 7', gridRow: '5 / 9' },
      { gridColumn: '7 / 13', gridRow: '5 / 9' }
    ];
  }
  
  if (chartCount === 5) {
    return [
      { gridColumn: '1 / 7', gridRow: '1 / 5' },
      { gridColumn: '7 / 13', gridRow: '1 / 5' },
      { gridColumn: '1 / 5', gridRow: '5 / 9' },
      { gridColumn: '5 / 9', gridRow: '5 / 9' },
      { gridColumn: '9 / 13', gridRow: '5 / 9' }
    ];
  }
  
  if (chartCount === 6) {
    // The "reference image" layout - balanced constellation
    return [
      { gridColumn: '1 / 5', gridRow: '1 / 4' },
      { gridColumn: '9 / 13', gridRow: '1 / 4' },
      { gridColumn: '1 / 5', gridRow: '4 / 7' },
      { gridColumn: '9 / 13', gridRow: '4 / 7' },
      { gridColumn: '1 / 7', gridRow: '7 / 9' },
      { gridColumn: '7 / 13', gridRow: '7 / 9' }
    ];
  }
  
  if (chartCount === 7) {
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 4' },
      { gridColumn: '4 / 7', gridRow: '1 / 3' },
      { gridColumn: '10 / 13', gridRow: '1 / 4' },
      { gridColumn: '1 / 4', gridRow: '4 / 7' },
      { gridColumn: '10 / 13', gridRow: '4 / 7' },
      { gridColumn: '1 / 7', gridRow: '7 / 9' },
      { gridColumn: '7 / 13', gridRow: '7 / 9' }
    ];
  }
  
  if (chartCount === 8) {
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 4' },
      { gridColumn: '4 / 7', gridRow: '1 / 3' },
      { gridColumn: '7 / 10', gridRow: '1 / 3' },
      { gridColumn: '10 / 13', gridRow: '1 / 4' },
      { gridColumn: '1 / 4', gridRow: '4 / 7' },
      { gridColumn: '10 / 13', gridRow: '4 / 7' },
      { gridColumn: '1 / 7', gridRow: '7 / 9' },
      { gridColumn: '7 / 13', gridRow: '7 / 9' }
    ];
  }
  
  if (chartCount === 9) {
    // Dense mosaic layout
    return [
      { gridColumn: '1 / 4', gridRow: '1 / 3' },
      { gridColumn: '4 / 7', gridRow: '1 / 3' },
      { gridColumn: '10 / 13', gridRow: '1 / 3' },
      { gridColumn: '1 / 4', gridRow: '3 / 5' },
      { gridColumn: '10 / 13', gridRow: '3 / 5' },
      { gridColumn: '1 / 4', gridRow: '5 / 7' },
      { gridColumn: '10 / 13', gridRow: '5 / 7' },
      { gridColumn: '1 / 7', gridRow: '7 / 9' },
      { gridColumn: '7 / 13', gridRow: '7 / 9' }
    ];
  }
  
  if (chartCount >= 10) {
    // Ultra-dense layout for 10+ charts
    const positions: GridPosition[] = [
      { gridColumn: '1 / 3', gridRow: '1 / 3' },
      { gridColumn: '3 / 5', gridRow: '1 / 3' },
      { gridColumn: '5 / 7', gridRow: '1 / 2' },
      { gridColumn: '7 / 9', gridRow: '1 / 2' },
      { gridColumn: '9 / 11', gridRow: '1 / 3' },
      { gridColumn: '11 / 13', gridRow: '1 / 3' },
      { gridColumn: '1 / 3', gridRow: '3 / 5' },
      { gridColumn: '11 / 13', gridRow: '3 / 5' },
      { gridColumn: '1 / 3', gridRow: '5 / 7' },
      { gridColumn: '11 / 13', gridRow: '5 / 7' },
      { gridColumn: '1 / 4', gridRow: '7 / 9' },
      { gridColumn: '4 / 7', gridRow: '7 / 9' },
      { gridColumn: '7 / 10', gridRow: '7 / 9' },
      { gridColumn: '10 / 13', gridRow: '7 / 9' }
    ];
    return positions.slice(0, chartCount);
  }
  
  // Fallback: simple grid
  return Array.from({ length: chartCount }, (_, i) => ({
    gridColumn: `${(i % 3) * 4 + 1} / ${(i % 3) * 4 + 5}`,
    gridRow: `${Math.floor(i / 3) * 2 + 1} / ${Math.floor(i / 3) * 2 + 3}`
  }));
};
