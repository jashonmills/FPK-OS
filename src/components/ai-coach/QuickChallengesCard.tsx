
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, BookOpen, Target } from 'lucide-react';
import QuickReview from './challenges/QuickReview';
import AccuracyChallenge from './challenges/AccuracyChallenge';
import SpeedTest from './challenges/SpeedTest';

interface Challenge {
  id: string;
  text: string;
  icon: React.ComponentType<any>;
  action: () => void;
  component: React.ComponentType<any>;
}

interface QuickChallengesCardProps {
  challenges?: Challenge[];
}

const QuickChallengesCard: React.FC<QuickChallengesCardProps> = ({ challenges }) => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  // Enhanced challenges with component mapping
  const enhancedChallenges: Challenge[] = [
    {
      id: 'quick-review',
      text: `Quick review: 3 random flashcards`,
      icon: BookOpen,
      action: () => setActiveChallenge('quick-review'),
      component: QuickReview
    },
    {
      id: 'accuracy-challenge',
      text: 'Accuracy challenge: Score 80%+ on 5 cards',
      icon: Target,
      action: () => setActiveChallenge('accuracy-challenge'),
      component: AccuracyChallenge
    },
    {
      id: 'speed-test',
      text: 'Speed test: Answer 5 cards in 2 minutes',
      icon: Zap,
      action: () => setActiveChallenge('speed-test'),
      component: SpeedTest
    }
  ];

  const activeChallengData = enhancedChallenges.find(c => c.id === activeChallenge);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
          <span className="truncate">Quick Study Challenges</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        {/* Challenge Container - Responsive Grid */}
        <div className="challenge-container grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Challenge List */}
          <div className="challenge-list space-y-2 sm:space-y-3 lg:col-span-1">
            {enhancedChallenges.map((challenge) => (
              <Button 
                key={challenge.id}
                variant={activeChallenge === challenge.id ? "default" : "outline"} 
                className={`w-full justify-start text-left h-auto py-3 px-3 sm:py-4 sm:px-4 transition-all duration-200 ${
                  activeChallenge === challenge.id 
                    ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={challenge.action}
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  <challenge.icon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed text-left flex-1 whitespace-normal">
                    {challenge.text}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          {/* Challenge Detail */}
          <div className="challenge-detail lg:col-span-2 mt-4 lg:mt-0">
            {activeChallengData ? (
              <activeChallengData.component />
            ) : (
              <Card className="h-full min-h-[200px] lg:min-h-[300px]">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
                    Select a challenge to begin!
                  </h3>
                  <p className="text-sm text-muted-foreground italic max-w-sm leading-relaxed">
                    Choose a study challenge from the list to start practicing and improving your skills.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Modal for Very Small Screens */}
        {activeChallenge && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:hidden max-[480px]:flex lg:hidden">
            <div className="w-full max-w-sm bg-background rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Challenge</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveChallenge(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {activeChallengData && (
                  <activeChallengData.component />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickChallengesCard;
