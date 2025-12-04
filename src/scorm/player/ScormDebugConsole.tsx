import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, Terminal, Activity, Clock } from 'lucide-react';

export interface ScormDebugConsoleProps {
  debugLogs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    category: string;
    message: string;
    data?: any;
  }>;
  cmiData: any;
  apiCallCount: number;
  sessionDuration: number;
  onClearLogs: () => void;
}

export const ScormDebugConsole: React.FC<ScormDebugConsoleProps> = ({
  debugLogs,
  cmiData,
  apiCallCount,
  sessionDuration,
  onClearLogs
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="border-t bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <h3 className="font-semibold">Debug Console</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span>API Calls: {apiCallCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Session: {formatTime(sessionDuration)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onClearLogs}>
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Debug Logs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Debug Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="p-4 space-y-2">
                  {debugLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No logs yet...</p>
                  ) : (
                    debugLogs.slice(-50).map((log, index) => (
                      <div key={index} className="text-xs border-l-2 border-border pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={`text-xs ${getLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-muted-foreground">
                            {log.category}
                          </span>
                          <span className="text-muted-foreground ml-auto">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-foreground">{log.message}</p>
                        {log.data && (
                          <pre className="text-xs text-muted-foreground mt-1 bg-muted p-1 rounded">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* CMI Data */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">CMI Data</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="p-4">
                  {Object.keys(cmiData).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No CMI data available...</p>
                  ) : (
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(cmiData, null, 2)}
                    </pre>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};