import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, BookOpen, Target, CheckSquare, X } from 'lucide-react';
import QuickReview from './challenges/QuickReview';
import AccuracyChallenge from './challenges/AccuracyChallenge';
import SpeedTest from './challenges/SpeedTest';
import CustomPractice from './challenges/CustomPractice';
import FlashcardSelectionModal from '@/components/study/FlashcardSelectionModal';
import ErrorBoundary from '@/components/ErrorBoundary';

interface Challenge {
  id: string;
  text: string;
  customText: string;
  icon: React.ComponentType<any>;
  action: () => void;
  component: React.ComponentType<any>;
  colorClass: string;
  hoverColorClass: string;
}

interface QuickChallengesCardProps {
  challenges?: Challenge[];
}

const QuickChallengesCard: React.FC<QuickChallengesCardProps> = ({ challenges }) => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [customSelectedCards, setCustomSelectedCards] = useState<any[]>([]);
  const [isCustomModeActive, setIsCustomModeActive] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);

  // Enhanced challenges with component mapping, colors, and custom text
  const enhancedChallenges: Challenge[] = [
    {
      id: 'quick-review',
      text: `Quick review: 3 random flashcards`,
      customText: `Quick review: ${customSelectedCards.length} selected cards`,
      icon: BookOpen,
      action: () => setActiveChallenge('quick-review'),
      component: QuickReview,
      colorClass: 'bg-blue-50 border-blue-200 text-blue-800',
      hoverColorClass: 'hover:bg-blue-100 hover:border-blue-300'
    },
    {
      id: 'accuracy-challenge',
      text: 'Accuracy challenge: Score 80%+ on 5 cards',
      customText: `Accuracy challenge: Score 80%+ on ${Math.min(5, customSelectedCards.length)} selected cards`,
      icon: Target,
      action: () => setActiveChallenge('accuracy-challenge'),
      component: AccuracyChallenge,
      colorClass: 'bg-green-50 border-green-200 text-green-800',
      hoverColorClass: 'hover:bg-green-100 hover:border-green-300'
    },
    {
      id: 'speed-test',
      text: 'Speed test: Answer 5 cards in 2 minutes',
      customText: `Speed test: Answer ${Math.min(5, customSelectedCards.length)} selected cards in 2 minutes`,
      icon: Zap,
      action: () => setActiveChallenge('speed-test'),
      component: SpeedTest,
      colorClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      hoverColorClass: 'hover:bg-yellow-100 hover:border-yellow-300'
    },
    {
      id: 'custom-practice',
      text: 'Custom practice: Choose your own cards',
      customText: `Custom practice: ${customSelectedCards.length} cards selected`,
      icon: CheckSquare,
      action: () => setShowSelectionModal(true),
      component: CustomPractice,
      colorClass: 'bg-purple-50 border-purple-200 text-purple-800',
      hoverColorClass: 'hover:bg-purple-100 hover:border-purple-300'
    }
  ];

  const activeChallengData = enhancedChallenges.find(c => c.id === activeChallenge);

  const handleCustomPracticeStart = (selectedFlashcards: any[]) => {
    try {
      // Validate flashcards data
      if (!Array.isArray(selectedFlashcards)) {
        console.warn('Invalid flashcards data received:', selectedFlashcards);
        setComponentError('Invalid flashcard selection');
        return;
      }
      
      setCustomSelectedCards(selectedFlashcards || []);
      setIsCustomModeActive(true);
      setShowSelectionModal(false);
      setActiveChallenge('custom-practice');
      setComponentError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error in custom practice start:', error);
      setComponentError('Failed to start custom practice');
    }
  };

  const handleClearCustomSelection = () => {
    try {
      setCustomSelectedCards([]);
      setIsCustomModeActive(false);
      setComponentError(null); // Clear any errors
      // Keep the current active challenge but it will now use default behavior
    } catch (error) {
      console.error('Error clearing custom selection:', error);
      setComponentError('Failed to clear selection');
    }
  };

  const renderChallengeComponent = () => {
    // Error state handling
    if (componentError) {
      return (
        <Card className="h-full min-h-[200px] lg:min-h-[300px]">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-700">
              Component Error
            </h3>
            <p className="text-sm text-red-600 mb-4">{componentError}</p>
            <Button 
              onClick={() => {
                setComponentError(null);
                setActiveChallenge(null);
                setIsCustomModeActive(false);
                setCustomSelectedCards([]);
              }}
              variant="outline"
              size="sm"
            >
              Reset Component
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!activeChallengData) return null;

    try {
      const ComponentToRender = activeChallengData.component;
      
      // Pass custom cards to all challenge components when in custom mode
      if (isCustomModeActive && Array.isArray(customSelectedCards) && customSelectedCards.length > 0) {
        if (activeChallenge === 'custom-practice') {
          return <CustomPractice selectedCards={customSelectedCards} />;
        } else {
          // Pass custom cards to other challenges with error boundary
          return <ComponentToRender customCards={customSelectedCards} />;
        }
      }
      
      // Default behavior when not in custom mode
      if (activeChallenge === 'custom-practice') {
        return <CustomPractice selectedCards={[]} />;
      }
      
      return <ComponentToRender />;
    } catch (error) {
      console.error('Error rendering challenge component:', error);
      setComponentError('Failed to load challenge component');
      return null;
    }
  };

  return (
    <ErrorBoundary>
      <Card className="w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
              <span className="truncate">Quick Study Challenges</span>
            </CardTitle>
            {isCustomModeActive && (
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                   Custom Set ({Array.isArray(customSelectedCards) ? customSelectedCards.length : 0})
                 </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearCustomSelection}
                  className="h-7 px-2 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          {/* Challenge Container - Responsive Grid */}
          <div className="challenge-container grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Challenge List */}
            <div className="challenge-list space-y-2 sm:space-y-3 lg:col-span-1">
              {enhancedChallenges.map((challenge) => (
                <div key={challenge.id} className="relative">
                  <Button 
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-3 px-3 sm:py-4 sm:px-4 transition-all duration-200 border-2 ${
                      activeChallenge === challenge.id 
                        ? `${challenge.colorClass} ring-2 ring-offset-2 shadow-md border-opacity-100` 
                        : `${challenge.colorClass} border-opacity-50 ${challenge.hoverColorClass}`
                    } ${
                      isCustomModeActive && challenge.id !== 'custom-practice' 
                        ? 'ring-1 ring-purple-300 ring-opacity-50' 
                        : ''
                    }`}
                    onClick={challenge.action}
                  >
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <challenge.icon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-base leading-relaxed text-left whitespace-normal block">
                          {isCustomModeActive && customSelectedCards.length > 0 
                            ? challenge.customText 
                            : challenge.text
                          }
                        </span>
                        {isCustomModeActive && challenge.id !== 'custom-practice' && (
                          <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">
                            Using Custom Set
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>

            {/* Challenge Detail */}
            <div className="challenge-detail lg:col-span-2 mt-4 lg:mt-0">
              {activeChallengData ? (
                renderChallengeComponent()
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
                     {isCustomModeActive && Array.isArray(customSelectedCards) && (
                       <Badge className="mt-3 bg-purple-100 text-purple-800 border-purple-200">
                         Custom mode active ({customSelectedCards.length || 0} cards selected)
                       </Badge>
                     )}
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
                  {renderChallengeComponent()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Practice Selection Modal */}
      <FlashcardSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onConfirm={handleCustomPracticeStart}
        studyMode="memory_test"
      />
    </ErrorBoundary>
  );
};

export default QuickChallengesCard;
