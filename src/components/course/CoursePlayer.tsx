
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';

const CoursePlayer: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
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
  );
};

export default CoursePlayer;
