import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Copy, 
  Settings,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DebugLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'api' | 'runtime' | 'player' | 'system';
  message: string;
  data?: any;
}

interface ScormDebugConsoleProps {
  isVisible: boolean;
  onToggle: () => void;
  currentCMI?: any;
  sessionInfo?: {
    packageId: string;
    scoId: string;
    standard: string;
    initialized: boolean;
    sessionStartTime: string;
  };
}

export const ScormDebugConsole: React.FC<ScormDebugConsoleProps> = ({
  isVisible,
  onToggle,
  currentCMI,
  sessionInfo
}) => {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState('logs');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Listen for SCORM API calls (would be injected by the runtime)
  useEffect(() => {
    const handleScormCall = (event: CustomEvent) => {
      const { method, args, result, error, timestamp } = event.detail;
      
      addLog({
        level: error ? 'error' : 'info',
        category: 'api',
        message: `${method}(${args?.join(', ') || ''}) → ${error || result}`,
        data: { method, args, result, error }
      });
    };

    window.addEventListener('scorm-api-call', handleScormCall as EventListener);
    return () => window.removeEventListener('scorm-api-call', handleScormCall as EventListener);
  }, []);

  const addLog = (entry: Omit<DebugLogEntry, 'id' | 'timestamp'>) => {
    const logEntry: DebugLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    setLogs(prev => [...prev.slice(-199), logEntry]); // Keep last 200 logs
  };

  const clearLogs = () => {
    setLogs([]);
    toast({
      title: "Debug Console Cleared",
      description: "All debug logs have been cleared.",
    });
  };

  const downloadLogs = () => {
    const logContent = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()} [${log.category}] ${log.message}${
        log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''
      }`
    ).join('\n\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scorm-debug-${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Debug Logs Downloaded",
      description: "Debug logs have been saved to your downloads folder.",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'bg-blue-100 text-blue-800';
      case 'runtime': return 'bg-green-100 text-green-800';
      case 'player': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCMIData = (data: any): string => {
    if (!data) return 'No CMI data available';
    
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Error formatting CMI data';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="border-t border-l-0 border-r-0 border-b-0 rounded-none">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <CardTitle className="text-lg">SCORM Debug Console</CardTitle>
            {sessionInfo && (
              <Badge variant="outline">
                {sessionInfo.standard}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={autoScroll ? 'bg-accent' : ''}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTimestamps(!showTimestamps)}
              className={showTimestamps ? 'bg-accent' : ''}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadLogs}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logs">Logs ({logs.length})</TabsTrigger>
            <TabsTrigger value="cmi">CMI Data</TabsTrigger>
            <TabsTrigger value="session">Session Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs" className="m-0">
            <ScrollArea className="h-64" ref={scrollRef}>
              <div className="p-4 space-y-2">
                {logs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No debug logs yet. SCORM API calls will appear here.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-sm border-b pb-2">
                      {getLogIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getCategoryColor(log.category)} variant="secondary">
                            {log.category}
                          </Badge>
                          {showTimestamps && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs">{log.message}</div>
                        {log.data && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs text-muted-foreground">
                              Show data
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(log.message)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="cmi" className="m-0">
            <ScrollArea className="h-64">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Current CMI State</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatCMIData(currentCMI))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                  {formatCMIData(currentCMI)}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="session" className="m-0">
            <ScrollArea className="h-64">
              <div className="p-4 space-y-4">
                {sessionInfo ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold">Package ID</label>
                        <p className="text-sm text-muted-foreground">{sessionInfo.packageId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">SCO ID</label>
                        <p className="text-sm text-muted-foreground">{sessionInfo.scoId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">Standard</label>
                        <p className="text-sm text-muted-foreground">{sessionInfo.standard}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">Status</label>
                        <Badge variant={sessionInfo.initialized ? "default" : "secondary"}>
                          {sessionInfo.initialized ? "Initialized" : "Not Initialized"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Session Start</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sessionInfo.sessionStartTime).toLocaleString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No session information available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};