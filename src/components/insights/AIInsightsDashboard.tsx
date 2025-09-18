import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Target,
  RefreshCw,
  Eye,
  EyeOff 
} from 'lucide-react';
import { useAIInbox } from '@/hooks/useAIInbox';
import { useRiskRadar } from '@/hooks/useRiskRadar';
import { useMisconceptions } from '@/hooks/useMisconceptions';
import { useEngagementMatrix } from '@/hooks/useEngagementMatrix';
import { AIInboxSection } from './AIInboxSection';
import { RiskRadarSection } from './RiskRadarSection';
import { MisconceptionsSection } from './MisconceptionsSection';
import { EngagementMatrixSection } from './EngagementMatrixSection';

interface AIInsightsDashboardProps {
  orgId?: string;
  cohortId?: string;
  courseId?: string;
  role?: 'admin' | 'instructor' | 'owner';
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  orgId,
  cohortId,
  courseId,
  role = 'instructor'
}) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [isCompact, setIsCompact] = useState(false);

  const inboxOptions = { org_id: orgId, cohort_id: cohortId, limit: 20 };
  const riskOptions = { cohort_id: cohortId, window: '7d', top_k: 50 };
  const misconceptionOptions = { cohort_id: cohortId, window: '7d', top_k: 10 };
  const engagementOptions = { cohort_id: cohortId, window: '7d' };

  const { inboxCards, isLoading: inboxLoading, refetch: refetchInbox } = useAIInbox(inboxOptions);
  const { alerts, isLoading: riskLoading, refetch: refetchRisk } = useRiskRadar(riskOptions);
  const { clusters, isLoading: misconceptionLoading, refetch: refetchMisconceptions } = useMisconceptions(misconceptionOptions);
  const { matrix, isLoading: engagementLoading, refetch: refetchEngagement } = useEngagementMatrix(engagementOptions);

  const handleRefreshAll = () => {
    refetchInbox();
    refetchRisk();
    refetchMisconceptions();
    refetchEngagement();
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'inbox': return <Brain className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'misconceptions': return <Target className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  const getAlertCounts = () => ({
    inbox: inboxCards.filter(card => card.severity === 'high' || card.severity === 'critical').length,
    risk: alerts.filter(alert => alert.risk_score > 0.8).length,
    misconceptions: clusters.filter(cluster => cluster.confidence > 0.8).length,
    engagement: matrix?.quadrants.low_eng_low_mastery || 0
  });

  const alertCounts = getAlertCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">AI Learning Insights</h2>
          </div>
          <Badge variant="outline" className="text-sm">
            {role === 'admin' ? 'Platform View' : 'Organization View'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompact(!isCompact)}
          >
            {isCompact ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isCompact ? 'Expand' : 'Compact'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={inboxLoading || riskLoading || misconceptionLoading || engagementLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${
              (inboxLoading || riskLoading || misconceptionLoading || engagementLoading) ? 'animate-spin' : ''
            }`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{alertCounts.inbox}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">{alertCounts.risk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Misconceptions</p>
                <p className="text-2xl font-bold">{alertCounts.misconceptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Struggling</p>
                <p className="text-2xl font-bold">{alertCounts.engagement}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            {getTabIcon('inbox')}
            AI Inbox
            {alertCounts.inbox > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {alertCounts.inbox}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            {getTabIcon('risk')}
            Risk Radar
            {alertCounts.risk > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {alertCounts.risk}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="misconceptions" className="flex items-center gap-2">
            {getTabIcon('misconceptions')}
            Patterns
            {alertCounts.misconceptions > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {alertCounts.misconceptions}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            {getTabIcon('engagement')}
            Engagement
            {alertCounts.engagement > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {alertCounts.engagement}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <AIInboxSection 
            orgId={orgId}
            cohortId={cohortId}
            isCompact={isCompact}
          />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskRadarSection 
            cohortId={cohortId}
            isCompact={isCompact}
          />
        </TabsContent>

        <TabsContent value="misconceptions" className="space-y-4">
          <MisconceptionsSection 
            cohortId={cohortId}
            isCompact={isCompact}
          />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementMatrixSection 
            cohortId={cohortId}
            isCompact={isCompact}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};