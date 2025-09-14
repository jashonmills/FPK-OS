import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StyledCourseCardProps {
  id: string;
  title: string;
  description: string;
  courseType: string;
  isEnrolled: boolean;
  progress?: number;
  duration?: number;
  instructor?: string;
  route: string;
  onEnroll?: () => void;
  isEnrolling?: boolean;
  colorTheme: 'blue' | 'orange' | 'purple' | 'green';
  isCompleted?: boolean;
}

const themeConfig = {
  blue: {
    headerGradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    circleColor: 'bg-blue-400/30',
    badgeClass: 'bg-blue-500 text-white'
  },
  orange: {
    headerGradient: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
    circleColor: 'bg-orange-400/30',
    badgeClass: 'bg-orange-500 text-white'
  },
  purple: {
    headerGradient: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
    circleColor: 'bg-purple-400/30',
    badgeClass: 'bg-purple-500 text-white'
  },
  green: {
    headerGradient: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
    circleColor: 'bg-green-400/30',
    badgeClass: 'bg-green-500 text-white'
  }
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
  colorTheme,
  isCompleted = false
}: StyledCourseCardProps) {
  const theme = themeConfig[colorTheme];
  
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Styled Header */}
      <div className={`relative h-32 ${theme.headerGradient} overflow-hidden`}>
        {/* Decorative circles */}
        <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${theme.circleColor}`} />
        <div className={`absolute top-8 -right-8 w-12 h-12 rounded-full ${theme.circleColor}`} />
        <div className={`absolute -bottom-6 -left-6 w-20 h-20 rounded-full ${theme.circleColor}`} />
        
        {/* Header content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Badge className={theme.badgeClass}>
              {courseType}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-500 text-white">
                Completed
              </Badge>
            )}
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
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
            <Link to={route}>
              <Button className="w-full fpk-gradient text-white group-hover:shadow-md transition-shadow">
                <Play className="h-4 w-4 mr-2" />
                {progress === 0 ? 'Start Course' : 'Continue Learning'}
              </Button>
            </Link>
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