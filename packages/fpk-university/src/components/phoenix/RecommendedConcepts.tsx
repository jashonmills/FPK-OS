import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRecommendedConcepts } from '@/hooks/useLearningPath';
import { Sparkles, ArrowRight, Target } from 'lucide-react';

export const RecommendedConcepts = () => {
  const { data: recommendations, isLoading } = useRecommendedConcepts(5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>Loading recommendations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>
            Start learning to get personalized recommendations!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-500/20 text-green-700 dark:text-green-300';
    if (level <= 3) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-500/20 text-red-700 dark:text-red-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommended Next Steps
        </CardTitle>
        <CardDescription>
          AI-powered suggestions based on your learning progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card
            key={rec.concept_id}
            className="transition-all hover:shadow-md border-l-4 border-l-primary/50"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold">{rec.concept_name}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(rec.difficulty_level)}`}
                    >
                      Level {rec.difficulty_level}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>

                  {rec.recommendation_score === 1 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Sparkles className="h-3 w-3" />
                      <span className="font-medium">Perfect match! Ready to learn now</span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="shrink-0">
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
