
import { useState, useEffect } from 'react';

interface WeeklyActivity {
  day: string;
  studyTime: number;
}

export const useWeeklyActivity = () => {
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchWeeklyActivity = async () => {
      setIsLoading(true);
      // Mock data
      const mockData: WeeklyActivity[] = [
        { day: 'Mon', studyTime: 45 },
        { day: 'Tue', studyTime: 30 },
        { day: 'Wed', studyTime: 60 },
        { day: 'Thu', studyTime: 25 },
        { day: 'Fri', studyTime: 40 },
        { day: 'Sat', studyTime: 70 },
        { day: 'Sun', studyTime: 35 },
      ];
      
      setTimeout(() => {
        setWeeklyActivity(mockData);
        setIsLoading(false);
      }, 1000);
    };

    fetchWeeklyActivity();
  }, []);

  return { weeklyActivity, isLoading };
};
