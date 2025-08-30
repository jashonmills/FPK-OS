import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, RotateCcw, X, ChevronLeft, ChevronRight, Clock, 
  CheckCircle, AlertCircle, Settings, Terminal 
} from 'lucide-react';
import { createScorm12API } from '@/scorm/runtime/scorm12';
import { createScorm2004API } from '@/scorm/runtime/scorm2004';
import { useScormPackage, useScormScos } from '@/hooks/useScormPackages';
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
  
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionData, setSessionData] = useState<any>({});
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [contentTypeWarning, setContentTypeWarning] = useState<string | null>(null);

  // Data fetching
  const { package: scormPackage, isLoading: packageLoading } = useScormPackage(packageId || '');
  const { scos, isLoading: scosLoading } = useScormScos(packageId || '');

  // Current SCO - handle both direct SCO access and package-level access
  const targetScoId = scoId;
  const currentScoIndex = targetScoId ? scos.findIndex(sco => sco.id === targetScoId) : 0;
  const currentSco = scos[Math.max(0, currentScoIndex)];
  const isScorm2004 = scormPackage?.metadata?.manifest?.standard === 'SCORM 2004';

  // Helper function to clean launch href for URL construction
  const getCleanLaunchPath = (launchHref: string) => {
    if (!launchHref) return 'content/index.html';
    
    // Remove package path prefix if present
    const packagePrefix = `packages/${packageId}/`;
    if (launchHref.startsWith(packagePrefix)) {
      return launchHref.substring(packagePrefix.length);
    }
    
    // If it starts with just packageId, remove that too
    if (launchHref.startsWith(packageId + '/')) {
      return launchHref.substring(packageId.length + 1);
    }
    
    return launchHref;
  };

  useEffect(() => {
    // Force iframe reload when SCO changes
    if (iframeRef.current && currentSco) {
      const newSrc = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/scorm-content-proxy/${packageId}/${getCleanLaunchPath(currentSco?.launch_href || 'content/index.html')}`;
      addDebugLog(`Loading SCO: ${currentSco.title}`);
      addDebugLog(`Iframe URL: ${newSrc}`);
      
      if (iframeRef.current.src !== newSrc) {
        iframeRef.current.src = newSrc;
      }
    }
  }, [currentSco, packageId]);

  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  }, []);

  // SCORM API handlers
  const handleCommit = useCallback(async (cmiData: any) => {
    try {
      addDebugLog(`Committing data: ${JSON.stringify(cmiData).substring(0, 100)}...`);
      
      const { error } = await supabase.functions.invoke('scorm-runtime-api', {
        body: { 
          action: 'commit',
          enrollmentId: enrollmentId || 'preview',
          scoId: currentSco?.id,
          cmiData 
        }
      });
      
      if (error) throw error;
      addDebugLog('Data committed successfully');
    } catch (error) {
      addDebugLog(`Commit error: ${error.message}`);
    }
  }, [enrollmentId, currentSco?.id, addDebugLog]);

  const handleFinish = useCallback(async (cmiData: any) => {
    try {
      addDebugLog('Finishing SCORM session...');
      await handleCommit(cmiData);
      
      if (mode === 'launch') {
        toast({
          title: "Session Complete",
          description: "Your progress has been saved.",
        });
      }
      
      addDebugLog('Session finished successfully');
    } catch (error) {
      addDebugLog(`Finish error: ${error.message}`);
    }
  }, [handleCommit, mode, toast, addDebugLog]);

  const handleExtractPackage = useCallback(async () => {
    if (!packageId) return;
    
    try {
      addDebugLog('🔧 Generating SCORM content files...');
      setContentTypeWarning('Generating content files, please wait...');
      
      const { data, error } = await supabase.functions.invoke('scorm-extract-package', {
        body: { packageId }
      });
      
      if (error) {
        throw error;
      }
      
      addDebugLog(`✅ Content generated: ${data.uploadedFiles} files created`);
      setContentTypeWarning(null);
      
      // Reload the iframe after a short delay
      setTimeout(() => {
        if (iframeRef.current) {
          const currentSrc = iframeRef.current.src;
          addDebugLog(`🔄 Reloading iframe: ${currentSrc}`);
          // Force reload by adding a cache-busting parameter
          const url = new URL(currentSrc);
          url.searchParams.set('t', Date.now().toString());
          iframeRef.current.src = url.toString();
        }
      }, 1000);
      
      toast({
        title: "Content Generated",
        description: `Successfully created ${data.uploadedFiles} SCORM content files.`,
      });
      
    } catch (error) {
      console.error('Content generation error:', error);
      addDebugLog(`❌ Content generation failed: ${error.message}`);
      setContentTypeWarning(`Content generation failed: ${error.message}`);
      
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [packageId, addDebugLog, toast]);

  // SCORM API initialization - CRITICAL: Expose on parent window
  useEffect(() => {
    if (!currentSco) return;
    
    const scormApi = isScorm2004 
      ? createScorm2004API(handleCommit, handleFinish)
      : createScorm12API(handleCommit, handleFinish);

    // Expose API on parent window (not inside iframe)
    if (isScorm2004) {
      (window as any).API_1484_11 = scormApi;
      addDebugLog('SCORM 2004 API exposed on parent window');
    } else {
      (window as any).API = scormApi;
      addDebugLog('SCORM 1.2 API exposed on parent window');
    }

    setIsInitialized(true);
    
    // Cleanup on unmount
    return () => {
      if (isScorm2004) {
        delete (window as any).API_1484_11;
      } else {
        delete (window as any).API;
      }
    };
  }, [currentSco, isScorm2004, handleCommit, handleFinish, addDebugLog]);

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
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">{scormPackage.title}</h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'preview' ? 'Preview Mode' : 'Learning Mode'} •{' '}
                SCO {currentScoIndex + 1} of {scos.length} •{' '}
                {isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={isInitialized ? "default" : "secondary"}>
              {isInitialized ? 'API Ready' : 'Initializing...'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugConsole(!showDebugConsole)}
            >
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* TOC Sidebar */}
        <div className="w-64 border-r bg-card p-4">
          <h3 className="font-semibold mb-4">Course Contents</h3>
          <div className="space-y-2">
            {scos.map((sco, index) => (
              <div 
                key={sco.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentScoIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleScoNavigation(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{sco.title}</span>
                  {sco.is_launchable && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Type Warning Banner */}
          {contentTypeWarning && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-4 mx-4 mt-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong>Content Issue:</strong> {contentTypeWarning}
                    <br />
                    <small>The SCORM content files may need to be generated.</small>
                  </div>
                </div>
                {(contentTypeWarning.includes('404') || contentTypeWarning.includes('not found')) && (
                  <Button 
                    size="sm" 
                    onClick={handleExtractPackage}
                    className="ml-4 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  >
                    🔧 Generate Content
                  </Button>
                )}
              </div>
              {/* Always show button for 404 errors - secondary option */}
              {(contentTypeWarning.includes('404') || contentTypeWarning.includes('not found')) && (
                <div className="mt-3 pt-3 border-t border-yellow-300">
                  <p className="text-sm mb-2"><strong>Quick Fix:</strong> Click below to automatically generate the missing SCORM content files.</p>
                  <Button 
                    onClick={handleExtractPackage}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    ✨ Create Missing Files Now
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Content Frame */}
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  src={`https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/scorm-content-proxy/${packageId}/${getCleanLaunchPath(currentSco?.launch_href || 'content/index.html')}`}
                  className="w-full h-full border-none"
                  title="SCORM Content"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                  referrerPolicy="no-referrer"
                  allow="fullscreen; autoplay"
                  onLoad={() => {
                    addDebugLog(`✅ Iframe loaded successfully: ${currentSco?.title || 'SCORM Content'}`);
                    
                    // Log the iframe src for debugging
                    if (iframeRef.current) {
                      addDebugLog(`📍 Current iframe src: ${iframeRef.current.src}`);
                      
                      // Check content type for diagnostics with timeout
                      const timeout = setTimeout(() => {
                        addDebugLog('⚠️ Content-Type check timed out');
                      }, 5000);
                      
                      fetch(iframeRef.current.src, { method: 'HEAD' })
                        .then(response => {
                          clearTimeout(timeout);
                          const contentType = response.headers.get('content-type');
                          addDebugLog(`📋 Response Status: ${response.status}`);
                          addDebugLog(`📋 Content-Type: ${contentType || 'not specified'}`);
                          
                          if (response.status === 404) {
                            setContentTypeWarning('Error: SCORM content not found (404). Check if the content proxy is deployed and the package is properly extracted.');
                          } else if (response.status >= 400) {
                            setContentTypeWarning(`Error: Server returned status ${response.status}. Check the content proxy logs.`);
                          } else if (contentType && !contentType.includes('text/html')) {
                            setContentTypeWarning(`Warning: Content is being served as '${contentType}' instead of 'text/html'. This may cause display issues.`);
                          } else {
                            setContentTypeWarning(null);
                            addDebugLog('✅ Content-Type looks good!');
                          }
                        })
                        .catch(err => {
                          clearTimeout(timeout);
                          addDebugLog(`❌ Content-Type check failed: ${err.message}`);
                          setContentTypeWarning(`Network Error: ${err.message}. The content proxy may not be deployed yet.`);
                        });
                    }
                  }}
                  onError={(e) => {
                    addDebugLog(`❌ Iframe loading error: ${e.toString()}`);
                    setContentTypeWarning('Iframe failed to load. Check the content proxy deployment and network connectivity.');
                  }}
                />
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
          <div className="border-t p-4">
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
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart SCO
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
                >
                  🔄 Refresh Content
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