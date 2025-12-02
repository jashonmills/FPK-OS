import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Key, Trash2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useOrgApiKeys } from '@/hooks/useOrgApiKeys';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4, GPT-4 Turbo, GPT-3.5' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude 3 Opus, Sonnet, Haiku' },
  { id: 'google', name: 'Google AI', description: 'Gemini Pro, Gemini Flash' },
] as const;

const AIGovernanceBYOK: React.FC = () => {
  const { user } = useAuth();
  const [newKeys, setNewKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Get user's org
  const { data: orgMember } = useQuery({
    queryKey: ['user-org-member', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('org_members')
        .select('org_id, role')
        .eq('user_id', user.id)
        .in('role', ['owner', 'admin'])
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const orgId = orgMember?.org_id;
  const { keys, isLoading, upsertKey, deleteKey, toggleKey, getKeyForProvider } = useOrgApiKeys(orgId);

  const handleSaveKey = async (provider: 'openai' | 'anthropic' | 'google') => {
    const key = newKeys[provider];
    if (!key || !orgId) return;

    await upsertKey.mutateAsync({ provider, encryptedKey: key, orgId });
    setNewKeys(prev => ({ ...prev, [provider]: '' }));
  };

  const handleDeleteKey = async (provider: string) => {
    if (!orgId) return;
    await deleteKey.mutateAsync({ provider, orgId });
  };

  if (!orgId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Bring Your Own Key (BYOK)
          </CardTitle>
          <CardDescription>
            You must be an organization admin to configure API keys.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Bring Your Own Key (BYOK)
          </CardTitle>
          <CardDescription>
            Use your organization's own API keys instead of FPK University's shared keys. 
            This gives you more control over costs and rate limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-500">Security Note</p>
                <p className="text-muted-foreground">
                  API keys are encrypted before storage. When BYOK is enabled for a provider, 
                  all AI requests for your organization will use your key instead of the platform key.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {PROVIDERS.map(provider => {
              const existingKey = getKeyForProvider(provider.id);
              const inputValue = newKeys[provider.id] || '';
              const isShowingKey = showKeys[provider.id];

              return (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {provider.name}
                        {existingKey?.is_active && (
                          <Badge variant="default" className="bg-green-500">Active</Badge>
                        )}
                        {existingKey && !existingKey.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                    {existingKey && (
                      <Switch
                        checked={existingKey.is_active}
                        onCheckedChange={(checked) => toggleKey.mutate({ id: existingKey.id, isActive: checked })}
                      />
                    )}
                  </div>

                  {existingKey ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded px-3 py-2 font-mono text-sm">
                        ••••••••••••••••••••
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteKey(provider.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {existingKey.last_verified_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          Verified
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor={`key-${provider.id}`}>API Key</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`key-${provider.id}`}
                            type={isShowingKey ? 'text' : 'password'}
                            placeholder={`Enter your ${provider.name} API key`}
                            value={inputValue}
                            onChange={(e) => setNewKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                          >
                            {isShowingKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleSaveKey(provider.id as any)}
                          disabled={!inputValue || upsertKey.isPending}
                        >
                          Save Key
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How BYOK Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• When you add an API key for a provider, all AI requests using that provider will use your key.</p>
          <p>• You can toggle keys on/off without deleting them.</p>
          <p>• If no BYOK key is configured, requests fall back to the platform's shared key.</p>
          <p>• Usage and costs for BYOK requests are billed directly to your provider account.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGovernanceBYOK;
