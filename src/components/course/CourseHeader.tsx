
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, Menu } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import DualLanguageText from '@/components/DualLanguageText';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';

interface CourseHeaderProps {
  title?: string;
  courseTitle?: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  title, 
  courseTitle 
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { goToCourses, goToDashboard } = useContextAwareNavigation();

  // Use provided title, courseTitle, or fall back to default
  const displayTitle = title || courseTitle || t('courses.learningState.title');

  return (
    <div className="sticky top-0 z-30 fpk-gradient h-12 flex-shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-6 h-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-branding-assets/fpk-logo.png" 
            alt="FPK University" 
            className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
          />
          <h1 className="text-sm sm:text-lg font-bold text-white truncate">
            {displayTitle}
          </h1>
          {!isMobile && (
            <Badge className="bg-white/20 text-white border-white/30">
              <DualLanguageText translationKey="common.beta" />
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {!isMobile && <LanguageSwitcher />}
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToDashboard}
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
