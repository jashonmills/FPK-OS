import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, RotateCcw, X, ChevronLeft, ChevronRight, Clock, 
  CheckCircle, AlertCircle, Settings, Terminal, Menu, MenuIcon, Loader2
} from 'lucide-react';
import { useScormPackage, useScormScos } from '@/hooks/useScormPackages';
import { Scorm12Adapter, Scorm2004Adapter, ScormAPIAdapter, DebugEventType } from '@/lib/scorm/ScormAPIAdapter';
import { ContentTypeIssueBanner, RuntimeIssueBanner } from '@/components/scorm/ErrorBanners';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { buildGenerateUrl } from '@/lib/scorm/urls';
import { useScormLaunchUrl } from '@/lib/scorm/useScormLaunchUrl';
import ScormIframe from '@/components/scorm/ScormIframe';

interface AdvancedScormPlayerProps {
  mode?: 'preview' | 'launch';
}

export const AdvancedScormPlayer: React.FC<AdvancedScormPlayerProps> = ({ mode = 'preview' }) => {
  console.log('🚀 AdvancedScormPlayer component initializing, mode:', mode);
  const { packageId, scoId, enrollmentId: urlEnrollmentId } = useParams();
  console.log('📊 URL params:', { packageId, scoId, enrollmentId: urlEnrollmentId });
  const navigate = useNavigate();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scormAdapterRef = useRef<ScormAPIAdapter | null>(null);
  
  // State management
  const [currentScoIndex, setCurrentScoIndex] = useState(0);
  const [urlProcessed, setUrlProcessed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionData, setSessionData] = useState<any>({});
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [contentTypeWarning, setContentTypeWarning] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Data fetching
  const { package: scormPackage, isLoading: packageLoading } = useScormPackage(packageId || '');
  const { scos, isLoading: scosLoading } = useScormScos(packageId || '');
  
  console.log('📦 Package loading status:', { packageLoading, scormPackage: !!scormPackage });
  console.log('📋 SCOs loading status:', { scosLoading, scosCount: scos.length });

  // Current SCO - safe access with fallback
  const currentSco = scos?.[currentScoIndex];
  const isScorm2004 = scormPackage?.metadata?.manifest?.standard === 'SCORM 2004';
  const effectiveEnrollmentId = urlEnrollmentId || (mode === 'launch' ? 'preview' : undefined);
  
  // Launch URL generation using smart path resolution
  const launchUrl = useScormLaunchUrl(packageId || '', currentSco);

  const handleDebugEvent = useCallback((type: DebugEventType, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setDebugLogs(prev => [...prev.slice(-49), `[${timestamp}] ${icon} ${message}`]);
  }, []);

  const addDebugLog = useCallback((message: string) => {
    handleDebugEvent('info', message);
  }, [handleDebugEvent]);

  // URL processing and SCO selection
  useEffect(() => {
    if (!scos.length || urlProcessed) return;
    
    try {
      console.log('🔄 Processing URL parameters:', { scoId, packageId, scosLength: scos.length });
      
      if (scoId) {
        // Find SCO by ID if provided in URL
        const scoIndex = scos.findIndex(sco => sco.id === scoId);
        if (scoIndex !== -1) {
          setCurrentScoIndex(scoIndex);
          console.log('✅ Selected SCO from URL:', scos[scoIndex].title);
          addDebugLog(`Selected SCO from URL: ${scos[scoIndex].title}`);
        } else {
          console.warn('⚠️ SCO ID not found, using first SCO');
          addDebugLog(`SCO ID not found, using first SCO`);
          setCurrentScoIndex(0);
          // Redirect to first SCO
          if (packageId && scos[0]) {
            navigate(`/scorm/preview/${packageId}/${scos[0].id}`, { replace: true });
          }
        }
      } else if (scos.length > 0) {
        // No SCO ID provided, redirect to first SCO
        setCurrentScoIndex(0);
        console.log('🔄 No SCO ID provided, redirecting to first SCO:', scos[0].title);
        addDebugLog(`No SCO ID provided, redirecting to first SCO: ${scos[0].title}`);
        if (packageId) {
          navigate(`/scorm/preview/${packageId}/${scos[0].id}`, { replace: true });
        }
      }
      setUrlProcessed(true);
    } catch (error) {
      console.error('❌ URL processing error:', error);
      addDebugLog(`URL processing error: ${error}`);
      setCurrentScoIndex(0);
      setUrlProcessed(true);
    }
  }, [scos, scoId, packageId, navigate, urlProcessed, addDebugLog]);

  // Initialize SCORM API adapter
  useEffect(() => {
    if (!currentSco || !packageId || !urlProcessed) {
      console.log('🔄 Skipping API initialization:', { 
        hasCurrentSco: !!currentSco,
        hasPackageId: !!packageId,
        urlProcessed 
      });
      return;
    }

    // Cleanup previous adapter
    if (scormAdapterRef.current) {
      scormAdapterRef.current.cleanup();
    }

    try {
      const enrollmentIdToUse = effectiveEnrollmentId || 'preview';
      console.log('🎯 Initializing SCORM API:', { 
        scoTitle: currentSco.title,
        enrollmentId: enrollmentIdToUse,
        isScorm2004 
      });
      
      // Create appropriate adapter based on SCORM version
      if (isScorm2004) {
        scormAdapterRef.current = new Scorm2004Adapter(
          enrollmentIdToUse,
          currentSco.id,
          handleDebugEvent
        );
      } else {
        scormAdapterRef.current = new Scorm12Adapter(
          enrollmentIdToUse,
          currentSco.id,
          handleDebugEvent
        );
      }

      // Initialize the API
      scormAdapterRef.current.initialize();
      setIsInitialized(true);
      setRuntimeError(null);
    } catch (error: any) {
      handleDebugEvent('error', `SCORM API initialization failed: ${error.message}`);
      setRuntimeError(`API initialization failed: ${error.message}`);
      setIsInitialized(false);
    }

    // Cleanup on unmount or SCO change
    return () => {
      if (scormAdapterRef.current) {
        scormAdapterRef.current.cleanup();
      }
    };
  }, [currentSco, packageId, effectiveEnrollmentId, isScorm2004, handleDebugEvent, urlProcessed]);

  const generateContent = async () => {
    setIsLoadingContent(true);
    
    try {
      handleDebugEvent('info', 'Starting content generation...');
      
      const response = await fetch(buildGenerateUrl(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}` 
        },
        body: JSON.stringify({ packageId })
      });

      const data = await response.json();
      
      if (response.ok && (data?.success || data?.ok)) {
        toast({
          title: "Content Generated",
          description: "✅ SCORM content generated successfully!",
        });
        handleDebugEvent('success', 'Content generation completed successfully');
        
        // Force iframe reload with the new content
        if (iframeRef.current && launchUrl) {
          setIsLoadingContent(false);
          iframeRef.current.src = `${launchUrl}&refresh=${Date.now()}`;
        }
        
        // Clear any content type warnings
        setContentTypeWarning(null);
      } else {
        throw new Error(data?.error || 'Content generation failed');
      }
    } catch (error: any) {
      handleDebugEvent('error', `Content generation failed: ${error.message}`);
      toast({
        title: "Generation Failed",
        description: `❌ Content generation failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Handle iframe loading - removed content validation fetch
  const handleIframeLoad = useCallback(() => {
    if (!currentSco || !launchUrl) return;
    
    handleDebugEvent('success', `SCORM iframe loaded: ${currentSco.title}`);
    handleDebugEvent('info', `Launch URL: ${launchUrl}`);
    setContentTypeWarning(null);
  }, [currentSco, launchUrl, handleDebugEvent]);

  const handleScoNavigation = (index: number) => {
    if (index >= 0 && index < scos.length) {
      const targetSco = scos[index];
      console.log('🧭 Navigating to SCO:', { index, title: targetSco.title });
      navigate(`/scorm/preview/${packageId}/${targetSco.id}`, { replace: true });
      setIsInitialized(false);
      setSidebarCollapsed(true); // Close sidebar on mobile
    }
  };

  const handleRestart = () => {
    setSessionData({});
    setIsInitialized(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    addDebugLog('SCO restarted');
  };

  const handleExit = () => {
    addDebugLog('Exiting player');
    if (mode === 'preview') {
      navigate('/dashboard/scorm/packages');
    } else {
      navigate('/dashboard');
    }
  };

  if (packageLoading || scosLoading || !urlProcessed) {
    console.log('⏳ SCORM Player waiting for data:', { packageLoading, scosLoading, packageId, urlProcessed });
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading SCORM package...</p>
          {!urlProcessed && <p className="text-xs text-muted-foreground">Processing URL parameters...</p>}
          <p className="text-xs text-muted-foreground">Package ID: {packageId}</p>
        </div>
      </div>
    );
  }

  if (!scormPackage || !scos.length || !currentSco) {
    console.log('❌ SCORM Player data missing:', { 
      scormPackage: !!scormPackage, 
      scosLength: scos.length, 
      currentSco: !!currentSco,
      packageId 
    });
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">
            {!scormPackage ? 'SCORM package not found' : 
             !scos.length ? 'No learning content available' : 
             'Invalid content selection'}
          </p>
          <p className="text-sm text-muted-foreground">
            {!scormPackage ? `Package ID: ${packageId}` :
             !scos.length ? 'This package contains no SCOs' :
             'The selected SCO is not available'}
          </p>
          <Button onClick={handleExit}>Back to Packages</Button>
        </div>
      </div>
    );
  }

  console.log('✅ SCORM Player rendering with data:', { 
    packageTitle: scormPackage.title, 
    scosCount: scos.length,
    currentScoIndex,
    launchUrl: !!launchUrl
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm sm:text-base truncate">{scormPackage.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                {mode === 'preview' ? 'Preview Mode' : 'Learning Mode'} •{' '}
                SCO {currentScoIndex + 1} of {scos.length} •{' '}
                {isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2'}
              </p>
              <p className="text-xs text-muted-foreground sm:hidden">
                SCO {currentScoIndex + 1}/{scos.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isInitialized ? "default" : "secondary"} className="hidden sm:inline-flex">
              {isInitialized ? 'API Ready' : 'Initializing...'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugConsole(!showDebugConsole)}
              className="hidden sm:inline-flex"
            >
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* TOC Sidebar */}
        <div className={`${sidebarCollapsed ? 'hidden' : 'block'} w-64 md:w-64 border-r bg-card p-2 sm:p-4 ${sidebarCollapsed ? '' : 'absolute md:relative z-10 h-full md:h-auto'} md:block`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base">Course Contents</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarCollapsed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {scos.map((sco, index) => (
              <div 
                key={sco.id}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentScoIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => {
                  handleScoNavigation(index);
                  setSidebarCollapsed(true); // Close sidebar on mobile after selection
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium truncate">{sco.title}</span>
                  {sco.is_launchable && (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Error Banners */}
          <div className="p-4 pb-0">
            {contentTypeWarning && (
              <ContentTypeIssueBanner
                error={contentTypeWarning}
                onGenerate={generateContent}
                onDismiss={() => setContentTypeWarning(null)}
              />
            )}
            
            {runtimeError && (
              <RuntimeIssueBanner
                error={runtimeError}
                diagnostics={debugLogs.slice(-5)}
                onDismiss={() => setRuntimeError(null)}
              />
            )}
          </div>
          
          {/* Content Frame */}
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full relative">
                {/* Loading Overlay */}
                {isLoadingContent && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Generating SCORM content...</p>
                    </div>
                  </div>
                )}
                
                {launchUrl ? (
                  <ScormIframe
                    launchUrl={launchUrl}
                    onLoaded={() => {
                      console.log("SCORM iframe loaded", launchUrl);
                      handleIframeLoad();
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted/50">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">No Launch URL</p>
                      <p className="text-sm text-muted-foreground">Unable to generate launch URL for this SCO</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Debug Console */}
          {showDebugConsole && (
            <div className="border-t p-4 bg-card max-h-48 overflow-auto">
              <h4 className="font-semibold mb-2">SCORM Debug Console</h4>
              <div className="text-xs font-mono space-y-1">
                {debugLogs.map((log, index) => (
                  <div key={index} className="text-muted-foreground">{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="border-t p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === 0}
                  onClick={() => handleScoNavigation(currentScoIndex - 1)}
                  className="flex-1 sm:flex-none"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentScoIndex === scos.length - 1}
                  onClick={() => handleScoNavigation(currentScoIndex + 1)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <Button variant="outline" size="sm" onClick={handleRestart} className="whitespace-nowrap">
                  <RotateCcw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Restart</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    // Force refresh by reloading the iframe with current launch URL
                    if (iframeRef.current && launchUrl) {
                      iframeRef.current.src = `${launchUrl}&refresh=${Date.now()}`;
                      addDebugLog('🔄 Manual iframe refresh triggered');
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  🔄 <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleExit} className="whitespace-nowrap">
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