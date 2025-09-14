import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import course images
import courseLinearEquations from '@/assets/course-linear-equations.jpg';
import courseTrigonometry from '@/assets/course-trigonometry.jpg';
import courseAlgebra from '@/assets/course-algebra.jpg';
import courseLogic from '@/assets/course-logic.jpg';
import courseEconomics from '@/assets/course-economics.jpg';
import courseSpellingReading from '@/assets/course-spelling-reading.jpg';
import courseNeurodiversity from '@/assets/course-neurodiversity.jpg';
import courseScience from '@/assets/course-science.jpg';

interface StyledCourseCardProps {
  id: string;
  title: string;
  description: string;
  courseType: string;
  isEnrolled: boolean;
  progress?: number;
  duration?: number;
  instructor?: string;
  route?: string;
  onEnroll?: () => void;
  isEnrolling?: boolean;
  isCompleted?: boolean;
}

// Map course IDs to their images
const courseImageMap: Record<string, string> = {
  'interactive-linear-equations': courseLinearEquations,
  'interactive-trigonometry': courseTrigonometry,
  'interactive-algebra': courseAlgebra,
  'logic-critical-thinking': courseLogic,
  'introduction-modern-economics': courseEconomics,
  'el-spelling-reading': courseSpellingReading,
  'neurodiversity-strengths-based-approach': courseNeurodiversity,
  'interactive-science': courseScience,
};

// Fallback function for courses not in the map
const getCourseImage = (id: string, title: string): string => {
  // Check direct ID mapping first
  if (courseImageMap[id]) {
    return courseImageMap[id];
  }
  
  // Fallback based on title keywords
  const titleLower = title.toLowerCase();
  if (titleLower.includes('linear') || titleLower.includes('equation')) return courseLinearEquations;
  if (titleLower.includes('trigonometry') || titleLower.includes('trig')) return courseTrigonometry;
  if (titleLower.includes('algebra')) return courseAlgebra;
  if (titleLower.includes('logic') || titleLower.includes('critical')) return courseLogic;
  if (titleLower.includes('economics') || titleLower.includes('economic')) return courseEconomics;
  if (titleLower.includes('spelling') || titleLower.includes('reading') || titleLower.includes('english')) return courseSpellingReading;
  if (titleLower.includes('neurodiversity') || titleLower.includes('neurodivergent')) return courseNeurodiversity;
  if (titleLower.includes('science') || titleLower.includes('biology') || titleLower.includes('chemistry')) return courseScience;
  
  // Default fallback
  return courseScience;
};

export function StyledCourseCard({ 
  id,
  title, 
  description, 
  courseType,
  isEnrolled,
  progress = 0,
  duration,
  instructor,
  route,
  onEnroll,
  isEnrolling = false,
  isCompleted = false
}: StyledCourseCardProps) {
  const courseImage = getCourseImage(id, title);
  
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* AI Generated Image Header */}
      <div 
        className="relative h-40 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${courseImage})` }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Header content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {courseType}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
                Completed
              </Badge>
            )}
          </div>
          
          <div className="flex-1 flex items-end">
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-6">
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Course details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {instructor && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{instructor}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{duration} mins</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress section */}
        {isEnrolled && progress !== undefined && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto">
          {isEnrolled ? (
            route ? (
              <Link to={route}>
                <Button className="w-full fpk-gradient text-white group-hover:shadow-md transition-shadow">
                  <Play className="h-4 w-4 mr-2" />
                  {progress === 0 ? 'Start Course' : 'Continue Learning'}
                </Button>
              </Link>
            ) : (
              <Button 
                disabled={true}
                className="w-full fpk-gradient text-white group-hover:shadow-md transition-shadow opacity-50"
              >
                <Play className="h-4 w-4 mr-2" />
                {progress === 0 ? 'Start Course' : 'Continue Learning'}
              </Button>
            )
          ) : (
            <Button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="w-full fpk-gradient text-white group-hover:shadow-md transition-shadow"
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}