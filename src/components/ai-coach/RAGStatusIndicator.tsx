
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, Globe, RefreshCw, Trash2 } from 'lucide-react';
import { useRAGIntegration } from '@/hooks/useRAGIntegration';
import { cn } from '@/lib/utils';

interface RAGStatusIndicatorProps {
  className?: string;
  compact?: boolean;
}

const RAGStatusIndicator: React.FC<RAGStatusIndicatorProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const { stats, isProcessing, clearRAGCache, refreshStats } = useRAGIntegration();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Brain className="h-4 w-4 text-purple-600" />
        <Badge variant="secondary" className="text-xs">
          RAG: {stats.totalEmbeddings} items
        </Badge>
        <Badge variant="outline" className="text-xs">
          Cache: {stats.cacheEntries}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-purple-50 to-blue-50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-purple-600" />
          RAG Knowledge System
          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Embeddings</p>
              <p className="font-medium">{stats.totalEmbeddings}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Cache Entries</p>
              <p className="font-medium">{stats.cacheEntries}</p>
            </div>
          </div>
        </div>
        
        {stats.lastProcessed && (
          <p className="text-xs text-muted-foreground">
            Last processed: {new Date(stats.lastProcessed).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStats}
            disabled={isProcessing}
            className="text-xs"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isProcessing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearRAGCache}
            disabled={isProcessing}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RAGStatusIndicator;
