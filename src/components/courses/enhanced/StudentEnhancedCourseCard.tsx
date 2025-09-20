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
import type { CourseCardModel, CourseCardActions } from '@/types/enhanced-course-card';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';
import { getCourseImage } from '@/utils/courseImages';

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
  const courseImage = getCourseImage(course.id, course.title);
  
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
            onClick={() => actions.onAssign(course.id)}
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Continue
          </Button>
        );
      case 'pending':
        return (
          <Button
            onClick={() => actions.onAssign(course.id)}
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

  // Grid view (default)
  if (viewType === 'grid') {
    return (
      <Card className="relative hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
        {/* Course Image */}
        <div 
          className="relative aspect-video bg-cover bg-center"
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 p-3 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-1">
                {course.origin === 'platform' && (
                  <Badge variant="secondary" className="text-xs backdrop-blur-sm">Platform</Badge>
                )}
                {getStatusBadge()}
              </div>
              {assignment?.target.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
            
            {course.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
              {course.instructorName && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{course.instructorName}</span>
                </div>
              )}
              
              {course.durationMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.durationMinutes} min</span>
                </div>
              )}
            </div>

            {getDueDate()}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            {getActionButton()}
          </div>
        </CardContent>
      </Card>
    );
  }

  // List and compact views can be added here similar to the original EnhancedCourseCard
  return (
    <Card className="relative hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 bg-cover bg-center rounded flex-shrink-0"
            style={{ backgroundImage: `url(${courseImage})` }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{course.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{course.description}</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge()}
              {getDueDate()}
            </div>
          </div>
          <div className="flex-shrink-0">
            {getActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}