import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp } from 'lucide-react';

interface TopicMasteryTableProps {
  data?: Array<{
    topic: string;
    masteryLevel: number;
    outcomesCount: number;
  }>;
}

export const TopicMasteryTable = ({ data }: TopicMasteryTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Topic Mastery
          </CardTitle>
          <CardDescription>Track your progress across different topics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No mastery data available yet. Complete learning outcomes to build your mastery profile!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMasteryColor = (level: number) => {
    if (level >= 0.8) return 'text-green-600';
    if (level >= 0.6) return 'text-blue-600';
    if (level >= 0.4) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 0.8) return 'Expert';
    if (level >= 0.6) return 'Proficient';
    if (level >= 0.4) return 'Intermediate';
    return 'Learning';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          Topic Mastery
        </CardTitle>
        <CardDescription>Your top mastered topics and current progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((topic, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">{topic.topic}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${getMasteryColor(topic.masteryLevel)}`}>
                      {getMasteryLabel(topic.masteryLevel)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {topic.outcomesCount} outcome{topic.outcomesCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {topic.masteryLevel >= 0.8 && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  <span className={`text-lg font-bold ${getMasteryColor(topic.masteryLevel)}`}>
                    {Math.round(topic.masteryLevel * 100)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={topic.masteryLevel * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {data.length === 10 && (
          <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border">
            Showing top 10 topics by mastery level
          </p>
        )}
      </CardContent>
    </Card>
  );
};
