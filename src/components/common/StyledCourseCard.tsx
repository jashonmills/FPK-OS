import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import actual course background images (same as used in courses)
import linearEquationsBg from '@/assets/linear-equations-unique-bg.jpg';
import trigBg from '@/assets/trigonometry-background.jpg';
import algebraBg from '@/assets/linear-equations-background.jpg'; // Match algebra course background
import logicBg from '@/assets/logic-background.jpg';
import economicsBg from '@/assets/economics-background.jpg';
import neurodiversityBackground from '@/assets/neurodiversity-background.jpg';
import scienceCourseBg from '@/assets/science-course-background.jpg';
import moneyManagementBg from '@/assets/money-management-background.jpg';
import empoweringHandwritingBg from '@/assets/empowering-handwriting-bg.jpg';
import interactiveGeometryBg from '@/assets/interactive-geometry-fundamentals-bg.jpg';
import empoweringNumeracyBg from '@/assets/empowering-numeracy-bg.jpg';
import empoweringReadingBg from '@/assets/empowering-reading-bg.jpg';
import empoweringSpellingBg from '@/assets/empowering-spelling-unique-bg.jpg';
import learningStateBg from '@/assets/learning-state-course-bg.jpg';
import elSpellingBg from '@/assets/el-spelling-course-bg.jpg';

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

// Map course IDs to their images (using actual course background images)
const courseImageMap: Record<string, string> = {
  'interactive-linear-equations': linearEquationsBg,
  'interactive-trigonometry': trigBg,
  'interactive-algebra': algebraBg,
  'logic-critical-thinking': logicBg,
  'introduction-modern-economics': economicsBg,
  'el-spelling-reading': elSpellingBg,
  'empowering-learning-reading': empoweringReadingBg,
  'empowering-learning-numeracy': empoweringNumeracyBg,
  'empowering-learning-handwriting': empoweringHandwritingBg,
  'empowering-learning-spelling': empoweringSpellingBg,
  'neurodiversity-strengths-based-approach': neurodiversityBackground,
  'interactive-science': scienceCourseBg,
  'money-management-teens': moneyManagementBg,
  'geometry': interactiveGeometryBg,
  'learning-state-course': learningStateBg,
};

// Fallback function for courses not in the map
const getCourseImage = (id: string, title: string): string => {
  // Check direct ID mapping first
  if (courseImageMap[id]) {
    return courseImageMap[id];
  }
  
  // Fallback based on title keywords (using actual course background images)
  const titleLower = title.toLowerCase();
  if (titleLower.includes('linear') || titleLower.includes('equation')) return linearEquationsBg;
  if (titleLower.includes('trigonometry') || titleLower.includes('trig')) return trigBg;
  if (titleLower.includes('algebra')) return algebraBg;
  if (titleLower.includes('logic') || titleLower.includes('critical')) return logicBg;
  if (titleLower.includes('economics') || titleLower.includes('economic')) return economicsBg;
  if (titleLower.includes('el spelling') || titleLower.includes('el-spelling')) return elSpellingBg;
  if (titleLower.includes('spelling')) return empoweringSpellingBg;
  if (titleLower.includes('reading')) return empoweringReadingBg;
  if (titleLower.includes('numeracy')) return empoweringNumeracyBg;
  if (titleLower.includes('handwriting') || titleLower.includes('writing')) return empoweringHandwritingBg;
  if (titleLower.includes('neurodiversity') || titleLower.includes('neurodivergent')) return neurodiversityBackground;
  if (titleLower.includes('science') || titleLower.includes('biology') || titleLower.includes('chemistry')) return scienceCourseBg;
  if (titleLower.includes('money') || titleLower.includes('financial') || titleLower.includes('teen')) return moneyManagementBg;
  if (titleLower.includes('geometry')) return interactiveGeometryBg;
  if (titleLower.includes('learning state')) return learningStateBg;
  
  // Default fallback
  return scienceCourseBg;
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
  
  // Check if this is an Empowering Learning course or Learning State Beta
  const isSpecialCourse = [
    'empowering-learning-handwriting',
    'empowering-learning-numeracy', 
    'empowering-learning-reading',
    'empowering-learning-spelling',
    'el-spelling-reading',
    'learning-state-beta'
  ].includes(id);
  
  return (
    <div className="relative">
      {isSpecialCourse && (
        <div className="absolute inset-0 rounded-lg ring-4 ring-purple-400/70 shadow-[0_0_50px_rgba(168,85,247,0.8)] pointer-events-none"></div>
      )}
      <Card className={`h-full hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group relative z-10 ${
        isSpecialCourse 
          ? 'hover:shadow-[0_0_60px_rgba(168,85,247,1)]' 
          : ''
      }`}>
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
    </div>
  );
}