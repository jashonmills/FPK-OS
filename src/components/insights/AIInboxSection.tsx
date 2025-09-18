import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Users, 
  X,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useAIInbox } from '@/hooks/useAIInbox';
import { formatDistanceToNow } from 'date-fns';
import type { AIInboxCard } from '@/types/ai-insights';

interface AIInboxSectionProps {
  orgId?: string;
  cohortId?: string;
  isCompact?: boolean;
}

export const AIInboxSection: React.FC<AIInboxSectionProps> = ({
  orgId,
  cohortId,
  isCompact = false
}) => {
  const { 
    inboxCards, 
    isLoading, 
    dismissCard, 
    isDismissing, 
    trackCardInteraction 
  } = useAIInbox({ org_id: orgId, cohort_id: cohortId, limit: 20 });

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'risk_radar': return <AlertTriangle className="h-5 w-5" />;
      case 'misconception_cluster': return <Target className="h-5 w-5" />;
      case 'gap_analysis': return <TrendingUp className="h-5 w-5" />;
      case 'engagement_alert': return <Users className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleCardAction = (card: AIInboxCard) => {
    trackCardInteraction(card.id, 'action_clicked');
    // Handle action based on card.cta.action
    console.log('Card action:', card.cta);
  };

  const handleDismissCard = (cardId: string) => {
    trackCardInteraction(cardId, 'dismissed');
    dismissCard(cardId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Inbox</h3>
        <Badge variant="outline" className="text-sm">
          {inboxCards.length} insights
        </Badge>
      </div>

      {inboxCards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              No new AI insights at the moment. Check back later for updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`space-y-3 ${isCompact ? 'max-h-96 overflow-y-auto' : ''}`}>
          {inboxCards.map((card) => (
            <Card key={card.id} className={`border-l-4 ${getSeverityColor(card.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(card.severity)}`}>
                    {getCardIcon(card.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{card.title}</h4>
                        {card.subtitle && (
                          <p className="text-sm text-muted-foreground mb-2">{card.subtitle}</p>
                        )}
                        
                        {card.why && card.why.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Why this matters:</p>
                            <ul className="text-xs space-y-1">
                              {card.why.map((reason, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(card.created_at), { addSuffix: true })}
                          <Badge variant="outline" className="text-xs">
                            {Math.round(card.confidence * 100)}% confident
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissCard(card.id)}
                        disabled={isDismissing}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {!isCompact && (
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleCardAction(card)}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {card.cta.label || 'Take Action'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};