import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeatureFlag {
  id: string;
  name: string;
  description: string | null;
  enabled: boolean;
}

export const FeatureFlagsTable = () => {
  const isMobile = useIsMobile();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) throw error;
      setFlags(data || []);
    } catch (error: any) {
      console.error('Error fetching feature flags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feature flags',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (flagId: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled: !currentEnabled })
        .eq('id', flagId);

      if (error) throw error;

      setFlags(flags.map(flag => 
        flag.id === flagId ? { ...flag, enabled: !currentEnabled } : flag
      ));

      toast({
        title: 'Success',
        description: 'Feature flag updated',
      });
    } catch (error: any) {
      console.error('Error updating feature flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature flag',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchFlags();

    // Subscribe to changes
    const channel = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags',
        },
        () => {
          fetchFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        {flags.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No feature flags found
          </div>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium break-words">{flag.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    {flag.description || 'No description'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium">
                  {flag.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => handleToggle(flag.id, flag.enabled)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop table layout
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No feature flags found
              </TableCell>
            </TableRow>
          ) : (
            flags.map((flag) => (
              <TableRow key={flag.id}>
                <TableCell className="font-medium">{flag.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {flag.description || 'No description'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => handleToggle(flag.id, flag.enabled)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
