import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, RotateCcw, X, ChevronLeft, ChevronRight, Clock, 
  CheckCircle, AlertCircle, Settings, Terminal, Menu, Maximize,
  Volume2, VolumeX, BookOpen, Target, Award, Timer
} from 'lucide-react';
import { createScorm12API } from '@/scorm/runtime/scorm12';
import { createScorm2004API } from '@/scorm/runtime/scorm2004';
import { useScormPackage, useScormScos } from '@/hooks/useScormPackages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScormDebugConsole } from '@/scorm/player/ScormDebugConsole';

interface ScormPlayerProProps {
  mode?: 'preview' | 'launch' | 'review';
  enrollmentId?: string;
}

export const ScormPlayerPro: React.FC<ScormPlayerProProps> = ({ 
  mode = 'preview',
  enrollmentId 
}) => {
  const { packageId, scoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sessionStartTime = useRef<number>(Date.now());
  
  // State management
  const [currentScoIndex, setCurrentScoIndex] = useState(0);
  const [sessionData, setSessionData] = useState<any>({});
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [showTOC, setShowTOC] = useState(true);
  const [debugLogs, setDebugLogs] = useState<Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    category: string;
    message: string;
    data?: any;
  }>>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [completionStatus, setCompletionStatus] = useState<string>('not attempted');
  const [apiCallCount, setApiCallCount] = useState(0);

  // Data fetching
  const { package: scormPackage, isLoading: packageLoading } = useScormPackage(packageId || '');
  const { scos, isLoading: scosLoading } = useScormScos(packageId || '');
  const currentSco = scos[currentScoIndex];
  // Runtime data will be fetched via API calls

  // Determine SCORM standard
  const isScorm2004 = scormPackage?.standard === 'SCORM 2004';
  const scormVersion = isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2';

  // Progress calculation
  const progressPercentage = useMemo(() => {
    if (!scos.length) return 0;
    const completedScos = scos.filter(sco => {
      const status = sessionData[sco.id]?.status || 'not attempted';
      return status === 'completed' || status === 'passed';
    });
    return Math.round((completedScos.length / scos.length) * 100);
  }, [scos, sessionData]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format session time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced debug logging
  const addDebugLog = useCallback((
    level: 'info' | 'warn' | 'error' | 'debug',
    category: string,
    message: string,
    data?: any
  ) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    };
    
    setDebugLogs(prev => [...prev.slice(-99), logEntry]);
    
    // Log to browser console as well
    console.log(`[SCORM ${level.toUpperCase()}] ${category}: ${message}`, data || '');
  }, []);

  // Enhanced SCORM API handlers with analytics
  const handleCommit = useCallback(async (cmiData: any) => {
    try {
      addDebugLog('info', 'api', 'Committing CMI data...', { elements: Object.keys(cmiData).length });
      
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('scorm-runtime-production', {
        body: { 
          action: 'commit',
          enrollmentId: enrollmentId || 'preview',
          scoId: currentSco?.id,
          cmiData
        }
      });
      
      const duration = Date.now() - startTime;
      setApiCallCount(prev => prev + 1);
      
      if (error) {
        addDebugLog('error', 'api', 'Commit failed', { error, duration });
        throw error;
      }
      
      addDebugLog('info', 'api', `Data committed successfully (${duration}ms)`);
      
      // Update local session data
      if (currentSco) {
        setSessionData(prev => ({
          ...prev,
          [currentSco.id]: {
            ...prev[currentSco.id],
            ...cmiData,
            lastCommit: new Date().toISOString()
          }
        }));
        
        // Update progress indicators
        if (cmiData['cmi.core.score.raw'] || cmiData['cmi.score.raw']) {
          setCurrentScore(parseFloat(cmiData['cmi.core.score.raw'] || cmiData['cmi.score.raw']));
        }
        
        if (cmiData['cmi.core.lesson_status'] || cmiData['cmi.completion_status']) {
          setCompletionStatus(cmiData['cmi.core.lesson_status'] || cmiData['cmi.completion_status']);
        }
      }
      
    } catch (error: any) {
      addDebugLog('error', 'api', `Commit error: ${error.message}`, error);
      toast({
        title: "Commit Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [enrollmentId, currentSco?.id, addDebugLog, toast]);

  const handleFinish = useCallback(async (cmiData: any) => {
    try {
      addDebugLog('info', 'api', 'Terminating SCORM session...');
      
      // Final commit
      await handleCommit(cmiData);
      
      // Terminate session
      const { error } = await supabase.functions.invoke('scorm-runtime-production', {
        body: { 
          action: 'terminate',
          enrollmentId: enrollmentId || 'preview',
          scoId: currentSco?.id,
          cmiData
        }
      });
      
      if (error) throw error;
      
      addDebugLog('info', 'api', 'Session terminated successfully');
      setIsInitialized(false);
      
      if (mode === 'launch') {
        toast({
          title: "Session Complete",
          description: "Your progress has been saved successfully.",
        });
      }
      
    } catch (error: any) {
      addDebugLog('error', 'api', `Termination error: ${error.message}`, error);
    }
  }, [handleCommit, mode, toast, enrollmentId, currentSco?.id, addDebugLog]);

  // Enhanced SCORM API initialization with postMessage bridge
  useEffect(() => {
    if (!currentSco || !iframeRef.current?.contentWindow) return;

    const initializeAPI = async () => {
      try {
        addDebugLog('info', 'player', `Initializing ${scormVersion} API for SCO: ${currentSco.title}`);
        
        // Initialize runtime session
        const { data: initData, error } = await supabase.functions.invoke('scorm-runtime-production', {
          body: {
            action: 'initialize',
            enrollmentId: enrollmentId || 'preview',
            scoId: currentSco.id
          }
        });

        if (error) {
          addDebugLog('error', 'player', 'Failed to initialize runtime session', error);
          return;
        }

        // Create appropriate API based on SCORM version
        const apiHandlers = {
          onCommit: handleCommit,
          [isScorm2004 ? 'onTerminate' : 'onFinish']: handleFinish
        };

        const api = isScorm2004 
          ? createScorm2004API(initData?.cmiData, apiHandlers)
          : createScorm12API(initData?.cmiData, apiHandlers);

        // Inject API into iframe
        const iframe = iframeRef.current?.contentWindow as any;
        if (iframe) {
          // Set the appropriate API object
          if (isScorm2004) {
            iframe.API_1484_11 = api;
          } else {
            iframe.API = api;
          }
          
          // Enhanced postMessage bridge for cross-origin scenarios
          const messageHandler = (event: MessageEvent) => {
            if (event.source !== iframe) return;
            
            const { type, method, args, id } = event.data;
            
            if (type === 'scorm-api-call' && method && api[method]) {
              try {
                addDebugLog('debug', 'api', `${method} called via postMessage`, args);
                const result = api[method](...(args || []));
                iframe.postMessage({ 
                  type: 'scorm-api-response', 
                  id, 
                  result 
                }, '*');
                setApiCallCount(prev => prev + 1);
              } catch (error: any) {
                addDebugLog('error', 'api', `postMessage API error: ${error.message}`, { method, args });
                iframe.postMessage({ 
                  type: 'scorm-api-error', 
                  id, 
                  error: error.message 
                }, '*');
              }
            }
          };

          window.addEventListener('message', messageHandler);
          
          // Cleanup
          return () => {
            window.removeEventListener('message', messageHandler);
          };
        }

        addDebugLog('info', 'player', `${scormVersion} API initialized successfully`);
        setIsInitialized(true);
        
        // Load existing runtime data if resuming
        if (initData?.cmiData && Object.keys(initData.cmiData).length > 0) {
          addDebugLog('info', 'player', 'Resuming with existing runtime data', { 
            elementCount: Object.keys(initData.cmiData).length 
          });
          
          if (currentSco) {
            setSessionData(prev => ({
              ...prev,
              [currentSco.id]: initData.cmiData
            }));
          }
        }
        
      } catch (error: any) {
        addDebugLog('error', 'player', 'API initialization failed', error);
        toast({
          title: "Initialization Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    // Delay to ensure iframe is fully loaded
    const timer = setTimeout(initializeAPI, 1500);
    return () => clearTimeout(timer);
  }, [currentSco, isScorm2004, scormVersion, handleCommit, handleFinish, enrollmentId, addDebugLog, toast]);

  // Navigation handlers
  const handleScoNavigation = useCallback((index: number) => {
    if (index >= 0 && index < scos.length && index !== currentScoIndex) {
      addDebugLog('info', 'navigation', `Navigating to SCO ${index + 1}: ${scos[index].title}`);
      setCurrentScoIndex(index);
      setIsInitialized(false);
      setApiCallCount(0);
    }
  }, [scos, currentScoIndex, addDebugLog]);

  const handleRestart = useCallback(() => {
    addDebugLog('info', 'player', 'Restarting current SCO');
    setSessionData(prev => ({
      ...prev,
      [currentSco?.id || '']: {}
    }));
    setIsInitialized(false);
    setApiCallCount(0);
    setCurrentScore(null);
    setCompletionStatus('not attempted');
    
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, [currentSco?.id, addDebugLog]);

  const handleExit = useCallback(() => {
    addDebugLog('info', 'player', 'Exiting SCORM player');
    
    if (mode === 'preview') {
      navigate(-1);
    } else {
      navigate('/scorm/studio');
    }
  }, [mode, navigate, addDebugLog]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Get SCO status icon and color
  const getScoStatus = useCallback((sco: any, index: number) => {
    const status = sessionData[sco.id]?.status || 'not attempted';
    const isCurrent = index === currentScoIndex;
    
    switch (status) {
      case 'completed':
      case 'passed':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'failed':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'incomplete':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      default:
        return { 
          icon: BookOpen, 
          color: isCurrent ? 'text-primary' : 'text-gray-400', 
          bgColor: isCurrent ? 'bg-primary/10' : 'bg-gray-50' 
        };
    }
  }, [sessionData, currentScoIndex]);

  if (packageLoading || scosLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading SCORM package...</p>
        </div>
      </div>
    );
  }

  if (!scormPackage || !scos.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Package Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested SCORM package could not be loaded.</p>
          <Button onClick={handleExit}>Return to Studio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTOC(!showTOC)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="font-semibold text-lg">{scormPackage.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{mode === 'preview' ? 'Preview Mode' : 'Learning Mode'}</span>
                    <span>•</span>
                    <span>SCO {currentScoIndex + 1} of {scos.length}</span>
                    <span>•</span>
                    <span>{scormVersion}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(sessionTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Progress and Score Display */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Progress value={progressPercentage} className="w-20" />
                  <span>{progressPercentage}%</span>
                </div>
                
                {currentScore !== null && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span>{currentScore}%</span>
                  </div>
                )}
                
                <Badge variant={completionStatus === 'completed' || completionStatus === 'passed' ? 'default' : 'secondary'}>
                  {completionStatus}
                </Badge>
              </div>

              {/* API Status */}
              <Badge variant={isInitialized ? "default" : "secondary"}>
                {isInitialized ? 'API Ready' : 'Initializing...'}
              </Badge>
              
              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugConsole(!showDebugConsole)}
                >
                  <Terminal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced TOC Sidebar */}
        {showTOC && (
          <div className="w-80 border-r bg-card flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-2">Course Contents</h3>
              <div className="text-sm text-muted-foreground">
                Progress: {progressPercentage}% Complete
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {scos.map((sco, index) => {
                  const status = getScoStatus(sco, index);
                  const StatusIcon = status.icon;
                  const isCurrent = index === currentScoIndex;
                  
                  return (
                    <div 
                      key={sco.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                        isCurrent ? 'bg-primary text-primary-foreground shadow-sm' : status.bgColor
                      }`}
                      onClick={() => handleScoNavigation(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <StatusIcon className={`h-4 w-4 flex-shrink-0 ${isCurrent ? 'text-primary-foreground' : status.color}`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary-foreground' : ''}`}>
                              {sco.title}
                            </p>
                            <p className={`text-xs ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                              SCO {index + 1} • {sco.scorm_type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        
                        {sco.mastery_score && (
                          <div className={`text-xs ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            <Target className="h-3 w-3 inline mr-1" />
                            {sco.mastery_score}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Frame */}
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  src={`${window.location.origin}/scorm-content/${packageId}/${currentSco?.launch_href || 'index.html'}`}
                  className="w-full h-full border-none rounded-lg"
                  title={`SCORM Content - ${currentSco?.title}`}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  allow="fullscreen"
                />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Debug Console */}
          {showDebugConsole && (
            <ScormDebugConsole
              logs={debugLogs}
              cmiData={currentSco ? sessionData[currentSco.id] || {} : {}}
              apiCallCount={apiCallCount}
              sessionDuration={sessionTime}
              onClearLogs={() => setDebugLogs([])}
            />
          )}

          {/* Enhanced Controls */}
          <div className="border-t p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === 0}
                  onClick={() => handleScoNavigation(currentScoIndex - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === scos.length - 1}
                  onClick={() => handleScoNavigation(currentScoIndex + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Middle: Current SCO Info */}
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span>{currentSco?.title}</span>
                {currentSco?.mastery_score && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Target: {currentSco.mastery_score}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart SCO
                </Button>
                <Button variant="outline" size="sm" onClick={handleExit}>
                  Exit Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};