import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface BackfillProgress {
  totalSessionsFound: number;
  sessionsProcessed: number;
  messagesBackfilled: number;
  learningOutcomesExtracted: number;
  memoriesExtracted: number;
  isComplete: boolean;
  errors?: string[];
}

export default function BackfillPhoenixData() {
  const { user } = useAuth();
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [progress, setProgress] = useState<BackfillProgress | null>(null);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setStatusLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const processBatch = async (batchNumber: number): Promise<boolean> => {
    addLog(`Processing batch ${batchNumber}...`);

    const { data, error } = await supabase.functions.invoke('backfill-phoenix-data', {
      body: { 
        user_id: user!.id,
        batch_number: batchNumber,
        batch_size: 10
      }
    });

    if (error) {
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Backfill failed');
    }

    // Update progress
    setProgress({
      totalSessionsFound: data.totalSessionsFound,
      sessionsProcessed: data.sessionsProcessed,
      messagesBackfilled: data.messagesBackfilled,
      learningOutcomesExtracted: data.learningOutcomesExtracted,
      memoriesExtracted: data.memoriesExtracted,
      isComplete: data.isComplete,
      errors: data.errors
    });

    addLog(`Batch ${batchNumber} complete: ${data.messagesBackfilled} messages migrated`);

    if (data.errors && data.errors.length > 0) {
      addLog(`⚠️ ${data.errors.length} errors in batch ${batchNumber}`);
      data.errors.slice(0, 3).forEach((err: string) => addLog(`  • ${err}`));
    }

    return data.isComplete;
  };

  const handleBackfill = async () => {
    if (!user) {
      toast.error('Please log in to backfill data');
      return;
    }

    setIsBackfilling(true);
    setProgress(null);
    setStatusLog([]);
    addLog('Starting backfill process...');

    try {
      let batchNumber = 1;
      let isComplete = false;

      while (!isComplete) {
        isComplete = await processBatch(batchNumber);
        
        if (!isComplete) {
          batchNumber++;
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      addLog('✅ Backfill complete!');
      toast.success('Historical data backfilled successfully!', {
        description: `Migrated ${progress?.messagesBackfilled || 0} messages from ${progress?.sessionsProcessed || 0} sessions`
      });
    } catch (error: any) {
      console.error('[BACKFILL] Error:', error);
      addLog(`❌ Error: ${error.message}`);
      toast.error('Backfill failed', {
        description: error.message
      });
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backfill Phoenix Analytics Data
          </CardTitle>
          <CardDescription>
            Import your historical conversation data into the new Phoenix analytics system.
            This will process all your past coach sessions and extract messages, learning outcomes, and memories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What this does:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Reads all your historical coach_sessions data</li>
                <li>• Creates phoenix_conversations and phoenix_messages records</li>
                <li>• Extracts learning outcomes and links them to concepts</li>
                <li>• Extracts memories for future session continuity</li>
                <li>• Populates all analytics dashboards with historical data</li>
              </ul>
            </div>

            <Button
              onClick={handleBackfill}
              disabled={isBackfilling || !user}
              className="w-full"
              size="lg"
            >
              {isBackfilling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Backfilling Data...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Start Backfill
                </>
              )}
            </Button>
          </div>

          {/* Progress Display */}
          {progress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {progress.sessionsProcessed} / {progress.totalSessionsFound} sessions
                  </span>
                </div>
                <Progress 
                  value={(progress.sessionsProcessed / progress.totalSessionsFound) * 100} 
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Messages Migrated</div>
                  <div className="text-2xl font-bold">{progress.messagesBackfilled}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Learning Outcomes</div>
                  <div className="text-2xl font-bold">{progress.learningOutcomesExtracted}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Memories Extracted</div>
                  <div className="text-2xl font-bold">{progress.memoriesExtracted}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="text-xl font-bold">
                    {progress.isComplete ? (
                      <span className="text-success flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </span>
                    ) : (
                      <span className="text-primary">Processing...</span>
                    )}
                  </div>
                </div>
              </div>

              {progress.errors && progress.errors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                    <AlertCircle className="h-4 w-4" />
                    {progress.errors.length} Errors Encountered
                  </div>
                  <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto space-y-1">
                    {progress.errors.slice(0, 5).map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                    {progress.errors.length > 5 && (
                      <div className="italic">... and {progress.errors.length - 5} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Log */}
          {statusLog.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Process Log</h3>
              <div className="text-xs font-mono space-y-1 max-h-64 overflow-y-auto">
                {statusLog.map((log, i) => (
                  <div key={i} className="text-muted-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
