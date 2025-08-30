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

  // Redirect to first SCO if accessing package directly
  useEffect(() => {
    if (!scoId && scos.length > 0 && mode === 'preview') {
      navigate(`/scorm/preview/${packageId}/${scos[0].id}`, { replace: true });
      return;
    }
  }, [scoId, scos, packageId, navigate, mode]);

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

  // Initialize SCORM API
  useEffect(() => {
    if (!currentSco || !iframeRef.current?.contentWindow) return;

    const initializeAPI = () => {
      const api = isScorm2004 
        ? createScorm2004API(undefined, { onCommit: handleCommit, onTerminate: handleFinish })
        : createScorm12API(undefined, { onCommit: handleCommit, onFinish: handleFinish });

      // Inject API into iframe
      const iframe = iframeRef.current?.contentWindow as any;
      if (iframe) {
        if (isScorm2004) {
          iframe.API_1484_11 = api;
        } else {
          iframe.API = api;
        }
        
        // Add postMessage support for cross-origin scenarios
        iframe.addEventListener('message', (event: MessageEvent) => {
          const { method, args, id } = event.data;
          if (method && api[method]) {
            const result = api[method](...(args || []));
            iframe.postMessage({ id, result }, '*');
          }
        });

        addDebugLog(`${isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2'} API initialized`);
        setIsInitialized(true);
      }
    };

    const timer = setTimeout(initializeAPI, 1000);
    return () => clearTimeout(timer);
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
          {/* Content Frame */}
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  src={`https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/scorm-content-server/${packageId}/${getCleanLaunchPath(currentSco?.launch_href || 'content/index.html')}`}
                  className="w-full h-full border-none"
                  title="SCORM Content"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                  allow="cross-origin-isolated"
                  onLoad={() => {
                    addDebugLog(`Iframe loaded: ${currentSco?.title || 'SCORM Content'}`);
                    // Log the iframe src for debugging
                    if (iframeRef.current) {
                      addDebugLog(`Iframe src: ${iframeRef.current.src}`);
                    }
                  }}
                  onError={(e) => {
                    addDebugLog(`Iframe error: ${e.toString()}`);
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