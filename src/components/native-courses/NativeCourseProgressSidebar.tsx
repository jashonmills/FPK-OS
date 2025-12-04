import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CourseLesson {
  id: string;
  title: string;
  order_index: number;
  est_minutes: number;
}

interface CourseModule {
  id: string;
  title: string;
  order_index: number;
  course_lessons: CourseLesson[];
}

interface NativeCourseProgressSidebarProps {
  modules: CourseModule[];
  currentLessonId: string | null;
  enrollment: {
    progress_pct: number;
    last_lesson_id?: string;
  } | null;
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

export const NativeCourseProgressSidebar: React.FC<NativeCourseProgressSidebarProps> = ({
  modules,
  currentLessonId,
  enrollment,
  onLessonSelect,
  className
}) => {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(new Set());
  
  // Initialize with current module expanded
  React.useEffect(() => {
    if (currentLessonId && modules.length > 0) {
      const currentModule = modules.find(module => 
        module.course_lessons.some(lesson => lesson.id === currentLessonId)
      );
      if (currentModule) {
        setExpandedModules(new Set([currentModule.id]));
      }
    }
  }, [currentLessonId, modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    return (lessonIndex + 1) <= Math.floor((enrollment?.progress_pct || 0) * allLessons.length / 100);
  };

  const isLessonActive = (lessonId: string) => {
    return currentLessonId === lessonId;
  };

  const allLessons = modules.flatMap(module => 
    module.course_lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title
    }))
  );

  const completedLessons = allLessons.filter(lesson => isLessonCompleted(lesson.id));
  const progressPercentage = enrollment?.progress_pct || 0;

  return (
    <div className={`bg-card border-r h-full overflow-y-auto ${className}`}>
      {/* Progress Header */}
      <div className="p-4 border-b">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedLessons.length} of {allLessons.length} completed</span>
          </div>
        </div>
      </div>

      {/* Modules and Lessons */}
      <div className="p-2">
        {modules.sort((a, b) => a.order_index - b.order_index).map((module) => (
          <Collapsible
            key={module.id}
            open={expandedModules.has(module.id)}
            onOpenChange={() => toggleModule(module.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left"
              >
                <div className="flex items-center space-x-2 w-full">
                  {expandedModules.has(module.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <BookOpen className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{module.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {module.course_lessons.length} lessons
                    </div>
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 ml-6">
              {module.course_lessons
                .sort((a, b) => a.order_index - b.order_index)
                .map((lesson) => (
                <Button
                  key={lesson.id}
                  variant={isLessonActive(lesson.id) ? "secondary" : "ghost"}
                  className="w-full justify-start p-3 h-auto text-left"
                  onClick={() => onLessonSelect(lesson.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isLessonActive(lesson.id) ? (
                      <PlayCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-2">
                        {lesson.est_minutes > 0 && (
                          <span>{lesson.est_minutes} min</span>
                        )}
                        {isLessonActive(lesson.id) && (
                          <Badge variant="default" className="text-xs px-1 py-0">Current</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default NativeCourseProgressSidebar;