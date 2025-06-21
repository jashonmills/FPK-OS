import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface RAGStats {
  totalEmbeddings: number;
  lastUpdated: string | null;
  isEnabled: boolean;
  sources: {
    notes: number;
    flashcards: number;
    goals: number;
    knowledge_base: number;
  };
}

interface RAGStatusIndicatorProps {
  compact?: boolean;
}

const RAGStatusIndicator: React.FC<RAGStatusIndicatorProps> = ({ compact = false }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RAGStats>({
    totalEmbeddings: 0,
    lastUpdated: null,
    isEnabled: false,
    sources: {
      notes: 0,
      flashcards: 0,
      goals: 0,
      knowledge_base: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch embedding counts by source
        const { data: embeddings } = await supabase
          .from('knowledge_embeddings')
          .select('metadata')
          .eq('user_id', user.id);

        if (embeddings) {
          const sources = {
            notes: 0,
            flashcards: 0,
            goals: 0,
            knowledge_base: 0
          };

          embeddings.forEach(embedding => {
            const metadata = embedding.metadata || {};
            if (metadata.source === 'note') sources.notes++;
            else if (metadata.source === 'flashcard') sources.flashcards++;
            else if (metadata.source === 'goal') sources.goals++;
            else if (metadata.source === 'knowledge_base') sources.knowledge_base++;
          });

          setStats({
            totalEmbeddings: embeddings.length,
            lastUpdated: embeddings.length > 0 ? new Date().toISOString() : null,
            isEnabled: embeddings.length > 0,
            sources
          });
        }
      } catch (error) {
        console.error('Error fetching RAG stats:', error);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <Brain className={`h-4 w-4 ${stats.isEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
        <div className="text-sm">
          <span className="font-medium">{stats.totalEmbeddings}</span>
          <span className="text-muted-foreground ml-1">AI embeddings</span>
        </div>
        {stats.isEnabled && (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className={`h-5 w-5 ${stats.isEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
          RAG Enhancement Status
          {stats.isEnabled && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">{stats.totalEmbeddings}</div>
            <div className="text-sm text-muted-foreground">Total Embeddings</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Sources:</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Notes:</span>
                <span>{stats.sources.notes}</span>
              </div>
              <div className="flex justify-between">
                <span>Flashcards:</span>
                <span>{stats.sources.flashcards}</span>
              </div>
              <div className="flex justify-between">
                <span>Goals:</span>
                <span>{stats.sources.goals}</span>
              </div>
              <div className="flex justify-between">
                <span>Knowledge Base:</span>
                <span>{stats.sources.knowledge_base}</span>
              </div>
            </div>
          </div>
        </div>

        {stats.lastUpdated && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </div>
        )}

        {!stats.isEnabled && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">RAG not active</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Process your content or upload knowledge base files to enhance AI responses with your personal data.
            </p>
          </div>
        )}

        {stats.isEnabled && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">AI Enhancement Active</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Your AI conversations are enhanced with {stats.totalEmbeddings} personal knowledge embeddings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RAGStatusIndicator;
