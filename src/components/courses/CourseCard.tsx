import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, User, BookOpen, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CourseCard as CourseCardType } from '@/types/course-card';

interface CourseCardProps {
  course: CourseCardType;
  showAssignButton?: boolean;
  onAssign?: (course: CourseCardType) => React.ReactNode;
}

export function CourseCard({ course, showAssignButton = false, onAssign }: CourseCardProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'platform': return 'secondary';
      case 'org': return 'default';
      case 'scorm': return 'outline';
      case 'native': return 'outline';
      case 'assigned': return 'destructive';
      case 'due_soon': return 'destructive';
      case 'completed': return 'secondary';
      case 'in_progress': return 'default';
      default: return 'outline';
    }
  };

  const isAssigned = course.assignment;
  const isDueSoon = course.assignment?.due_at && 
    new Date(course.assignment.due_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {course.badges.map((badge, index) => (
            <Badge 
              key={index} 
              variant={getBadgeVariant(badge.type)}
              className="text-xs"
            >
              {badge.label}
            </Badge>
          ))}
          {isAssigned && (
            <Badge variant="destructive" className="text-xs">
              Assigned
            </Badge>
          )}
          {isDueSoon && (
            <Badge variant="destructive" className="text-xs">
              Due Soon
            </Badge>
          )}
        </div>
        
        <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {course.title}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {course.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {course.instructor_name && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{course.instructor_name}</span>
            </div>
          )}
          
          {course.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration_minutes)}</span>
            </div>
          )}
          
          {course.assignment?.due_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due {new Date(course.assignment.due_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {course.progress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{course.progress.completion_percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${course.progress.completion_percentage}%` }}
              />
            </div>
          </div>
        )}
        
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link to={course.route}>
            {course.progress ? 'Continue' : 'Start Course'}
          </Link>
        </Button>
        
        {showAssignButton && onAssign && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAssign(course)}
          >
            Assign
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}