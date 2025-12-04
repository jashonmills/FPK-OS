import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Clock, Brain, Target, TrendingUp } from 'lucide-react';

/**
 * StudyTipsCard Component
 * 
 * Displays helpful study tips and learning techniques
 * Static content - no API calls or dynamic data
 */
export const StudyTipsCard: React.FC = () => {
  const tips = [
    {
      icon: Brain,
      title: 'Active Recall',
      description: 'Test yourself regularly without looking at notes',
      tip: 'Close your book and try to remember key concepts'
    },
    {
      icon: Clock,
      title: 'Spaced Repetition',
      description: 'Review material at increasing intervals',
      tip: 'Review after 1 day, 3 days, 1 week, 1 month'
    },
    {
      icon: BookOpen,
      title: 'Feynman Technique',
      description: 'Explain concepts in simple terms',
      tip: 'If you can\'t explain it simply, you don\'t understand it'
    },
    {
      icon: Target,
      title: 'Focus Sessions',
      description: 'Use 25-minute focused study blocks',
      tip: 'Pomodoro: 25 min work, 5 min break'
    },
    {
      icon: TrendingUp,
      title: 'Progressive Learning',
      description: 'Start simple, gradually increase difficulty',
      tip: 'Master fundamentals before advancing'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Study Tips
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Pro Tips
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div 
                key={index}
                className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {tip.description}
                    </p>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 flex-shrink-0">
                        TIP
                      </Badge>
                      <p className="text-xs text-muted-foreground italic">
                        {tip.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed border-border">
          <p className="text-xs text-muted-foreground text-center">
            💡 <span className="font-medium">Pro Tip:</span> Ask the AI Coach to help you create a personalized study plan!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
