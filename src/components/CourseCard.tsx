
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Star, CheckCircle, Clock } from 'lucide-react';
import type { Course } from '@/hooks/useEnrolledCourses';
import { getCourseImage } from '@/utils/courseImages';

interface CourseCardProps {
  course: Course;
  buttonLabel?: string;
  onButtonClick: () => void;
  progress?: {
    completion_percentage: number;
    completed_modules: string[];
    completed: boolean;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  buttonLabel = "Continue", 
  onButtonClick,
  progress 
}) => {
  const isBetaCourse = false; // Beta course removed
  const completionPercentage = progress?.completion_percentage || 0;
  const completedModules = progress?.completed_modules?.length || 0;
  const isCompleted = progress?.completed || false;

  // Get the course image using the shared utility
  const courseImage = getCourseImage(course.id, course.title);

  return (
    <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          <div className="w-full h-full bg-black/20" />
        </div>
      </div>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-card-foreground">{course.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {course.featured && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {isBetaCourse && (
                  <Badge className="bg-primary text-primary-foreground">
                    Beta
                  </Badge>
                )}
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {course.description && (
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Progress Section */}
        {isBetaCourse && completionPercentage > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{completedModules} modules completed</span>
              {completionPercentage > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.round(completedModules * 45)} min studied
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {isBetaCourse ? (
              completionPercentage > 0 ? (
                isCompleted ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Course completed!
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 text-blue-500" />
                    {completionPercentage}% complete
                  </>
                )
              ) : (
                'Ready to begin'
              )
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-500" />
                In progress
              </>
            )}
          </div>
          <Button 
            onClick={onButtonClick}
            className={isBetaCourse ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
          >
            {isCompleted ? "Review" : buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
