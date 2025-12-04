/**
 * Enhanced Course Sidebar with Progress Tracking
 * Shows module completion status, active module highlighting, and locked modules
 */

import React from 'react';
import { Check, Lock, Play, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Module {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'audio' | 'text' | 'pdf';
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  progress?: number; // 0-100
}

interface CourseProgressSidebarProps {
  modules: Module[];
  courseProgress: number;
  onModuleSelect: (moduleId: string) => void;
  className?: string;
}

export const CourseProgressSidebar: React.FC<CourseProgressSidebarProps> = ({
  modules,
  courseProgress,
  onModuleSelect,
  className
}) => {
  const completedCount = modules.filter(m => m.isCompleted).length;
  const totalCount = modules.length;

  const getModuleIcon = (module: Module) => {
    if (module.isLocked) return <Lock className="h-4 w-4 text-muted-foreground" />;
    if (module.isCompleted) return <Check className="h-4 w-4 text-success" />;
    if (module.isActive) return <Play className="h-4 w-4 text-primary" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'text': return 'bg-purple-100 text-purple-700';
      case 'pdf': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      {/* Course Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-card-foreground">Course Progress</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
        <Progress value={courseProgress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          {Math.round(courseProgress)}% Complete
        </p>
      </div>

      {/* Module List */}
      <div className="space-y-2">
        <h4 className="font-medium text-card-foreground mb-3">Modules</h4>
        {modules.map((module, index) => (
          <div key={module.id} className="relative">
            <Button
              variant={module.isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start p-3 h-auto",
                module.isCompleted && "bg-success/10 hover:bg-success/20",
                module.isLocked && "opacity-50 cursor-not-allowed",
                module.isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => !module.isLocked && onModuleSelect(module.id)}
              disabled={module.isLocked}
            >
              <div className="flex items-start gap-3 w-full">
                {/* Module Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getModuleIcon(module)}
                </div>

                {/* Module Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {index + 1}. {module.title}
                    </span>
                    {module.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getModuleTypeColor(module.type))}
                    >
                      {module.type.toUpperCase()}
                    </Badge>
                    <span>{module.duration}</span>
                    {module.isLocked && (
                      <Badge variant="outline" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Module Progress Bar */}
                  {module.progress !== undefined && module.progress > 0 && !module.isCompleted && (
                    <div className="mt-2">
                      <Progress value={module.progress} className="h-1" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(module.progress)}% watched
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Button>

            {/* Completion Checkmark Overlay */}
            {module.isCompleted && (
              <div className="absolute -top-1 -right-1 bg-success rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Course Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-card-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-card-foreground">
              {modules.reduce((acc, m) => acc + parseInt(m.duration), 0)}m
            </p>
            <p className="text-xs text-muted-foreground">Total Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressSidebar;