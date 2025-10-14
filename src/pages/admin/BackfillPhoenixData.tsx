import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Database, Loader2, CheckCircle } from 'lucide-react';

export default function BackfillPhoenixData() {
  const { user } = useAuth();
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<any>(null);

  const handleBackfill = async () => {
    if (!user) {
      toast.error('Please log in to backfill data');
      return;
    }

    setIsBackfilling(true);
    setBackfillResult(null);

    try {
      console.log('[BACKFILL] Starting backfill for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('backfill-phoenix-data', {
        body: { user_id: user.id }
      });

      if (error) {
        throw error;
      }

      console.log('[BACKFILL] Complete:', data);
      setBackfillResult(data);
      
      toast.success('Historical data backfilled successfully!', {
        description: `Processed ${data.sessagesProcessed} sessions, ${data.messagesBackfilled} messages`
      });
    } catch (error: any) {
      console.error('[BACKFILL] Error:', error);
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

          {backfillResult && (
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle className="h-5 w-5" />
                Backfill Complete!
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <div className="text-muted-foreground">Sessions Processed</div>
                  <div className="text-2xl font-bold">{backfillResult.sessionsProcessed}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Messages Backfilled</div>
                  <div className="text-2xl font-bold">{backfillResult.messagesBackfilled}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Learning Outcomes</div>
                  <div className="text-2xl font-bold">{backfillResult.learningOutcomesExtracted}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Memories Extracted</div>
                  <div className="text-2xl font-bold">{backfillResult.memoriesExtracted}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
