
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';

const LearningStateEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed' | 'timeout'>('connecting');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { updateProgress, currentProgress } = useProgressTracking('learning-state-beta');

  const sendInitMessage = () => {
    if (iframeRef.current?.contentWindow && user?.id) {
      console.log('Sending init handshake to embed (attempt', retryCountRef.current + 1, ')');
      iframeRef.current.contentWindow.postMessage(
        { 
          type: 'INIT', 
          userId: user.id,
          currentProgress: currentProgress 
        }, 
        'https://preview--course-start-kit-react.lovable.app'
      );
      retryCountRef.current += 1;
    }
  };

  const handleReadyReceived = () => {
    console.log('✅ Embed is ready and connected');
    setIsLoading(false);
    setConnectionStatus('connected');
    setError(null);
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  };

  const handleConnectionTimeout = () => {
    console.warn('⚠️ Iframe connection timeout after 30 seconds');
    setConnectionStatus('timeout');
    setIsLoading(false);
    setError('Connection timeout. The learning module may be experiencing issues. Please refresh the page to try again.');
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== 'https://preview--course-start-kit-react.lovable.app') {
        console.warn('🚨 Blocked message from unauthorized origin:', event.origin);
        return;
      }

      const { type, ...data } = event.data;

      try {
        switch (type) {
          case 'READY':
            handleReadyReceived();
            break;

          case 'MODULE_COMPLETE':
            console.log('📚 Module completed:', data.moduleId);
            await updateProgress({
              type: 'module_complete',
              moduleId: data.moduleId,
              timestamp: new Date().toISOString()
            });
            break;

          case 'COURSE_COMPLETE':
            console.log('🎉 Course completed');
            await updateProgress({
              type: 'course_complete',
              completedAt: new Date().toISOString(),
              completed: true
            });
            break;

          case 'PROGRESS_UPDATE':
            console.log('📈 Progress updated:', data.percent);
            await updateProgress({
              type: 'progress_update',
              completionPercentage: data.percent
            });
            break;

          default:
            console.log('❓ Unknown message type:', type, data);
        }
      } catch (error) {
        console.error('💥 Error handling iframe message:', error);
        setError(`Failed to update progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [updateProgress]);

  useEffect(() => {
    // Enhanced iframe load handling with retries and timeout
    const handleIframeLoad = () => {
      console.log('🔄 Iframe loaded, attempting connection...');
      setConnectionStatus('connecting');
      retryCountRef.current = 0;
      
      // Initial connection attempt
      setTimeout(sendInitMessage, 500);
      
      // Set up timeout for connection failure
      initTimeoutRef.current = setTimeout(handleConnectionTimeout, 30000);
      
      // Retry mechanism - attempt connection every 3 seconds for up to 5 tries
      const retryInterval = setInterval(() => {
        if (connectionStatus === 'connected' || retryCountRef.current >= 5) {
          clearInterval(retryInterval);
          return;
        }
        sendInitMessage();
      }, 3000);
    };

    const handleIframeError = () => {
      console.error('💥 Iframe failed to load');
      setConnectionStatus('failed');
      setIsLoading(false);
      setError('Failed to load the learning module. Please check your internet connection and try again.');
    };

    const iframe = iframeRef.current;
    if (iframe && user?.id) {
      iframe.addEventListener('load', handleIframeLoad);
      iframe.addEventListener('error', handleIframeError);
      
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('error', handleIframeError);
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
      };
    }
  }, [user?.id, currentProgress, connectionStatus]);

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
            {connectionStatus === 'timeout' && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded border border-red-300 transition-colors"
              >
                Refresh Page
              </button>
            )}
          </div>
        )}

        {connectionStatus === 'connecting' && isLoading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">
              🔄 Establishing connection with learning module...
              {retryCountRef.current > 0 && ` (Attempt ${retryCountRef.current}/5)`}
            </p>
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
