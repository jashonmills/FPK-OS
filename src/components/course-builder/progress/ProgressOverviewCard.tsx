import React from 'react';
import { CourseDraft } from '@/types/course-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle, Target } from 'lucide-react';

interface ProgressOverviewCardProps {
  draft: CourseDraft;
}

export const ProgressOverviewCard: React.FC<ProgressOverviewCardProps> = ({ draft }) => {
  const stats = React.useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    let totalSlides = 0;
    let inProgressLessons = 0;

    draft.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        totalSlides += lesson.slides.length;
        
        if (lesson.slides.length > 0) {
          completedLessons++;
        } else {
          inProgressLessons++;
        }
      });
    });

    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const remainingLessons = totalLessons - completedLessons;

    return {
      totalModules: draft.modules.length,
      totalLessons,
      completedLessons,
      remainingLessons,
      totalSlides,
      completionPercentage,
      inProgressLessons
    };
  }, [draft]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'hsl(var(--success))';
    if (percentage >= 75) return 'hsl(var(--success) / 0.8)';
    if (percentage >= 50) return 'hsl(var(--primary))';
    if (percentage >= 25) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Course Progress Overview
          </CardTitle>
          <Badge 
            variant={stats.completionPercentage === 100 ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {stats.completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{stats.completedLessons}/{stats.totalLessons} lessons</span>
          </div>
          <Progress 
            value={stats.completionPercentage} 
            className="h-3"
            style={{ '--progress-foreground': getProgressColor(stats.completionPercentage) } as React.CSSProperties}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-2xl font-bold text-success">{stats.completedLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-2xl font-bold text-warning">{stats.remainingLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalSlides}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Slides</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{stats.totalModules}</span>
            </div>
            <p className="text-xs text-muted-foreground">Modules</p>
          </div>
        </div>

        {/* Next Action */}
        {stats.remainingLessons > 0 && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Next Action:</span>
              <span className="text-sm">Complete {stats.remainingLessons} more lesson{stats.remainingLessons > 1 ? 's' : ''} to proceed</span>
            </div>
          </div>
        )}

        {stats.completionPercentage === 100 && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Ready to Review & Publish!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};