import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NativeCourse, NativeEnrollment } from '@/hooks/useNativeCourses';

interface NativeCourseCardProps {
  course: NativeCourse;
  enrollment?: NativeEnrollment;
  onEnroll?: () => void;
  isEnrolling?: boolean;
}

export function NativeCourseCard({ 
  course, 
  enrollment, 
  onEnroll, 
  isEnrolling = false 
}: NativeCourseCardProps) {
  const isEnrolled = !!enrollment;
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      {course.cover_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={course.cover_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {course.summary}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1 ml-4">
            <Badge variant="default" className="fpk-gradient text-white">
              Native
            </Badge>
            <Badge variant="outline">
              Interactive
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>Native Course</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.est_minutes} mins</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {isEnrolled && enrollment && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {enrollment.progress_pct}%
                </span>
              </div>
              <Progress value={enrollment.progress_pct} className="h-2" />
              {enrollment.status === 'completed' && (
                <Badge variant="default" className="w-full justify-center bg-green-600">
                  Completed
                </Badge>
              )}
            </div>
          )}

          {isEnrolled ? (
            <Link to={`/courses/${course.slug}`}>
              <Button className="w-full fpk-gradient text-white">
                <Play className="h-4 w-4 mr-2" />
                {enrollment?.progress_pct === 0 ? 'Start Course' : 'Continue Learning'}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="w-full fpk-gradient text-white"
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}