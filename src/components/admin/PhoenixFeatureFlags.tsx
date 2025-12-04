import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, AlertTriangle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeatureFlag {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  configuration: any;
  description: string;
  updated_at: string;
}

export const PhoenixFeatureFlags = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set());

  // Fetch feature flags
  const { data: flags, isLoading, error } = useQuery({
    queryKey: ['phoenix-feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('phoenix_feature_flags')
        .select('*')
        .order('feature_name');
      
      if (error) throw error;
      return data as FeatureFlag[];
    },
  });

  // Toggle feature flag
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from('phoenix_feature_flags')
        .update({ is_enabled })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phoenix-feature-flags'] });
      toast({
        title: "Feature Updated",
        description: "Feature flag has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggle = (flag: FeatureFlag) => {
    toggleMutation.mutate({
      id: flag.id,
      is_enabled: !flag.is_enabled,
    });
  };

  const toggleExpanded = (featureName: string) => {
    setExpandedFlags(prev => {
      const next = new Set(prev);
      if (next.has(featureName)) {
        next.delete(featureName);
      } else {
        next.add(featureName);
      }
      return next;
    });
  };

  const getFeatureIcon = (featureName: string) => {
    if (featureName.includes('nite_owl')) return '🦉';
    if (featureName.includes('socratic')) return '🤝';
    if (featureName.includes('tts') || featureName.includes('audio') || featureName.includes('provider')) return '🎵';
    if (featureName.includes('memory')) return '🧠';
    if (featureName.includes('podcast')) return '🎙️';
    if (featureName.includes('governor')) return '🛡️';
    if (featureName.includes('welcome')) return '👋';
    return '⚙️';
  };

  const getFeatureColor = (featureName: string) => {
    if (featureName.includes('nite_owl')) return 'bg-purple-500';
    if (featureName.includes('socratic')) return 'bg-blue-500';
    if (featureName.includes('tts') || featureName.includes('audio') || featureName.includes('provider')) return 'bg-green-500';
    if (featureName.includes('memory')) return 'bg-orange-500';
    if (featureName.includes('podcast')) return 'bg-pink-500';
    if (featureName.includes('governor')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load feature flags: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const enabledCount = flags?.filter(f => f.is_enabled).length || 0;
  const totalCount = flags?.length || 0;

  return (
    <Card className="border-purple-500/20 mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Settings className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Feature Flags
                <Badge variant="outline" className="ml-2">
                  {enabledCount}/{totalCount} Enabled
                </Badge>
              </CardTitle>
              <CardDescription>
                Runtime control for Phoenix AI capabilities
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Toggle features on/off instantly without deploying code. If a feature causes issues, disable it here as a "kill switch."
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flags?.map((flag) => (
            <div
              key={flag.id}
              className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getFeatureIcon(flag.feature_name)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`flag-${flag.id}`} className="font-medium cursor-pointer">
                        {flag.feature_name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Label>
                      <Badge 
                        variant={flag.is_enabled ? "default" : "secondary"} 
                        className={flag.is_enabled ? getFeatureColor(flag.feature_name) : ''}
                      >
                        {flag.is_enabled ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {flag.description}
                    </p>
                    {Object.keys(flag.configuration || {}).length > 0 && (
                      <button
                        onClick={() => toggleExpanded(flag.feature_name)}
                        className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                      >
                        {expandedFlags.has(flag.feature_name) ? 'Hide' : 'Show'} Configuration
                      </button>
                    )}
                  </div>
                </div>
                <Switch
                  id={`flag-${flag.id}`}
                  checked={flag.is_enabled}
                  onCheckedChange={() => handleToggle(flag)}
                  disabled={toggleMutation.isPending}
                />
              </div>

              {expandedFlags.has(flag.feature_name) && flag.configuration && (
                <div className="ml-11 mt-2 p-3 rounded-md bg-muted/50 text-sm">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(flag.configuration, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <Alert variant="default" className="bg-blue-500/10 border-blue-500/20">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Pro Tip:</strong> If the chat gets stuck or a persona misbehaves, disable that feature immediately as a kill switch while you investigate.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
