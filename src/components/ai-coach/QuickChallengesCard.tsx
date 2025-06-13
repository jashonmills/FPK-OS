
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
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
          <span className="truncate">Quick Study Challenges</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 pt-0">
        {challenges.map((challenge, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="w-full justify-start text-left h-auto p-2 sm:p-3 min-h-[2.5rem] sm:min-h-[3rem]"
            onClick={challenge.action}
          >
            <challenge.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm leading-tight break-words">{challenge.text}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickChallengesCard;
