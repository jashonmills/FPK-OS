import React, { useState } from 'react';
import { CourseDraft } from '@/types/course-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, Circle, FileText, Target } from 'lucide-react';

interface ProgressSidebarProps {
  draft: CourseDraft;
  selectedModule: string;
  selectedLesson: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  className?: string;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  draft,
  selectedModule,
  selectedLesson,
  onSelectLesson,
  className = ''
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand the currently selected module by default
    return { [selectedModule]: true };
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getModuleProgress = (module: typeof draft.modules[0]) => {
    const completedLessons = module.lessons.filter(lesson => lesson.slides.length > 0).length;
    const totalLessons = module.lessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { completedLessons, totalLessons, percentage };
  };

  const getLessonStatus = (lesson: typeof draft.modules[0]['lessons'][0]) => {
    if (lesson.slides.length === 0) return 'empty';
    return 'completed';
  };

  const getNextIncompleteLesson = () => {
    for (const module of draft.modules) {
      for (const lesson of module.lessons) {
        if (lesson.slides.length === 0) {
          return { moduleId: module.id, lessonId: lesson.id };
        }
      }
    }
    return null;
  };

  const nextIncomplete = getNextIncompleteLesson();

  return (
    <Card className={`w-80 h-fit ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4" />
          Course Progress
        </CardTitle>
        {nextIncomplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectLesson(nextIncomplete.moduleId, nextIncomplete.lessonId)}
            className="w-full text-xs"
          >
            <Target className="w-3 h-3 mr-1" />
            Go to Next Incomplete
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {draft.modules.map((module) => {
          const progress = getModuleProgress(module);
          const isExpanded = expandedModules[module.id];
          
          return (
            <Collapsible
              key={module.id}
              open={isExpanded}
              onOpenChange={() => toggleModule(module.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto text-left"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs truncate">{module.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{progress.completedLessons}/{progress.totalLessons}</span>
                        <Badge 
                          variant={progress.percentage === 100 ? "default" : "secondary"}
                          className="text-xs px-1 py-0"
                        >
                          {progress.percentage}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 pl-4">
                {module.lessons.map((lesson) => {
                  const status = getLessonStatus(lesson);
                  const isSelected = selectedModule === module.id && selectedLesson === lesson.id;
                  
                  return (
                    <Button
                      key={lesson.id}
                      variant={isSelected ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onSelectLesson(module.id, lesson.id)}
                      className="w-full justify-start p-2 h-auto text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate">{lesson.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FileText className="w-3 h-3" />
                            <span>{lesson.slides.length} slide{lesson.slides.length !== 1 ? 's' : ''}</span>
                            {status === 'empty' && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Empty
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};