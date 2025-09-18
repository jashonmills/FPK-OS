import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  BookOpen,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useMisconceptions } from '@/hooks/useMisconceptions';
import { formatDistanceToNow } from 'date-fns';

interface MisconceptionsSectionProps {
  cohortId?: string;
  isCompact?: boolean;
}

export const MisconceptionsSection: React.FC<MisconceptionsSectionProps> = ({
  cohortId,
  isCompact = false
}) => {
  const { 
    clusters, 
    highConfidenceClusters, 
    widespreadClusters, 
    isLoading 
  } = useMisconceptions({ cohort_id: cohortId, window: '7d', top_k: 10 });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSupportCountLevel = (count: number) => {
    if (count >= 15) return 'widespread';
    if (count >= 8) return 'common';
    if (count >= 3) return 'emerging';
    return 'isolated';
  };

  const getSupportCountColor = (count: number) => {
    const level = getSupportCountLevel(count);
    switch (level) {
      case 'widespread': return 'text-red-600 bg-red-50';
      case 'common': return 'text-orange-600 bg-orange-50';
      case 'emerging': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patterns</p>
                <p className="text-2xl font-bold">{clusters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-2xl font-bold text-green-600">{highConfidenceClusters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Widespread</p>
                <p className="text-2xl font-bold text-orange-600">{widespreadClusters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Misconception Clusters */}
      {clusters.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No misconceptions detected</h3>
            <p className="text-sm text-muted-foreground">
              Great news! No common misconception patterns have been identified in the selected timeframe.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`space-y-4 ${isCompact ? 'max-h-96 overflow-y-auto' : ''}`}>
          {clusters.map((cluster) => (
            <Card key={cluster.id} className={`border-l-4 ${getConfidenceColor(cluster.confidence)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getConfidenceColor(cluster.confidence)}`}>
                    <Target className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{cluster.label}</h4>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`text-xs ${getSupportCountColor(cluster.support_count)}`}>
                            <Users className="h-3 w-3 mr-1" />
                            {cluster.support_count} students
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(cluster.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {getSupportCountLevel(cluster.support_count)}
                          </Badge>
                        </div>

                        {/* Representative Answers */}
                        {cluster.representative_answers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Common incorrect responses:
                            </p>
                            <div className="space-y-1">
                              {cluster.representative_answers.slice(0, isCompact ? 1 : 2).map((answer, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-xs italic border-l-2 border-gray-300">
                                  "{answer}"
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Linked Outcomes */}
                        {cluster.linked_outcomes.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Related learning outcomes:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {cluster.linked_outcomes.slice(0, isCompact ? 2 : 4).map((outcome, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {outcome}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Actions */}
                        {!isCompact && cluster.suggested_actions && cluster.suggested_actions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Suggested interventions:</p>
                            <div className="flex flex-wrap gap-2">
                              {cluster.suggested_actions.slice(0, 2).map((action, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs">
                                  {action.label || action.action}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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