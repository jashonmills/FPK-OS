
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';
import DualLanguageText from '@/components/DualLanguageText';

const LearningStateCourse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccessibilityClasses } = useAccessibility();
  const isMobile = useIsMobile();

  useEffect(() => {
    const overview = overviewRef.current;
    if (!overview) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCollapsed(!entry.isIntersecting);
      },
      { 
        rootMargin: '-48px 0px 0px 0px' // Matches sticky header height
      }
    );

    observer.observe(overview);

    return () => observer.disconnect();
  }, []);

  const handleBackToCourses = () => {
    // Fix back navigation to match the actual route
    navigate('/dashboard/learner/my-courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  return (
    <div className={`min-h-screen flex flex-col w-full ${getAccessibilityClasses('container')}`}>
      {/* Sticky Header Bar - always visible with higher z-index */}
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
              onClick={handleBackToCourses}
              className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-4"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {isMobile ? t('common.back') : t('courses.backToCourses')}
            </Button>
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDashboard}
                className="text-white hover:bg-white/20"
              >
                <Menu className="h-4 w-4 mr-1" />
                <DualLanguageText translationKey="nav.dashboard" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area with proper scrolling */}
      <div className="flex-1 relative">
        {/* Course Overview Section - scrolls behind header */}
        <div 
          ref={overviewRef}
          className="bg-white border-b relative z-10"
        >
          <div className="max-w-4xl mx-auto p-3 sm:p-6">
            {/* Navigation breadcrumb - hidden on mobile */}
            {!isMobile && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDashboard}
                  className="text-gray-500 hover:text-gray-700 p-0 h-auto"
                >
                  <DualLanguageText translationKey="nav.dashboard" />
                </Button>
                <span>/</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToCourses}
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
                <Badge className="fpk-gradient text-white text-xs">
                  <DualLanguageText translationKey="common.beta" />
                </Badge>
              </div>
            </div>
            
            <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
              <DualLanguageText translationKey="courses.learningState.description" />
            </p>
            
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                <DualLanguageText translationKey="courses.courseOutline" />
              </h2>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <DualLanguageText translationKey="courses.learningState.outline.intro" />
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <DualLanguageText translationKey="courses.learningState.outline.cognitiveLoad" />
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <DualLanguageText translationKey="courses.learningState.outline.attention" />
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <DualLanguageText translationKey="courses.learningState.outline.memory" />
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                  <DualLanguageText translationKey="courses.learningState.outline.metacognition" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Embedded Course Player - positioned to start after overview */}
        <div className="relative z-20 bg-white" style={{ minHeight: isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 48px)' }}>
          <iframe
            src="https://preview--course-start-kit-react.lovable.app/"
            title={t('courses.learningState.playerTitle')}
            className="w-full h-full border-0"
            style={{ 
              minHeight: isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 48px)',
              height: '100%'
            }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default LearningStateCourse;
