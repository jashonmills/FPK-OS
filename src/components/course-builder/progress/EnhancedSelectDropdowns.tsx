import React from 'react';
import { CourseDraft } from '@/types/course-builder';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';

interface EnhancedSelectDropdownsProps {
  draft: CourseDraft;
  selectedModule: string;
  selectedLesson: string;
  onModuleChange: (moduleId: string) => void;
  onLessonChange: (lessonId: string) => void;
}

export const EnhancedSelectDropdowns: React.FC<EnhancedSelectDropdownsProps> = ({
  draft,
  selectedModule,
  selectedLesson,
  onModuleChange,
  onLessonChange
}) => {
  const currentModule = draft.modules.find(m => m.id === selectedModule);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="flex items-center gap-2">
          Select Module
          <Badge variant="outline" className="text-xs">
            {draft.modules.length} total
          </Badge>
        </Label>
        <Select value={selectedModule} onValueChange={onModuleChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choose a module..." />
          </SelectTrigger>
          <SelectContent>
            {draft.modules.map(module => {
              const progress = getModuleProgress(module);
              return (
                <SelectItem key={module.id} value={module.id}>
                  <div className="flex items-center justify-between w-full min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {progress.percentage === 100 ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      ) : progress.percentage > 0 ? (
                        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">{module.title}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge 
                        variant={progress.percentage === 100 ? "default" : "secondary"}
                        className="text-xs px-2 py-0"
                      >
                        {progress.completedLessons}/{progress.totalLessons}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="flex items-center gap-2">
          Select Lesson
          {currentModule && (
            <Badge variant="outline" className="text-xs">
              {currentModule.lessons.length} total
            </Badge>
          )}
        </Label>
        <Select 
          value={selectedLesson} 
          onValueChange={onLessonChange}
          disabled={!currentModule}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choose a lesson..." />
          </SelectTrigger>
          <SelectContent>
            {currentModule?.lessons.map(lesson => {
              const status = getLessonStatus(lesson);
              return (
                <SelectItem key={lesson.id} value={lesson.id}>
                  <div className="flex items-center justify-between w-full min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge 
                        variant={lesson.slides.length > 0 ? "default" : "outline"}
                        className="text-xs px-2 py-0"
                      >
                        {lesson.slides.length} slide{lesson.slides.length !== 1 ? 's' : ''}
                      </Badge>
                      {status === 'empty' && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          !
                        </Badge>
                      )}
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};