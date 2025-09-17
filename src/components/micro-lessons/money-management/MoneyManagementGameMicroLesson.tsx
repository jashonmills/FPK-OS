import React, { useState, useReducer, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CreditCard, 
  Target,
  AlertCircle,
  Trophy,
  Clock,
  BookOpen
} from 'lucide-react';
import { MicroLessonContainer, MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';
import { gameReducer, initialState } from './game-state';
import { ALL_SCENARIOS } from './game-data';

interface GameProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  isCompleted?: boolean;
  trackInteraction?: (event: string, details: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

const MoneyManagementGame: React.FC<GameProps> = ({
  onComplete,
  onNext,
  hasNext = false,
  isCompleted = false,
  trackInteraction,
  lessonId,
  lessonTitle
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dragAmount, setDragAmount] = useState(10);

  const {
    phase,
    week,
    balance,
    savingsGoal,
    creditScore,
    envelopes,
    monthlyIncome,
    currentSavings,
    currentEmergencyFund,
    score,
    isGameOver,
    currentScenario,
    feedbackMessage,
    month,
    currentDebt,
    creditCardBalance,
    creditCardLimit
  } = state;

  // Track game interactions
  const trackGameInteraction = (action: string, details: any = {}) => {
    trackInteraction?.(action, {
      lessonId,
      lessonTitle: "Financial Decision-Making Game",
      gamePhase: phase,
      week,
      month,
      ...details
    });
  };

  // Welcome Screen Component
  const WelcomeScreen = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
      <div className="flex justify-center items-center gap-3 mb-6">
        <DollarSign className="w-16 h-16 text-primary" />
        <Trophy className="w-16 h-16 text-yellow-500" />
        <TrendingUp className="w-16 h-16 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-foreground">
        Money Management Game
      </h1>
      
      <p className="text-xl text-muted-foreground leading-relaxed">
        Put your financial knowledge to the test! Make real-world money decisions, 
        manage your budget, and see how your choices impact your financial future.
      </p>

      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Game Overview</h3>
        <ul className="text-left space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Set your monthly budget and financial goals</span>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Make smart decisions in real-world scenarios</span>
          </li>
          <li className="flex items-start gap-2">
            <PiggyBank className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Build savings and manage debt wisely</span>
          </li>
          <li className="flex items-start gap-2">
            <Trophy className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Achieve financial stability and reach your goals</span>
          </li>
        </ul>
      </div>

      <Button 
        size="lg" 
        onClick={() => {
          setShowWelcome(false);
          trackGameInteraction('game_started');
        }}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8"
      >
        Start Your Financial Journey
      </Button>
    </div>
  );

  // Budget Planning Phase
  const BudgetPlanningScreen = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="w-6 h-6" />
            Plan Your Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Monthly Income</h3>
                <div className="text-2xl font-bold text-green-600">
                  ${monthlyIncome.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Savings Goal</h3>
                <div className="text-2xl font-bold text-primary">
                  ${savingsGoal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Allocate Your Budget</h3>
              <div className="space-y-3">
                {Object.entries(envelopes).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (amount >= 10) {
                            dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount - 10 });
                          }
                        }}
                        disabled={amount < 10}
                      >
                        -$10
                      </Button>
                      <span className="w-20 text-center font-mono">
                        ${amount.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const remainingBudget = monthlyIncome - Object.values(envelopes).reduce((sum, val) => sum + val, 0);
                          if (remainingBudget >= 10) {
                            dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount + 10 });
                          }
                        }}
                        disabled={Object.values(envelopes).reduce((sum, val) => sum + val, 0) >= monthlyIncome}
                      >
                        +$10
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Remaining Budget:</span>
              <span className="text-lg font-bold">
                ${(monthlyIncome - Object.values(envelopes).reduce((sum, val) => sum + val, 0)).toFixed(2)}
              </span>
            </div>
            {/* Debug info */}
            <div className="text-xs text-muted-foreground mt-2">
              Debug: Total allocated: ${Object.values(envelopes).reduce((sum, val) => sum + val, 0).toFixed(2)} / ${monthlyIncome.toFixed(2)}
            </div>
            {Object.values(envelopes).reduce((sum, val) => sum + val, 0) !== monthlyIncome && (
              <div className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                You must allocate your entire ${monthlyIncome.toFixed(2)} monthly income before starting scenarios.
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            onClick={() => {
              console.log('Button clicked!', { envelopes, monthlyIncome });
              console.log('Total allocated:', Object.values(envelopes).reduce((sum, val) => sum + val, 0));
              console.log('Should be disabled?', Object.values(envelopes).reduce((sum, val) => sum + val, 0) !== monthlyIncome);
              dispatch({ type: 'START_SCENARIOS' });
              trackGameInteraction('budget_planned', { envelopes });
            }}
            disabled={Object.values(envelopes).reduce((sum, val) => sum + val, 0) !== monthlyIncome}
            className="w-full"
          >
            Start Week {week} Scenarios
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Scenario Screen
  const ScenarioScreen = () => {
    if (!currentScenario) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Week {week} - Scenario {state.scenarioIndex + 1} of {state.weeklyScenarios?.length || 5}
              </CardTitle>
              <Badge variant="secondary">
                Score: {score}
              </Badge>
            </div>
            <Progress 
              value={((state.scenarioIndex + 1) / (state.weeklyScenarios?.length || 5)) * 100} 
              className="h-2" 
            />
          </CardHeader>
        </Card>

        {/* Current Balance Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="text-xl font-bold">${balance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Savings</div>
                <div className="text-xl font-bold text-green-600">${currentSavings.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Emergency</div>
                <div className="text-xl font-bold text-blue-600">${currentEmergencyFund.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Credit Score</div>
                <div className="text-xl font-bold">{creditScore}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentScenario.title}</CardTitle>
            <Badge variant="outline" className="w-fit">
              {currentScenario.category}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{currentScenario.description}</p>
            
            <div className="space-y-3">
              {currentScenario.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-left p-4 h-auto"
                  onClick={() => {
                    dispatch({ type: 'MAKE_CHOICE', option });
                    trackGameInteraction('scenario_choice', {
                      scenario: currentScenario.title,
                      choice: option.text,
                      impact: option.impact
                    });
                  }}
                >
                  <div>
                    <div className="font-medium">{option.text}</div>
                    {option.impact && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Impact: {option.impact}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Message */}
        {feedbackMessage && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{feedbackMessage}</p>
              </div>
              <Button 
                className="mt-4"
                onClick={() => dispatch({ type: 'ADVANCE_SCENARIO' })}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Weekly Summary Screen
  const WeeklySummaryScreen = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Week {week} Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-muted-foreground">Financial Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{creditScore}</div>
              <div className="text-sm text-muted-foreground">Credit Score</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">This Week's Decisions</h3>
            {state.weekLog.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{entry.title || entry.type}</div>
                  <div className="text-sm text-muted-foreground">{entry.option || entry.note}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.amount > 0 ? '+' : ''}${entry.amount?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            size="lg" 
            className="w-full mt-6"
            onClick={() => {
              if (week >= 4) {
                dispatch({ type: 'GAME_OVER', status: 'completed' });
                trackGameInteraction('game_completed', { 
                  finalScore: score, 
                  finalBalance: balance,
                  weeks: week 
                });
              } else {
                dispatch({ type: 'NEXT_WEEK' });
                trackGameInteraction('week_completed', { week, score, balance });
              }
            }}
          >
            {week >= 4 ? 'Complete Game' : `Continue to Week ${week + 1}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Game Over/Reflection Screen
  const ReflectionScreen = () => (
    <div className="max-w-4xl mx-auto space-y-6 text-center">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl">Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl text-muted-foreground">
            Congratulations! You've completed the Money Management Game and gained practical experience with real-world financial decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Final Balance</div>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-muted-foreground">Financial Wisdom Score</div>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{creditScore}</div>
              <div className="text-sm text-muted-foreground">Credit Score</div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Key Takeaways</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Smart budgeting helps you make informed financial decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Emergency funds protect you from unexpected expenses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Every financial choice has long-term consequences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Building good credit habits early pays off over time</span>
              </li>
            </ul>
          </div>

          <Button 
            size="lg" 
            onClick={() => {
              onComplete?.();
              trackGameInteraction('lesson_completed', { 
                finalScore: score, 
                finalBalance: balance 
              });
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Complete Lesson
          </Button>

          {hasNext && (
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onNext}
              className="ml-4"
            >
              Continue to Next Lesson
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Main render logic
  if (showWelcome) {
    return <WelcomeScreen />;
  }

  if (phase === 'PLAN') {
    return <BudgetPlanningScreen />;
  }

  if (phase === 'LIVE') {
    return <ScenarioScreen />;
  }

  if (phase === 'WEEKLY_SUMMARY') {
    return <WeeklySummaryScreen />;
  }

  if (phase === 'REFLECT' || isGameOver) {
    return <ReflectionScreen />;
  }

  return <div>Loading...</div>;
};

// Main lesson component using MicroLessonContainer
export const MoneyManagementGameMicroLesson: React.FC<GameProps> = (props) => {
  const lessonData: MicroLessonData = {
    id: 'money-management-game',
    moduleTitle: 'Financial Decision-Making Game',
    totalScreens: 1,
    screens: [
      {
        id: 'game',
        type: 'practice',
        title: 'Interactive Money Management Simulation',
        content: <MoneyManagementGame {...props} />,
        estimatedTime: 45
      }
    ]
  };

  return (
    <MicroLessonContainer
      lessonData={lessonData}
      onComplete={props.onComplete}
      onNext={props.onNext}
      hasNext={props.hasNext}
    />
  );
};