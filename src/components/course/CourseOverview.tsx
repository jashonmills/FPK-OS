
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DualLanguageText from '@/components/DualLanguageText';
import CourseOutline from './CourseOutline';
import { shouldShowBetaFeatures } from '@/lib/featureFlags';

interface CourseOverviewProps {
  onDashboard: () => void;
  onBackToCourses: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ onDashboard, onBackToCourses }) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white border-b relative z-10">
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        {/* Navigation breadcrumb - hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDashboard}
              className="text-gray-500 hover:text-gray-700 p-0 h-auto"
            >
              <DualLanguageText translationKey="nav.dashboard" />
            </Button>
            <span>/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToCourses}
              className="text-gray-500 hover:text-gray-700 p-0 h-auto"
            >
              <DualLanguageText translationKey="nav.courses" />
            </Button>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              <DualLanguageText translationKey="courses.learningState.title" />
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
            <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              <DualLanguageText translationKey="courses.learningState.title" />
            </h1>
            {shouldShowBetaFeatures() && (
              <Badge className="fpk-gradient text-white text-xs">
                <DualLanguageText translationKey="common.beta" />
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
          <DualLanguageText translationKey="courses.learningState.description" />
        </p>
        
        <CourseOutline />
      </div>
    </div>
  );
};

export default CourseOverview;
