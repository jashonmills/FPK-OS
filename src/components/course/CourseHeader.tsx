
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, Menu } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import DualLanguageText from '@/components/DualLanguageText';

interface CourseHeaderProps {
  onBackToCourses: () => void;
  onDashboard: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ onBackToCourses, onDashboard }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-30 fpk-gradient h-12 flex-shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-6 h-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <h1 className="text-sm sm:text-lg font-bold text-white truncate">
            <DualLanguageText translationKey="courses.learningState.title" />
          </h1>
          {!isMobile && (
            <Badge className="bg-white/20 text-white border-white/30">
              <DualLanguageText translationKey="common.beta" />
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {!isMobile && <LanguageSwitcher />}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToCourses}
            className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-4"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {isMobile ? t('common.back') : t('courses.backToCourses')}
          </Button>
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDashboard}
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-4 w-4 mr-1" />
              <DualLanguageText translationKey="nav.dashboard" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
