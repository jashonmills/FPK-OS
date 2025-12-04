
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Star, CheckCircle, Clock } from 'lucide-react';
import type { Course } from '@/hooks/useEnrolledCourses';
import { shouldShowBetaFeatures } from '@/lib/featureFlags';

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
  const isBetaCourse = shouldShowBetaFeatures() && (course as any).is_beta;
  const completionPercentage = progress?.completion_percentage || 0;
  const completedModules = progress?.completed_modules?.length || 0;
  const isCompleted = progress?.completed || false;

  // Get the course image from database
  const courseImage = (course as any).background_image || (course as any).thumbnail_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8';

  return (
    <Card className="fpk-card border-0 shadow-lg hover:shadow-xl transition-shadow">
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">{course.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {course.featured && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {isBetaCourse && (
                  <Badge className="fpk-gradient text-white">
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
          <p className="text-gray-600 mb-4 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Progress Section */}
        {isBetaCourse && completionPercentage > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex items-center gap-4 text-xs text-gray-500">
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
          <div className="text-sm text-gray-500 flex items-center gap-1">
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
            className={isBetaCourse ? "fpk-gradient text-white" : ""}
          >
            {isCompleted ? "Review" : buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
