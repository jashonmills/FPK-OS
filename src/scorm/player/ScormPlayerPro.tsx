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
  const { packageId, scoId, enrollmentId: urlEnrollmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sessionStartTime = useRef<number>(Date.now());
  
  // State management
  const [currentScoIndex, setCurrentScoIndex] = useState(0);
  const [urlProcessed, setUrlProcessed] = useState(false);
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
  const currentSco = scos?.[currentScoIndex];
  
  // Use enrollmentId from URL if in launch mode, otherwise use prop
  const effectiveEnrollmentId = urlEnrollmentId || enrollmentId;

  // Determine SCORM standard
  const isScorm2004 = scormPackage?.scorm_version === '2004' || scormPackage?.standard === 'SCORM 2004';
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

  // URL processing and SCO selection
  useEffect(() => {
    if (!scos.length || urlProcessed) return;
    
    try {
      if (scoId) {
        // Find SCO by ID if provided in URL
        const scoIndex = scos.findIndex(sco => sco.id === scoId);
        if (scoIndex !== -1) {
          setCurrentScoIndex(scoIndex);
          addDebugLog('info', 'navigation', `Selected SCO from URL: ${scos[scoIndex].title}`, { scoId, scoIndex });
        } else {
          addDebugLog('warn', 'navigation', `SCO ID not found, using first SCO`, { scoId });
          setCurrentScoIndex(0);
          // Redirect to first SCO
          if (packageId && scos[0]) {
            navigate(`/scorm/preview/${packageId}/${scos[0].id}`, { replace: true });
          }
        }
      } else if (scos.length > 0) {
        // No SCO ID provided, redirect to first SCO
        setCurrentScoIndex(0);
        addDebugLog('info', 'navigation', `No SCO ID provided, redirecting to first SCO: ${scos[0].title}`);
        if (packageId) {
          navigate(`/scorm/preview/${packageId}/${scos[0].id}`, { replace: true });
        }
      }
      setUrlProcessed(true);
    } catch (error) {
      addDebugLog('error', 'navigation', 'URL processing error', error);
      setCurrentScoIndex(0);
      setUrlProcessed(true);
    }
  }, [scos, scoId, packageId, navigate, urlProcessed, addDebugLog]);

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

  // Enhanced SCORM API handlers with analytics
  const handleCommit = useCallback(async (cmiData: any) => {
    try {
      addDebugLog('info', 'api', 'Committing CMI data...', { elements: Object.keys(cmiData).length });
      
      const startTime = Date.now();
      if (!currentSco) {
        addDebugLog('error', 'api', 'No current SCO available for commit');
        throw new Error('No current SCO available');
      }

      const { data, error } = await supabase.functions.invoke('scorm-runtime-production', {
        body: { 
          action: 'commit',
          enrollmentId: effectiveEnrollmentId || 'preview',
          scoId: currentSco.id,
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
  }, [effectiveEnrollmentId, currentSco?.id, addDebugLog, toast]);

  const handleFinish = useCallback(async (cmiData: any) => {
    try {
      addDebugLog('info', 'api', 'Terminating SCORM session...');
      
      // Final commit
      await handleCommit(cmiData);
      
      if (!currentSco) {
        addDebugLog('error', 'api', 'No current SCO available for termination');
        return;
      }

      // Terminate session
      const { error } = await supabase.functions.invoke('scorm-runtime-production', {
        body: { 
          action: 'terminate',
          enrollmentId: effectiveEnrollmentId || 'preview',
          scoId: currentSco.id,
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
  }, [handleCommit, mode, toast, effectiveEnrollmentId, currentSco?.id, addDebugLog]);

  // Enhanced SCORM API initialization with postMessage bridge
  useEffect(() => {
    if (!currentSco || !iframeRef.current?.contentWindow || !urlProcessed) return;

    const initializeAPI = async () => {
      try {
        addDebugLog('info', 'player', `Initializing ${scormVersion} API for SCO: ${currentSco.title}`);
        
        // Initialize runtime session
        const { data: initData, error } = await supabase.functions.invoke('scorm-runtime-production', {
          body: {
            action: 'initialize',
            enrollmentId: effectiveEnrollmentId || 'preview',
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
  }, [currentSco, isScorm2004, scormVersion, handleCommit, handleFinish, effectiveEnrollmentId, addDebugLog, toast, urlProcessed]);

  // Navigation handlers
  const handleScoNavigation = useCallback((index: number) => {
    if (index >= 0 && index < scos.length && index !== currentScoIndex) {
      const targetSco = scos[index];
      addDebugLog('info', 'navigation', `Navigating to SCO ${index + 1}: ${targetSco.title}`);
      
      // Update URL to reflect navigation
      if (packageId && targetSco) {
        navigate(`/scorm/preview/${packageId}/${targetSco.id}`, { replace: true });
      }
      
      setCurrentScoIndex(index);
      setIsInitialized(false);
      setApiCallCount(0);
    }
  }, [scos, currentScoIndex, addDebugLog, navigate, packageId]);

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
      navigate('/dashboard/scorm/studio');
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

  if (packageLoading || scosLoading || !urlProcessed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading SCORM package...</p>
          {!urlProcessed && <p className="text-sm text-muted-foreground mt-2">Processing URL parameters...</p>}
        </div>
      </div>
    );
  }

  if (!scormPackage || !scos.length || !currentSco) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">
            {!scormPackage ? 'Package Not Found' : 
             !scos.length ? 'No SCOs Available' : 
             'Invalid SCO Selection'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {!scormPackage ? 'The requested SCORM package could not be loaded.' :
             !scos.length ? 'This SCORM package contains no learning content.' :
             'The selected learning object is not available.'}
          </p>
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
            <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTOC(!showTOC)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="font-semibold text-sm lg:text-lg truncate">{scormPackage.title}</h1>
                  <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground flex-wrap">
                    <span className="hidden sm:inline">{mode === 'preview' ? 'Preview Mode' : 'Learning Mode'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>SCO {currentScoIndex + 1}/{scos.length}</span>
                    <span className="hidden lg:inline">•</span>
                    <span className="hidden lg:inline">{scormVersion}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(sessionTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
              {/* Progress and Score Display */}
              <div className="hidden lg:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Progress value={progressPercentage} className="w-16 lg:w-20" />
                  <span className="text-xs lg:text-sm">{progressPercentage}%</span>
                </div>
                
                {currentScore !== null && (
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-600" />
                    <span className="text-xs lg:text-sm">{currentScore}%</span>
                  </div>
                )}
                
                <Badge 
                  variant={completionStatus === 'completed' || completionStatus === 'passed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {completionStatus}
                </Badge>
              </div>

              {/* Mobile Progress */}
              <div className="flex lg:hidden items-center gap-1">
                <Progress value={progressPercentage} className="w-12" />
                <span className="text-xs">{progressPercentage}%</span>
              </div>

              {/* API Status */}
              <Badge 
                variant={isInitialized ? "default" : "secondary"}
                className="text-xs hidden sm:flex"
              >
                {isInitialized ? 'Ready' : 'Init...'}
              </Badge>
              
              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hidden sm:flex"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="hidden sm:flex"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugConsole(!showDebugConsole)}
                >
                  <Terminal className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Mobile-Responsive TOC Sidebar */}
        {showTOC && (
          <div className={`${showTOC ? 'w-80' : 'w-0'} lg:w-80 border-r bg-card flex flex-col transition-all duration-200 ${showTOC ? 'absolute lg:relative z-10 lg:z-0' : 'hidden lg:flex'} h-full lg:h-auto`}>
            <div className="p-3 lg:p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm lg:text-base">Course Contents</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTOC(false)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground mt-1">
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
                      className={`p-2 lg:p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                        isCurrent ? 'bg-primary text-primary-foreground shadow-sm' : status.bgColor
                      }`}
                      onClick={() => {
                        handleScoNavigation(index);
                        // Close sidebar on mobile after selection
                        if (window.innerWidth < 1024) {
                          setShowTOC(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                          <StatusIcon className={`h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0 ${isCurrent ? 'text-primary-foreground' : status.color}`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs lg:text-sm font-medium truncate ${isCurrent ? 'text-primary-foreground' : ''}`}>
                              {sco.title}
                            </p>
                            <p className={`text-xs ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'} hidden lg:block`}>
                              SCO {index + 1} • {sco.scorm_type?.toUpperCase() || 'SCO'}
                            </p>
                          </div>
                        </div>
                        
                        {sco.mastery_score && (
                          <div className={`text-xs ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'} hidden lg:block`}>
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
          <div className="flex-1 p-2 lg:p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  key={`${packageId}-${currentScoIndex}-${Date.now()}`}
                  src={`/api/scorm/content/${packageId}/${currentSco?.launch_href?.replace(/^packages\/[^\/]+\//, '') || 'content/index.html'}`}
                  className="w-full h-full border-none rounded-lg"
                  title={`SCORM Content - ${currentSco?.title}`}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads"
                  allow="fullscreen; autoplay; microphone; camera"
                />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Debug Console */}
          {showDebugConsole && (
            <ScormDebugConsole
              debugLogs={debugLogs}
              cmiData={currentSco ? sessionData[currentSco.id] || {} : {}}
              apiCallCount={apiCallCount}
              sessionDuration={sessionTime}
              onClearLogs={() => setDebugLogs([])}
            />
          )}

          {/* Enhanced Mobile-Responsive Controls */}
          <div className="border-t p-2 lg:p-4 bg-card">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 lg:gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === 0}
                  onClick={() => handleScoNavigation(currentScoIndex - 1)}
                  className="text-xs lg:text-sm"
                >
                  <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === scos.length - 1}
                  onClick={() => handleScoNavigation(currentScoIndex + 1)}
                  className="text-xs lg:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 ml-1" />
                </Button>
              </div>
              
              {/* Middle: Current SCO Info */}
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span className="truncate max-w-48">{currentSco?.title}</span>
                {currentSco?.mastery_score && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Target: {currentSco.mastery_score}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 lg:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRestart}
                  className="text-xs lg:text-sm"
                >
                  <RotateCcw className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                  <span className="hidden sm:inline">Restart SCO</span>
                  <span className="sm:hidden">Restart</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExit}
                  className="text-xs lg:text-sm"
                >
                  <span className="hidden sm:inline">Exit Course</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};