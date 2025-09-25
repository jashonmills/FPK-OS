
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLanguageConsistency } from '@/hooks/useLanguageConsistency';
import { iframeAnalytics } from '@/utils/iframeAnalytics';
import { useCleanup } from '@/utils/cleanupManager';
import { logger } from '@/utils/logger';

import { Loader2 } from 'lucide-react';

interface CoursePlayerProps {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ onProgress, onComplete }) => {
  const cleanup = useCleanup('CoursePlayer');
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const { updateProgress, currentProgress } = useProgressTracking('optimal-learning-state');
  const { trackPageView } = useAnalytics({ courseId: 'optimal-learning-state' });
  const { safeT, getCurrentLanguageInfo } = useLanguageConsistency({
    maintainRouteOnLanguageChange: true,
    logMissingKeys: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track page view on mount
  useEffect(() => {
    trackPageView('course_player', {
      course_id: 'optimal-learning-state',
      is_mobile: isMobile
    });
  }, [trackPageView, isMobile]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== 'https://preview--course-start-kit-react.lovable.app') {
        return;
      }

      const { type, ...data } = event.data;
      logger.info('CoursePlayer received message', 'COURSE_PLAYER', { type, data });

      try {
        switch (type) {
          case 'MODULE_COMPLETE':
            logger.info('Module completed', 'COURSE_PLAYER', { moduleId: data.moduleId });
            await updateProgress({
              type: 'module_complete',
              moduleId: data.moduleId,
              timestamp: new Date().toISOString()
            });
            onComplete?.();
            break;

          case 'COURSE_COMPLETE':
            logger.info('Course completed', 'COURSE_PLAYER');
            await updateProgress({
              type: 'course_complete',
              completedAt: new Date().toISOString(),
              completed: true
            });
            onComplete?.();
            break;

          case 'PROGRESS_UPDATE':
            logger.info('Progress updated', 'COURSE_PLAYER', { percent: data.percent });
            await updateProgress({
              type: 'progress_update',
              completionPercentage: data.percent
            });
            onProgress?.(data.percent);
            break;

          case 'READY':
            logger.info('Course player is ready', 'COURSE_PLAYER');
            setIsLoading(false);
            setError(null);
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
            logger.warn('Unknown message type', 'COURSE_PLAYER', { type });
        }
      } catch (error) {
        logger.error('Error handling course player message', 'COURSE_PLAYER', error);
        setError('Failed to communicate with course content');
      }
    };

    const messageListenerId = cleanup.addEventListener(window, 'message', handleMessage);

    return () => {
      cleanup.cleanup(messageListenerId);
    };
  }, [updateProgress, user?.id, currentProgress, onProgress, onComplete]);

  // Handle iframe load event
  useEffect(() => {
    const handleIframeLoad = () => {
      logger.info('Iframe loaded successfully', 'COURSE_PLAYER');
      // Give the iframe a moment to initialize before sending messages
      cleanup.setTimeout(() => {
        if (iframeRef.current?.contentWindow && user?.id) {
          logger.info('Sending init handshake to course player', 'COURSE_PLAYER');
          iframeRef.current.contentWindow.postMessage(
            { 
              type: 'INIT', 
              userId: user.id,
              currentProgress: currentProgress 
            }, 
            'https://preview--course-start-kit-react.lovable.app'
          );
        }
      }, 1000);
    };

    const handleIframeError = () => {
      logger.error('Iframe failed to load', 'COURSE_PLAYER');
      setIsLoading(false);
      setError('Failed to load course content. Please check your internet connection and try again.');
    };

    const iframe = iframeRef.current;
    if (iframe) {
      const loadListenerId = cleanup.addEventListener(iframe, 'load', handleIframeLoad);
      const errorListenerId = cleanup.addEventListener(iframe, 'error', handleIframeError);
      
      // Set a timeout to handle cases where the iframe never loads
      const timeoutId = cleanup.setTimeout(() => {
        if (isLoading) {
          logger.warn('Iframe load timeout', 'COURSE_PLAYER');
          setIsLoading(false);
          setError('Course content is taking too long to load. Please refresh the page.');
        }
      }, 15000);

      return () => {
        cleanup.cleanup(loadListenerId);
        cleanup.cleanup(errorListenerId);
        cleanup.cleanup(timeoutId);
      };
    }
  }, [user?.id, currentProgress, isLoading]);

  const minHeight = isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 48px)';

  return (
    <div className="relative z-20 bg-white" style={{ minHeight }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading course content...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Loading Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="https://preview--course-start-kit-react.lovable.app/"
        title={String(safeT('courses.learningState.playerTitle', 'Course Player'))}
        className="w-full h-full border-0 ui-polish-container"
        style={{ 
          minHeight,
          height: '100%'
        }}
        allowFullScreen
        allow="clipboard-write; encrypted-media; fullscreen; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default CoursePlayer;
