
export const useWeeklyActivity = () => {
  const weeklyActivity = [
    { day: 'Mon', studyTime: 45 },
    { day: 'Tue', studyTime: 60 },
    { day: 'Wed', studyTime: 30 },
    { day: 'Thu', studyTime: 75 },
    { day: 'Fri', studyTime: 90 },
    { day: 'Sat', studyTime: 120 },
    { day: 'Sun', studyTime: 40 }
  ];

  return { weeklyActivity };
};
