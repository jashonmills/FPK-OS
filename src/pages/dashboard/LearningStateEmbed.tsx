
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import { useCleanup } from '@/utils/cleanupManager';

const LearningStateEmbed = () => {
  const cleanup = useCleanup('LearningStateEmbed');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { updateProgress, currentProgress } = useProgressTracking('empowering-learning-state');

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== 'https://preview--course-start-kit-react.lovable.app') {
        return;
      }

      const { type, ...data } = event.data;

      try {
        switch (type) {
          case 'READY':
            console.log('Embed is ready');
            setIsLoading(false);
            break;

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

          default:
            console.log('Unknown message type:', type);
        }
      } catch (error) {
        console.error('Error handling message:', error);
        setError('Failed to update progress');
      }
    };

    cleanup.addEventListener(window, 'message', handleMessage);
  }, [updateProgress, cleanup]);

  useEffect(() => {
    // Send initialization handshake when iframe loads
    const handleIframeLoad = () => {
      if (iframeRef.current?.contentWindow && user?.id) {
        console.log('Sending init handshake to embed');
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
      cleanup.addEventListener(iframe, 'load', handleIframeLoad);
    }
  }, [user?.id, currentProgress, cleanup]);

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/my-courses');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b p-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToCourses}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <DualLanguageText translationKey="courses.backToCourses" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <DualLanguageText translationKey="courses.learningState.title" />
            </h1>
            <p className="text-sm text-gray-600">
              <DualLanguageText translationKey="courses.learningState.description" />
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">
                <DualLanguageText translationKey="common.loading" />
              </p>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src="https://preview--course-start-kit-react.lovable.app/"
          title={t('courses.learningState.playerTitle')}
          className="w-full h-full border-0"
          allow="clipboard-write; encrypted-media; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{ minHeight: '600px' }}
        />
      </div>
    </div>
  );
};

export default LearningStateEmbed;
