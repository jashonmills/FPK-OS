import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Mic, 
  Brain, 
  FileText, 
  Sparkles, 
  BarChart3,
  Database,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';

const FEATURE_CONFIG = {
  ai_chat: {
    icon: MessageSquare,
    label: 'AI Chat Messages',
    description: 'Messages with AI Study Coach',
    color: 'hsl(var(--primary))',
  },
  voice_processing: {
    icon: Mic,
    label: 'Voice Processing',
    description: 'Minutes of voice-to-text processing',
    color: 'hsl(var(--accent))',
  },
  rag_query: {
    icon: Brain,
    label: 'Knowledge Queries',
    description: 'RAG-powered knowledge searches',
    color: 'hsl(var(--secondary))',
  },
  document_processing: {
    icon: FileText,
    label: 'Document Processing',
    description: 'PDF and document analysis',
    color: 'hsl(var(--primary-variant))',
  },
  flashcard_generation: {
    icon: Sparkles,
    label: 'Flashcard Generation',
    description: 'AI-generated flashcards',
    color: 'hsl(var(--accent-variant))',
  },
  ai_insights: {
    icon: BarChart3,
    label: 'AI Insights',
    description: 'Personalized learning insights',
    color: 'hsl(var(--muted-foreground))',
  },
} as const;

interface UsageCardProps {
  featureType: keyof typeof FEATURE_CONFIG;
  used: number;
  limit: number;
  unit?: string;
}

function UsageCard({ featureType, used, limit, unit = '' }: UsageCardProps) {
  const config = FEATURE_CONFIG[featureType];
  const IconComponent = config.icon;
  const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === -1;
  
  const getStatusColor = () => {
    if (isUnlimited) return 'success';
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'warning';
    return 'default';
  };

  const getStatusText = () => {
    if (isUnlimited) return 'Unlimited';
    if (percentage >= 100) return 'Limit Reached';
    if (percentage >= 90) return 'Almost Full';
    return 'Available';
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            <IconComponent className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
            <CardDescription className="text-xs">{config.description}</CardDescription>
          </div>
        </div>
        <Badge variant={getStatusColor() as any} className="text-xs">
          {getStatusText()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">
              {used.toLocaleString()}{unit}
              {!isUnlimited && (
                <span className="text-muted-foreground"> / {limit.toLocaleString()}{unit}</span>
              )}
            </span>
          </div>
          {!isUnlimited && (
            <Progress 
              value={percentage} 
              className="h-2"
              style={{ 
                '--progress-foreground': percentage >= 90 ? 'hsl(var(--destructive))' : config.color 
              } as any}
            />
          )}
          {!isUnlimited && (
            <div className="text-xs text-muted-foreground">
              {(limit - used).toLocaleString()}{unit} remaining
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function UsageDashboard() {
  const { quotas, usageLogs, isLoading } = useUsageTracking();
  const { subscription } = useSubscription();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!quotas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Usage Tracking</span>
          </CardTitle>
          <CardDescription>
            Track your AI feature usage and manage your subscription limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No usage data available. Your usage tracking will appear here once you start using AI features.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentPeriodEnd = new Date(quotas.period_end);
  const isCurrentPeriod = currentPeriodEnd > new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usage & Billing</h2>
          <p className="text-muted-foreground">
            Track your AI feature usage for the current billing period
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Period ends: {format(currentPeriodEnd, 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      {/* Current Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan: {subscription.subscription_tier?.charAt(0).toUpperCase() + subscription.subscription_tier?.slice(1) || 'Free'}</span>
            <Badge variant={subscription.subscribed ? 'default' : 'secondary'}>
              {subscription.subscribed ? 'Active' : 'Free Tier'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {subscription.subscription_end && (
              <>Next billing: {format(new Date(subscription.subscription_end), 'MMM dd, yyyy')}</>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UsageCard
          featureType="ai_chat"
          used={quotas.ai_chat_messages_used}
          limit={quotas.ai_chat_messages_limit}
          unit=" msgs"
        />
        <UsageCard
          featureType="voice_processing"
          used={quotas.voice_minutes_used}
          limit={quotas.voice_minutes_limit}
          unit=" min"
        />
        <UsageCard
          featureType="rag_query"
          used={quotas.rag_queries_used}
          limit={quotas.rag_queries_limit}
          unit=" queries"
        />
        <UsageCard
          featureType="document_processing"
          used={quotas.document_processing_used}
          limit={quotas.document_processing_limit}
          unit=" docs"
        />
        <UsageCard
          featureType="flashcard_generation"
          used={quotas.flashcard_generation_used}
          limit={quotas.flashcard_generation_limit}
          unit=" cards"
        />
        <UsageCard
          featureType="ai_insights"
          used={quotas.ai_insights_used}
          limit={quotas.ai_insights_limit}
          unit=" insights"
        />
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Knowledge Base Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Used</span>
              <span className="font-medium">
                {quotas.knowledge_base_storage_mb_used} MB / {quotas.knowledge_base_storage_mb_limit} MB
              </span>
            </div>
            <Progress 
              value={(quotas.knowledge_base_storage_mb_used / quotas.knowledge_base_storage_mb_limit) * 100} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              {quotas.knowledge_base_storage_mb_limit - quotas.knowledge_base_storage_mb_used} MB remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage Activity */}
      {usageLogs && usageLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest AI feature usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usageLogs.slice(0, 5).map((log) => {
                const config = FEATURE_CONFIG[log.feature_type as keyof typeof FEATURE_CONFIG];
                const IconComponent = config?.icon || FileText;
                
                return (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">
                          {config?.label || log.feature_type}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      +{log.usage_amount}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}