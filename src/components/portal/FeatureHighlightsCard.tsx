import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Volume2, Target, Sparkles, Zap } from 'lucide-react';

/**
 * FeatureHighlightsCard Component
 * 
 * Displays key features of the AI Study Coach Portal
 * Static content - no API calls or dynamic data
 */
export const FeatureHighlightsCard: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Personalized Learning',
      description: 'AI adapts to your learning style and pace',
      color: 'text-purple-600'
    },
    {
      icon: MessageSquare,
      title: 'Socratic Method',
      description: 'Learn through guided questions and exploration',
      color: 'text-blue-600'
    },
    {
      icon: Volume2,
      title: 'Voice Interaction',
      description: 'Speak your questions and hear responses',
      color: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Focused Practice',
      description: 'Target specific topics and concepts',
      color: 'text-orange-600'
    },
    {
      icon: Sparkles,
      title: 'Smart Responses',
      description: 'Context-aware answers to your questions',
      color: 'text-pink-600'
    },
    {
      icon: Zap,
      title: 'Instant Help',
      description: 'Get assistance whenever you need it',
      color: 'text-yellow-600'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Features
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`flex-shrink-0 ${feature.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium mb-0.5">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
