
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface Challenge {
  text: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

interface QuickChallengesCardProps {
  challenges: Challenge[];
}

const QuickChallengesCard: React.FC<QuickChallengesCardProps> = ({ challenges }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-yellow-600" />
          Quick Study Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.map((challenge, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="w-full justify-start text-left h-auto p-3"
            onClick={challenge.action}
          >
            <challenge.icon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{challenge.text}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickChallengesCard;
