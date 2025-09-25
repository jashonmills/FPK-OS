import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCourseImage } from '@/utils/courseImages';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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

// Course image logic moved to shared utility

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
  const isMobile = useIsMobile();
  
  // Check if this is an Empowering Learning course
  const isSpecialCourse = [
    'empowering-learning-handwriting',
    'empowering-learning-numeracy', 
    'empowering-learning-reading',
    'empowering-learning-spelling',
    'optimal-learning-state',
    '06efda03-9f0b-4c00-a064-eb65ada9fbae', // Native Empowering Learning for Spelling course
    'empowering-learning-australia',
  ].includes(id);
  
  return (
    <div className="relative">
      {isSpecialCourse && (
        <div className="absolute inset-0 rounded-lg ring-4 ring-purple-400/70 shadow-[0_0_50px_rgba(168,85,247,0.8)] pointer-events-none"></div>
      )}
      <Card className={cn(
        `h-full hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group relative z-10`,
        isSpecialCourse 
          ? 'hover:shadow-[0_0_60px_rgba(168,85,247,1)]' 
          : '',
        isMobile ? "min-h-[280px]" : "min-h-[320px]"
      )}>
      {/* AI Generated Image Header */}
      <div 
        className={cn(
          "relative bg-cover bg-center overflow-hidden",
          isMobile ? "h-32" : "h-40"
        )}
        style={{ backgroundImage: `url(${courseImage})` }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Header content */}
        <div className={cn(
          "relative z-10 h-full flex flex-col justify-between",
          isMobile ? "p-3" : "p-6"
        )}>
          <div className="flex justify-between items-start mb-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-xs">
              {courseType}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs">
                Completed
              </Badge>
            )}
          </div>
          
          <div className="flex-1 flex items-end">
            <h3 className={cn(
              "text-white font-bold leading-tight drop-shadow-lg line-clamp-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              {title}
            </h3>
          </div>
        </div>
      </div>

      <CardContent className={cn(
        "flex-1 flex flex-col",
        isMobile ? "p-3" : "p-6"
      )}>
        {/* Description */}
        <p className={cn(
          "text-muted-foreground line-clamp-2 flex-1 mb-4",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {description}
        </p>

        {/* Course details */}
        <div className={cn(
          "space-y-2 mb-4",
          isMobile ? "space-y-2 mb-3" : "space-y-3 mb-4"
        )}>
          <div className={cn(
            "flex justify-between text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {instructor && (
              <div className="flex items-center space-x-1">
                <User className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                <span className="truncate">{instructor}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                <span>{duration} mins</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress section */}
        {isEnrolled && progress !== undefined && (
          <div className={cn(
            "space-y-2 mb-4",
            isMobile ? "space-y-1 mb-3" : "space-y-2 mb-4"
          )}>
            <div className="flex justify-between items-center">
              <span className={cn(
                "font-medium",
                isMobile ? "text-xs" : "text-sm"
              )}>Progress</span>
              <span className={cn(
                "text-muted-foreground",
                isMobile ? "text-xs" : "text-sm"
              )}>{progress}%</span>
            </div>
            <Progress value={progress} className={cn(
              isMobile ? "h-1.5" : "h-2"
            )} />
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto">
          {isEnrolled ? (
            route ? (
              <Link to={route}>
                <Button className={cn(
                  "w-full fpk-gradient text-white group-hover:shadow-md transition-shadow",
                  isMobile ? "h-9 text-sm" : ""
                )}>
                  <Play className={cn(
                    "mr-2",
                    isMobile ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  {progress === 0 ? 'Start Course' : 'Continue Learning'}
                </Button>
              </Link>
            ) : (
              <Button 
                disabled={true}
                className={cn(
                  "w-full fpk-gradient text-white group-hover:shadow-md transition-shadow opacity-50",
                  isMobile ? "h-9 text-sm" : ""
                )}
              >
                <Play className={cn(
                  "mr-2",
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                {progress === 0 ? 'Start Course' : 'Continue Learning'}
              </Button>
            )
          ) : (
            <Button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className={cn(
                "w-full fpk-gradient text-white group-hover:shadow-md transition-shadow",
                isMobile ? "h-9 text-sm" : ""
              )}
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}