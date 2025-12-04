import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Transaction {
  id: string;
  transaction_date: string;
  action_type: string;
  credits_changed: number;
  balance_monthly_after: number;
  balance_purchased_after: number;
}

export const CreditUsageHistory = () => {
  const { selectedFamily } = useFamily();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedFamily) return;

      try {
        const { data, error } = await supabase
          .from('ai_credit_ledger')
          .select('*')
          .eq('family_id', selectedFamily.id)
          .order('transaction_date', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data) {
          setTransactions(data.map(t => ({
            id: t.id,
            transaction_date: t.transaction_date,
            action_type: t.action_type,
            credits_changed: Number(t.credits_changed),
            balance_monthly_after: Number(t.balance_monthly_after),
            balance_purchased_after: Number(t.balance_purchased_after),
          })));
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Subscribe to new transactions
    const channel = supabase
      .channel('credit_transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_credit_ledger',
          filter: `family_id=eq.${selectedFamily?.id}`,
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedFamily?.id]);

  const getActionLabel = (actionType: string): string => {
    const labels: Record<string, string> = {
      chat_simple: 'AI Chat Query',
      chat_rag: 'AI Chat (RAG)',
      tts: 'Text-to-Speech',
      stt: 'Speech-to-Text',
      document_analysis: 'Document Analysis',
      daily_briefing: 'Daily Briefing',
      goal_activities: 'Goal Activities',
      purchased_pack: 'Credits Purchased',
      monthly_reset: 'Monthly Reset',
    };
    return labels[actionType] || actionType;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No activity yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {transaction.credits_changed > 0 ? (
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium text-sm">
                        {getActionLabel(transaction.action_type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.transaction_date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={transaction.credits_changed > 0 ? 'default' : 'secondary'}
                      className="font-mono"
                    >
                      {transaction.credits_changed > 0 ? '+' : ''}
                      {transaction.credits_changed.toLocaleString()}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Balance: {(transaction.balance_monthly_after + transaction.balance_purchased_after).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
