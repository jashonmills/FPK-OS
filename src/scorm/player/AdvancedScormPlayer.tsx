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
import { useScormLaunchUrl } from '@/lib/scorm/useScormLaunchUrl';
import { Scorm12Adapter, Scorm2004Adapter, ScormAPIAdapter, DebugEventType } from '@/lib/scorm/ScormAPIAdapter';
import { ContentTypeIssueBanner, RuntimeIssueBanner } from '@/components/scorm/ErrorBanners';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdvancedScormPlayerProps {
  mode?: 'preview' | 'launch';
}

export const AdvancedScormPlayer: React.FC<AdvancedScormPlayerProps> = ({ mode = 'preview' }) => {
  const { packageId, scoId, enrollmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scormAdapterRef = useRef<ScormAPIAdapter | null>(null);
  
  // State management
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

  // Current SCO - handle both direct SCO access and package-level access
  const targetScoId = scoId;
  const currentScoIndex = targetScoId ? scos.findIndex(sco => sco.id === targetScoId) : 0;
  const currentSco = scos[Math.max(0, currentScoIndex)];
  const isScorm2004 = scormPackage?.metadata?.manifest?.standard === 'SCORM 2004';
  
  // Launch URL generation
  const launchUrl = useScormLaunchUrl(packageId || '', currentSco);

  const handleDebugEvent = useCallback((type: DebugEventType, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setDebugLogs(prev => [...prev.slice(-49), `[${timestamp}] ${icon} ${message}`]);
  }, []);

  const addDebugLog = useCallback((message: string) => {
    handleDebugEvent('info', message);
  }, [handleDebugEvent]);

  // Initialize SCORM API adapter
  useEffect(() => {
    if (!currentSco || !packageId) {
      return;
    }

    // Cleanup previous adapter
    if (scormAdapterRef.current) {
      scormAdapterRef.current.cleanup();
    }

    try {
      const effectiveEnrollmentId = enrollmentId || 'preview';
      
      // Create appropriate adapter based on SCORM version
      if (isScorm2004) {
        scormAdapterRef.current = new Scorm2004Adapter(
          effectiveEnrollmentId,
          currentSco.id,
          handleDebugEvent
        );
      } else {
        scormAdapterRef.current = new Scorm12Adapter(
          effectiveEnrollmentId,
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
  }, [currentSco, packageId, enrollmentId, isScorm2004, handleDebugEvent]);

  const generateContent = async () => {
    const FNS = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    setIsLoadingContent(true);
    
    try {
      handleDebugEvent('info', 'Starting content generation...');
      
      const response = await fetch(`${FNS}/scorm-generate-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}` 
        },
        body: JSON.stringify({ packageId })
      });

      const data = await response.json();
      
      if (response.ok && data?.ok) {
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

  // Handle iframe loading and content validation
  const handleIframeLoad = useCallback(() => {
    if (!currentSco || !launchUrl) return;
    
    handleDebugEvent('success', `Iframe loaded: ${currentSco.title}`);
    handleDebugEvent('info', `Launch URL: ${launchUrl}`);
    
    // Validate content with timeout
    const timeout = setTimeout(() => {
      handleDebugEvent('warning', 'Content validation timed out');
    }, 5000);
    
    fetch(launchUrl, { method: 'HEAD' })
      .then(response => {
        clearTimeout(timeout);
        const contentType = response.headers.get('content-type') || 'unknown';
        
        handleDebugEvent('info', `Response Status: ${response.status}`);
        handleDebugEvent('info', `Content-Type: ${contentType}`);
        
        if (response.status === 404) {
          setContentTypeWarning('SCORM content not found (404). Content may need to be generated.');
        } else if (response.status >= 400) {
          setContentTypeWarning(`Server error: Status ${response.status}. Check content proxy.`);
        } else if (!contentType.includes('text/html')) {
          setContentTypeWarning(`Content served as '${contentType}' instead of HTML.`);
        } else {
          setContentTypeWarning(null);
          handleDebugEvent('success', 'Content validation passed');
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        handleDebugEvent('error', `Content validation failed: ${err.message}`);
        setContentTypeWarning(`Network error: ${err.message}. Content proxy may be unavailable.`);
      });
  }, [currentSco, launchUrl, handleDebugEvent]);

  const handleScoNavigation = (index: number) => {
    if (index >= 0 && index < scos.length) {
      const targetSco = scos[index];
      navigate(`/scorm/preview/${packageId}/${targetSco.id}`, { replace: true });
      setIsInitialized(false);
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

  if (packageLoading || scosLoading) {
    return <div className="flex items-center justify-center h-screen">Loading SCORM package...</div>;
  }

  if (!scormPackage || !scos.length) {
    return <div className="flex items-center justify-center h-screen">SCORM package not found</div>;
  }

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
                  <iframe
                    ref={iframeRef}
                    src={launchUrl}
                    className="w-full h-full border-none"
                    title="SCORM Content"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-downloads"
                    allow="autoplay; fullscreen; microphone; camera"
                    key={`${packageId}-${currentSco?.id}`}
                    onLoad={handleIframeLoad}
                    onError={(e) => {
                      handleDebugEvent('error', `Iframe loading error: ${e.toString()}`);
                      setContentTypeWarning('Failed to load SCORM content. Check if the content proxy is available.');
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
                    if (iframeRef.current) {
                      const url = new URL(iframeRef.current.src);
                      url.searchParams.set('refresh', Date.now().toString());
                      iframeRef.current.src = url.toString();
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