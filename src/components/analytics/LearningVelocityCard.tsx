import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BookOpen, Clock } from 'lucide-react';

interface LearningVelocityCardProps {
  data?: {
    topicsPerWeek: number;
    totalTopics: number;
    timeSpan: number;
  };
}

export const LearningVelocityCard = ({ data }: LearningVelocityCardProps) => {
  if (!data || data.totalTopics === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Learning Velocity
          </CardTitle>
          <CardDescription>Track your learning pace and topic coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No learning data available yet. Start exploring topics to see your velocity!
          </p>
        </CardContent>
      </Card>
    );
  }

  const weeksSpan = Math.max(1, Math.ceil(data.timeSpan / 7));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Learning Velocity
        </CardTitle>
        <CardDescription>Your learning pace over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium text-green-900 dark:text-green-100">Topics/Week</p>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {data.topicsPerWeek.toFixed(1)}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">Total Topics</p>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {data.totalTopics}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <p className="text-xs font-medium text-purple-900 dark:text-purple-100">Active Weeks</p>
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {weeksSpan}
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {data.topicsPerWeek > 2 
              ? "🔥 Excellent pace! You're covering new topics consistently."
              : data.topicsPerWeek > 1
              ? "💪 Good progress! Keep exploring new topics."
              : "🌱 Getting started. Try exploring more diverse topics."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
