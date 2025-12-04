export function getDateRange(days: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return { startDate, endDate };
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function groupByDate<T extends { created_at: string }>(
  data: T[],
  dateRange: number = 30
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  data.forEach(item => {
    const date = new Date(item.created_at).toLocaleDateString();
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(item);
  });
  
  return grouped;
}

export function calculateStreak<T extends { created_at: string }>(
  data: T[]
): { currentStreak: number; longestStreak: number } {
  if (data.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sortedDates = [...new Set(data.map(d => 
    new Date(d.created_at).toDateString()
  ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
      if (i === 0) currentStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}
