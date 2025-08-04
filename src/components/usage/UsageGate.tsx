import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { useUsageTracking, AIFeatureType } from '@/hooks/useUsageTracking';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface UsageGateProps {
  children: ReactNode;
  featureType: AIFeatureType;
  requiredAmount?: number;
  fallbackMessage?: string;
  showUsageInfo?: boolean;
}

const FEATURE_LABELS = {
  ai_chat: 'AI Chat Messages',
  voice_processing: 'Voice Processing Minutes',
  rag_query: 'Knowledge Queries',
  document_processing: 'Document Processing',
  flashcard_generation: 'Flashcard Generation',
  ai_insights: 'AI Insights',
} as const;

export function UsageGate({ 
  children, 
  featureType, 
  requiredAmount = 1,
  fallbackMessage,
  showUsageInfo = true 
}: UsageGateProps) {
  const { quotas, canUseFeature, getUsagePercentage } = useUsageTracking();
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  const canUse = canUseFeature(featureType, requiredAmount);
  const usagePercentage = getUsagePercentage(featureType);
  const featureLabel = FEATURE_LABELS[featureType];

  // If user can use the feature, render children
  if (canUse) {
    return <>{children}</>;
  }

  // Get current usage info
  const getUsageInfo = () => {
    if (!quotas) return null;

    const fieldMap = {
      ai_chat: { used: quotas.ai_chat_messages_used, limit: quotas.ai_chat_messages_limit },
      voice_processing: { used: quotas.voice_minutes_used, limit: quotas.voice_minutes_limit },
      rag_query: { used: quotas.rag_queries_used, limit: quotas.rag_queries_limit },
      document_processing: { used: quotas.document_processing_used, limit: quotas.document_processing_limit },
      flashcard_generation: { used: quotas.flashcard_generation_used, limit: quotas.flashcard_generation_limit },
      ai_insights: { used: quotas.ai_insights_used, limit: quotas.ai_insights_limit },
    };

    return fieldMap[featureType];
  };

  const usageInfo = getUsageInfo();
  const isUnlimited = usageInfo?.limit === -1;

  // Render usage limit reached UI
  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">
          {featureLabel} Limit Reached
        </CardTitle>
        <CardDescription>
          {fallbackMessage || `You've reached your ${featureLabel.toLowerCase()} limit for this billing period.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Usage Information */}
        {showUsageInfo && usageInfo && !isUnlimited && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Usage</span>
              <span className="font-medium">
                {usageInfo.used.toLocaleString()} / {usageInfo.limit.toLocaleString()}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {usagePercentage.toFixed(0)}% of your monthly limit used
            </div>
          </div>
        )}

        {/* Current Plan Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            Current Plan: {subscription.subscription_tier?.charAt(0).toUpperCase() + subscription.subscription_tier?.slice(1) || 'Free'}
          </Badge>
        </div>

        {/* Upgrade Options */}
        <div className="space-y-3">
          <div className="text-center text-sm text-muted-foreground">
            Upgrade your plan to get more {featureLabel.toLowerCase()}:
          </div>
          
          <div className="grid gap-2">
            {/* Family Plan Benefits */}
            {subscription.subscription_tier !== 'us' && subscription.subscription_tier !== 'universal' && (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="font-medium text-sm">FPK Us (Family)</div>
                  <div className="text-xs text-muted-foreground">
                    5x more usage + 3 family seats
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/dashboard/subscription')}
                  className="shrink-0"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </div>
            )}

            {/* Universal Plan Benefits */}
            {subscription.subscription_tier !== 'universal' && (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="font-medium text-sm">FPK Universal</div>
                  <div className="text-xs text-muted-foreground">
                    Unlimited usage + premium features
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/dashboard/subscription')}
                  className="shrink-0"
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/dashboard/subscription')}
          >
            View Usage & Billing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}