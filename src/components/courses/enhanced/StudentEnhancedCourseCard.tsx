import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Eye, 
  Play,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CourseCardModel, CourseCardActions } from '@/types/enhanced-course-card';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface StudentEnhancedCourseCardProps {
  course: CourseCardModel;
  actions: CourseCardActions;
  viewType?: 'grid' | 'list' | 'compact';
  assignment?: StudentAssignment;
}

export function StudentEnhancedCourseCard({ 
  course, 
  actions, 
  viewType = 'grid',
  assignment 
}: StudentEnhancedCourseCardProps) {
  const courseImage = course.thumbnailUrl || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8';
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const getStatusBadge = () => {
    if (!assignment) {
      return <Badge variant="outline" className="text-xs">Available</Badge>;
    }
    
    switch (assignment.target.status) {
      case 'completed':
        return <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Completed</Badge>;
      case 'started':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Assigned</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Available</Badge>;
    }
  };

  const getActionButton = () => {
    if (!assignment) {
      return (
        <Button
          onClick={() => actions.onPreview(course.id)}
          size="sm"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
      );
    }

    switch (assignment.target.status) {
      case 'completed':
        return (
          <Button
            onClick={() => actions.onPreview(course.id)}
            size="sm"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-1" />
            Review
          </Button>
        );
      case 'started':
        return (
          <Button
            onClick={() => navigate(course.route)}
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Continue
          </Button>
        );
      case 'pending':
        return (
          <Button
            onClick={() => navigate(course.route)}
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Start Course
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => actions.onPreview(course.id)}
            size="sm"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        );
    }
  };

  const getDueDate = () => {
    if (!assignment?.target.due_at) return null;
    
    const dueDate = new Date(assignment.target.due_at);
    const now = new Date();
    const isOverdue = dueDate < now;
    const isUpcoming = dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

    return (
      <div className={`flex items-center gap-1 text-xs ${
        isOverdue ? 'text-destructive' : isUpcoming ? 'text-amber-600' : 'text-muted-foreground'
      }`}>
        <Calendar className="h-3 w-3" />
        <span>Due {dueDate.toLocaleDateString()}</span>
        {isOverdue && <AlertCircle className="h-3 w-3 ml-1" />}
      </div>
    );
  };

  // Grid view with mobile optimization
  if (viewType === 'grid') {
    return (
      <Card className={cn(
        "relative hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col",
        isMobile ? "min-h-[280px]" : "min-h-[320px]"
      )}>
        {/* Course Image */}
        <div 
          className={cn(
            "relative bg-cover bg-center",
            isMobile ? "h-32" : "aspect-video"
          )}
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className={cn(
            "relative z-10 h-full flex flex-col justify-between",
            isMobile ? "p-3" : "p-3"
          )}>
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-1">
                {course.origin === 'platform' && (
                  <Badge variant="secondary" className="text-xs backdrop-blur-sm">Platform</Badge>
                )}
                {getStatusBadge()}
              </div>
              {assignment?.target.status === 'completed' && (
                <CheckCircle className={cn(
                  "text-emerald-400",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )} />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className={cn(
          "flex-1 flex flex-col",
          isMobile ? "p-3" : "p-4"
        )}>
          <div className="flex-1">
            <h3 className={cn(
              "font-bold mb-2 line-clamp-2",
              isMobile ? "text-base" : "text-lg"
            )}>{course.title}</h3>
            
            {course.description && (
              <p className={cn(
                "text-muted-foreground line-clamp-2 mb-3",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {course.description}
              </p>
            )}

            <div className={cn(
              "flex flex-wrap gap-3 text-muted-foreground mb-3",
              isMobile ? "gap-2 text-xs" : "gap-4 text-xs"
            )}>
              {course.instructorName && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{course.instructorName}</span>
                </div>
              )}
              
              {course.durationMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{course.durationMinutes} min</span>
                </div>
              )}
            </div>

            {getDueDate()}
          </div>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-2 mt-4",
            isMobile ? "mt-3" : "mt-4"
          )}>
            <div className="w-full">
              {getActionButton()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List and compact views with mobile optimization
  return (
    <Card className={cn(
      "relative hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col",
      isMobile ? "min-h-[80px]" : ""
    )}>
      <CardContent className={cn(
        isMobile ? "p-3" : "p-4"
      )}>
        <div className={cn(
          "flex gap-3",
          isMobile ? "flex-col" : "items-center gap-4"
        )}>
          <div 
            className={cn(
              "bg-cover bg-center rounded flex-shrink-0",
              isMobile ? "w-full h-24" : "w-16 h-16"
            )}
            style={{ backgroundImage: `url(${courseImage})` }}
          />
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold",
              isMobile ? "text-sm mb-1" : "truncate"
            )}>{course.title}</h3>
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs line-clamp-2 mb-2" : "text-sm truncate"
            )}>{course.description}</p>
            <div className={cn(
              "flex items-center gap-2",
              isMobile ? "flex-wrap mt-2" : "mt-1"
            )}>
              {getStatusBadge()}
              {getDueDate()}
            </div>
          </div>
          <div className={cn(
            "flex-shrink-0",
            isMobile ? "w-full" : ""
          )}>
            <div className={isMobile ? "w-full" : ""}>
              {getActionButton()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}