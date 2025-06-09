
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star } from 'lucide-react';
import type { Course } from '@/hooks/useEnrolledCourses';

interface CourseCardProps {
  course: Course;
  buttonLabel?: string;
  onButtonClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  buttonLabel = "Continue", 
  onButtonClick 
}) => {
  const isBetaCourse = course.id === 'learning-state-beta';

  return (
    <Card className="fpk-card border-0 shadow-lg hover:shadow-xl transition-shadow">
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
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isBetaCourse ? 'Ready to begin' : 'In progress'}
          </div>
          <Button 
            onClick={onButtonClick}
            className={isBetaCourse ? "fpk-gradient text-white" : ""}
          >
            {buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
