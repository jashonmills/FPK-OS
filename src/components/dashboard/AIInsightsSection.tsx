
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudyInsights } from '@/hooks/useStudyInsights';
import { Brain, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIInsightsSection = () => {
  const { insights, isLoading } = useStudyInsights();
  const navigate = useNavigate();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'pattern': return Brain;
      case 'recommendation': return Target;
      case 'motivation': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topInsights = insights.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/ai-study-coach')}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No insights yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Continue learning to get personalized AI insights
            </p>
            <Button onClick={() => navigate('/dashboard/ai-study-coach')}>
              <Brain className="h-4 w-4 mr-2" />
              Talk to AI Coach
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {topInsights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getInsightColor(insight.priority)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsSection;
