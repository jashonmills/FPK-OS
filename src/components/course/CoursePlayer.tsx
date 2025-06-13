
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const CoursePlayer: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const { updateProgress, currentProgress } = useProgressTracking('learning-state-beta');

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== 'https://preview--course-start-kit-react.lovable.app') {
        return;
      }

      const { type, ...data } = event.data;
      console.log('CoursePlayer received message:', { type, data });

      try {
        switch (type) {
          case 'MODULE_COMPLETE':
            console.log('Module completed:', data.moduleId);
            await updateProgress({
              type: 'module_complete',
              moduleId: data.moduleId,
              timestamp: new Date().toISOString()
            });
            break;

          case 'COURSE_COMPLETE':
            console.log('Course completed');
            await updateProgress({
              type: 'course_complete',
              completedAt: new Date().toISOString(),
              completed: true
            });
            break;

          case 'PROGRESS_UPDATE':
            console.log('Progress updated:', data.percent);
            await updateProgress({
              type: 'progress_update',
              completionPercentage: data.percent
            });
            break;

          case 'READY':
            console.log('Course player is ready');
            // Send initialization data to the iframe
            if (iframeRef.current?.contentWindow && user?.id) {
              iframeRef.current.contentWindow.postMessage(
                { 
                  type: 'INIT', 
                  userId: user.id,
                  currentProgress: currentProgress 
                }, 
                'https://preview--course-start-kit-react.lovable.app'
              );
            }
            break;

          default:
            console.log('Unknown message type:', type);
        }
      } catch (error) {
        console.error('Error handling course player message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [updateProgress, user?.id, currentProgress]);

  // Send initialization handshake when iframe loads
  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current?.contentWindow && user?.id) {
        console.log('Sending init handshake to course player');
        iframeRef.current.contentWindow.postMessage(
          { 
            type: 'INIT', 
            userId: user.id,
            currentProgress: currentProgress 
          }, 
          'https://preview--course-start-kit-react.lovable.app'
        );
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      return () => iframe.removeEventListener('load', handleIframeLoad);
    }
  }, [user?.id, currentProgress]);

  return (
    <div className="relative z-20 bg-white" style={{ minHeight: isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 48px)' }}>
      <iframe
        ref={iframeRef}
        src="https://preview--course-start-kit-react.lovable.app/"
        title={t('courses.learningState.playerTitle')}
        className="w-full h-full border-0"
        style={{ 
          minHeight: isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 48px)',
          height: '100%'
        }}
        allowFullScreen
        allow="clipboard-write; encrypted-media; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default CoursePlayer;
