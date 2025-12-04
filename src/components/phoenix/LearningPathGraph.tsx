import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLearningPath } from '@/hooks/useLearningPath';
import { Network, TrendingUp, BookOpen, Trophy, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const LearningPathGraph = () => {
  const { data: concepts, isLoading } = useLearningPath();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Learning Path
          </CardTitle>
          <CardDescription>Loading your learning journey...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!concepts || concepts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Learning Path
          </CardTitle>
          <CardDescription>
            Start learning to see your personalized learning path!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 opacity-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'learning':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered':
        return <Trophy className="h-4 w-4" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'learning':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Unknown';
  };

  // Group by domain
  const conceptsByDomain = concepts.reduce((acc, concept) => {
    if (!acc[concept.domain]) {
      acc[concept.domain] = [];
    }
    acc[concept.domain].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Your Learning Path
        </CardTitle>
        <CardDescription>
          Visual representation of your learning journey and mastery levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(conceptsByDomain).map(([domain, domainConcepts]) => (
          <div key={domain} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <h3 className="font-semibold capitalize text-lg">{domain}</h3>
              <Badge variant="outline">
                {domainConcepts.length} concepts
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domainConcepts
                .sort((a, b) => a.difficulty_level - b.difficulty_level)
                .map((concept) => (
                  <Card
                    key={concept.concept_id}
                    className={`transition-all hover:shadow-md ${
                      concept.status === 'mastered' ? 'border-green-500/50' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-tight">
                          {concept.concept_name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 text-xs ${getStatusColor(
                            concept.status
                          )}`}
                        >
                          {getStatusIcon(concept.status)}
                          {concept.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {getDifficultyLabel(concept.difficulty_level)} • Level {concept.difficulty_level}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-medium">
                            {Math.round(concept.mastery_level * 100)}%
                          </span>
                        </div>
                        <Progress value={concept.mastery_level * 100} className="h-2" />
                      </div>

                      {concept.prerequisites && concept.prerequisites.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Prerequisites:</p>
                          <div className="flex flex-wrap gap-1">
                            {concept.prerequisites.map((prereq) => (
                              <Badge
                                key={prereq.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {prereq.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {concept.last_interaction && (
                        <p className="text-xs text-muted-foreground">
                          Last studied: {new Date(concept.last_interaction).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
