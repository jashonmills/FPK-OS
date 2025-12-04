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
  BookOpen,
  Calculator,
  BarChart3,
  Receipt,
  Minus,
  Plus,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  TrendingDown as TrendDown,
  TrendingUp as TrendUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [ccPaymentAmount, setCcPaymentAmount] = useState('');
  const [debtPaymentAmount, setDebtPaymentAmount] = useState('');
  const [outcomeDelayComplete, setOutcomeDelayComplete] = useState(false);

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
    creditCardLimit,
    creditCardInterestRate,
    debtInterestRate
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

  const BudgetPlanningScreen = () => {
    const remainingBudget = monthlyIncome - Object.values(envelopes).reduce((sum, val) => sum + val, 0) - (state.creditCardPayment || 0);
    const weeklyBudgets = Object.entries(envelopes).reduce((acc, [category, amount]) => {
      acc[category] = (amount / 4).toFixed(2); // Weekly allocation
      return acc;
    }, {} as Record<string, string>);

    const BudgetControls = ({ category, amount }: { category: string; amount: number }) => {
      const increments = [1, 10, 25, 50];
      
      return (
        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{category}</span>
            <div className="text-lg font-bold text-primary">
              ${amount.toFixed(2)}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Weekly: ${category === 'Credit Card Payment' ? (amount / 4).toFixed(2) : weeklyBudgets[category]}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Subtract buttons */}
            <div className="flex gap-1">
              {increments.map(inc => (
                <Button
                  key={`sub-${inc}`}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (amount >= inc) {
                      if (category === 'Credit Card Payment') {
                        dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount - inc });
                      } else {
                        dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount - inc });
                      }
                    }
                  }}
                  disabled={amount < inc}
                  className="text-xs px-2"
                >
                  -${inc}
                </Button>
              ))}
            </div>
            
            <div className="w-px bg-border"></div>
            
            {/* Add buttons */}
            <div className="flex gap-1">
              {increments.map(inc => (
                <Button
                  key={`add-${inc}`}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (remainingBudget >= inc) {
                      if (category === 'Credit Card Payment') {
                        dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount + inc });
                      } else {
                        dispatch({ type: 'ALLOCATE_BUDGET', category, amount: amount + inc });
                      }
                    }
                  }}
                  disabled={remainingBudget < inc}
                  className="text-xs px-2"
                >
                  +${inc}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-6 h-6" />
              Plan Your Monthly Budget - Week {week}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Income and Goals */}
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Monthly Income</h3>
                  <div className="text-2xl font-bold text-green-600">
                    ${monthlyIncome.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Weekly: ${(monthlyIncome / 4).toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Savings Goal</h3>
                  <div className="text-2xl font-bold text-primary">
                    ${savingsGoal.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Weekly: ${(savingsGoal / 4).toFixed(2)}
                  </div>
                </div>

                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Remaining Budget</h3>
                  <div className={`text-2xl font-bold ${remainingBudget === 0 ? 'text-green-600' : remainingBudget > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ${remainingBudget.toFixed(2)}
                  </div>
                  {remainingBudget !== 0 && (
                    <div className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Must be $0.00 to continue
                    </div>
                  )}
                </div>
              </div>

              {/* Budget Allocation */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Allocate Your Budget</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  Use the increment buttons to precisely allocate your budget. Weekly amounts show how much you'll have each week.
                </div>
                
                {Object.entries(envelopes).map(([category, amount]) => (
                  <BudgetControls key={category} category={category} amount={amount} />
                ))}
                
                {/* Credit Card Payment Option */}
                {creditCardBalance > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit Card Payment
                    </h4>
                    <div className="text-sm text-red-600 mb-3">
                      Current Balance: ${creditCardBalance.toFixed(2)} 
                      <span className="block text-xs">
                        Monthly Interest: ${(creditCardBalance * (creditCardInterestRate / 12)).toFixed(2)}
                        {' '}({(creditCardInterestRate * 100).toFixed(1)}% APR)
                      </span>
                    </div>
                    <BudgetControls category="Credit Card Payment" amount={state.creditCardPayment || 0} />
                    <div className="text-xs text-red-500 mt-2">
                      💡 Tip: Paying more toward credit cards reduces interest charges and improves your credit score!
                    </div>
                  </div>
                )}
                
                {/* Add credit card option even if no debt, for education */}
                {creditCardBalance === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Great! You have no credit card debt. Keep it that way by spending wisely!
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Budget Summary */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Weekly Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(envelopes).map(([category, amount]) => (
                    <div key={category} className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">{category}</div>
                      <div className="text-lg font-bold">${(amount / 4).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">per week</div>
                    </div>
                  ))}
                  {/* Add Credit Card Payment to summary if allocated */}
                  {state.creditCardPayment > 0 && (
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">Credit Card Payment</div>
                      <div className="text-lg font-bold text-red-600">${(state.creditCardPayment / 4).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">per week</div>
                    </div>
                  )}
                </div>
                
                {/* Show total allocated */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Weekly Allocation:</span>
                    <span className="text-lg font-bold">
                      ${((Object.values(envelopes).reduce((sum, val) => sum + val, 0) + (state.creditCardPayment || 0)) / 4).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From ${monthlyIncome.toFixed(2)} monthly income
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              onClick={() => {
                dispatch({ type: 'START_SCENARIOS' });
                trackGameInteraction('budget_planned', { envelopes, week });
              }}
              disabled={remainingBudget !== 0}
              className="w-full"
            >
              Start Week {week} Scenarios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
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
              <div>
                <div className="text-sm text-muted-foreground">Credit Card Debt</div>
                <div className={`text-xl font-bold ${creditCardBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${creditCardBalance.toFixed(2)}
                </div>
                {creditCardBalance > 0 && (
                  <div className="text-xs text-red-500">
                    ${(creditCardBalance * (creditCardInterestRate / 12)).toFixed(2)}/mo interest
                  </div>
                )}
              </div>
            </div>
            
            {/* Debt Warning */}
            {(creditCardBalance > 0 || currentDebt > 0) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Debt Alert</span>
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Total Debt: ${(creditCardBalance + currentDebt).toFixed(2)}
                  {creditCardBalance > 0 && (
                    <div>Credit Card APR: {(creditCardInterestRate * 100).toFixed(1)}% - Monthly Interest: ${(creditCardBalance * (creditCardInterestRate / 12)).toFixed(2)}</div>
                  )}
                  {currentDebt > 0 && (
                    <div>Other Debt APR: {(debtInterestRate * 100).toFixed(1)}% - Monthly Interest: ${(currentDebt * (debtInterestRate / 12)).toFixed(2)}</div>
                  )}
                </div>
              </div>
            )}
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
                  className="w-full justify-start text-left p-4 h-auto border-input bg-background hover:bg-muted hover:text-foreground transition-colors duration-200"
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
      </div>
    );
  };

  // Enhanced Scenario Outcome Summary Screen
  const ScenarioOutcomeSummaryScreen = () => {
    const { lastChoice } = state;
    if (!lastChoice) return null;

    const { scenario, option, balanceChange, creditChange, debtChange, scoreChange } = lastChoice;
    
    // Determine if this was a positive or negative choice based on score change
    const isPositiveOutcome = scoreChange >= 0;
    
    // Reset delay when component mounts - REMOVED TIMER
    useEffect(() => {
      console.log('🎯 ScenarioOutcome mounted - no timer, buttons always active');
    }, [lastChoice]);

    // Parse financial impacts for detailed breakdown
    const getFinancialImpacts = () => {
      const impacts = [];
      
      if (balanceChange !== 0) {
        impacts.push({
          type: 'Balance',
          amount: balanceChange,
          icon: balanceChange > 0 ? TrendUp : TrendDown,
          color: balanceChange > 0 ? 'text-green-600' : 'text-red-600'
        });
      }
      
      if (creditChange !== 0) {
        impacts.push({
          type: 'Credit Score',
          amount: creditChange,
          icon: creditChange > 0 ? TrendUp : TrendDown,
          color: creditChange > 0 ? 'text-green-600' : 'text-red-600'
        });
      }
      
      if (debtChange !== 0) {
        impacts.push({
          type: 'Debt',
          amount: debtChange,
          icon: debtChange > 0 ? TrendDown : TrendUp, // More debt is bad, less debt is good
          color: debtChange > 0 ? 'text-red-600' : 'text-green-600'
        });
      }
      
      return impacts;
    };

    const impacts = getFinancialImpacts();

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Outcome Indicator */}
        <Card className={`${isPositiveOutcome 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
        }`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isPositiveOutcome ? (
                <CheckCircle className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-orange-600" />
              )}
            </div>
            <CardTitle className={`text-2xl ${isPositiveOutcome ? 'text-green-800' : 'text-orange-800'}`}>
              {isPositiveOutcome ? 'Great Choice!' : 'Learning Opportunity'}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Scenario Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              What You Decided
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{scenario.title}</h4>
                <p className="text-muted-foreground mb-3">{scenario.description}</p>
                <div className="bg-card p-3 rounded border-l-4 border-primary">
                  <span className="font-medium">Your Choice: </span>
                  <span className="text-primary font-semibold">{option.text}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Impact Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Financial Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {impacts.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No immediate financial impact from this decision.
                </div>
              ) : (
                impacts.map((impact, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <impact.icon className={`w-6 h-6 ${impact.color}`} />
                      <span className="font-medium">{impact.type}</span>
                    </div>
                    <div className={`text-2xl font-bold ${impact.color}`}>
                      {impact.type === 'Credit Score' ? 
                        `${impact.amount > 0 ? '+' : ''}${impact.amount} pts` :
                        `${impact.amount > 0 ? '+' : ''}$${Math.abs(impact.amount).toFixed(2)}`
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Educational "Why" Statement */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Lightbulb className="w-6 h-6" />
              Why This Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg border border-blue-200">
              <p className="text-blue-900 leading-relaxed text-lg">
                {feedbackMessage}
              </p>
            </div>
            
            {/* Additional educational context based on choice type */}
            {option.impact && option.impact.includes('creditCard') && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-yellow-800 mb-1">Credit Card Education</h5>
                    <p className="text-sm text-yellow-700">
                      Using credit cards isn't inherently bad, but it's important to pay off balances quickly. 
                      At 18% APR, carrying a balance costs you significantly over time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Financial Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Current Financial Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Balance</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{creditScore}</div>
                <div className="text-sm text-muted-foreground">Credit Score</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className={`text-2xl font-bold ${(currentDebt + creditCardBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${(currentDebt + creditCardBalance).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Debt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              {/* Previous Scenario Button */}
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  if (state.scenarioIndex > 0) {
                    // Go back to previous scenario
                    const prevIndex = state.scenarioIndex - 1;
                    dispatch({ 
                      type: 'GO_TO_SCENARIO', 
                      payload: { 
                        scenarioIndex: prevIndex,
                        scenario: state.weeklyScenarios[prevIndex]
                      }
                    });
                  }
                }}
                disabled={state.scenarioIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Previous Scenario
              </Button>

              {/* Next Scenario Button */}
              <Button 
                size="lg" 
                onClick={() => {
                  console.log('🎯 Continue button clicked!');
                  dispatch({ type: 'CONTINUE_FROM_OUTCOME' });
                  trackGameInteraction('scenario_outcome_completed', {
                    scenario: scenario.title,
                    choice: option.text,
                    outcome: isPositiveOutcome ? 'positive' : 'negative'
                  });
                }}
                className="flex items-center gap-2"
              >
                Continue to Next Scenario
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Enhanced Weekly Summary Screen with comprehensive features
  const WeeklySummaryScreen = () => {
    // Calculate weekly analytics
    const weeklyIncome = state.weekLog
      .filter(entry => entry.amount > 0)
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const discretionarySpending = state.weekLog
      .filter(entry => entry.amount < 0 && (entry.type === 'Scenario' || entry.category === 'wants'))
      .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    
    const weeklyNetChange = state.weekLog
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);

    // Debt calculator functions
    const calculatePayoffTime = (balance: number, payment: number, apr: number) => {
      if (payment <= 0 || balance <= 0) return { months: 0, totalInterest: 0 };
      const monthlyRate = apr / 12;
      const months = Math.ceil(-Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate));
      const totalPaid = payment * months;
      const totalInterest = totalPaid - balance;
      return { months, totalInterest };
    };

    const handleDebtPayment = (type: 'credit' | 'debt', amount: number) => {
      if (amount <= 0 || amount > balance) return;
      
      dispatch({ 
        type: 'PAY_DEBT', 
        debtType: type, 
        amount: amount 
      });
      
      trackGameInteraction('debt_payment', {
        type,
        amount,
        week,
        remainingBalance: balance - amount
      });
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              End-of-Week Recap - Week {week}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Weekly Analytics Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">${weeklyIncome.toFixed(2)}</div>
                  <div className="text-sm text-blue-600">Weekly Income</div>
                </div>
              </div>
              <p className="text-xs text-blue-500 mt-2">
                Extra income from side hustles and opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Receipt className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-700">${discretionarySpending.toFixed(2)}</div>
                  <div className="text-sm text-orange-600">Discretionary Spending</div>
                </div>
              </div>
              <p className="text-xs text-orange-500 mt-2">
                Wants and unexpected costs from scenarios
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${weeklyNetChange >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {weeklyNetChange >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-600" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <div className={`text-2xl font-bold ${weeklyNetChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {weeklyNetChange >= 0 ? '+' : ''}${weeklyNetChange.toFixed(2)}
                  </div>
                  <div className={`text-sm ${weeklyNetChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Weekly Net Change
                  </div>
                </div>
              </div>
              <p className={`text-xs mt-2 ${weeklyNetChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {weeklyNetChange >= 0 ? 'You increased your wealth this week!' : 'You spent more than you earned this week'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debt Management Section */}
        {(creditCardBalance > 0 || currentDebt > 0) && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-6 h-6" />
                Debt Management - Critical Teaching Moment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">💡 Why Managing Debt Matters</h4>
                <p className="text-sm text-red-800">
                  Debt accumulates interest over time, meaning you pay more than what you originally borrowed. 
                  The longer you carry debt, the more expensive it becomes. Learning to pay down debt quickly 
                  is one of the most important financial skills you can develop.
                </p>
              </div>

              {/* Debt Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditCardBalance > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-800 mb-3">Credit Card Debt</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-bold text-red-600">${creditCardBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>APR:</span>
                        <span>{(creditCardInterestRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Interest:</span>
                        <span className="text-red-600">${(creditCardBalance * creditCardInterestRate / 12).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentDebt > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-800 mb-3">Other Debt</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-bold text-red-600">${currentDebt.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>APR:</span>
                        <span>{(debtInterestRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Interest:</span>
                        <span className="text-red-600">${(currentDebt * debtInterestRate / 12).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Debt Calculator */}
              <div className="bg-white p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Interactive Debt Payoff Calculator
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creditCardBalance > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-medium">Credit Card Payment</h5>
                       <div className="space-y-3">
                         <div>
                           <Label>Payment Amount</Label>
                           <div className="flex items-center gap-2 mt-1">
                             <div className="text-sm text-muted-foreground">
                               Current Amount: ${ccPaymentAmount || '0'}
                             </div>
                           </div>
                           
                           {/* Increment buttons */}
                           <div className="flex flex-wrap gap-2 mt-2">
                             <div className="flex gap-1">
                               {[1, 5, 10, 25, 50].map(inc => {
                                 const newAmount = parseFloat(ccPaymentAmount || '0') + inc;
                                 const canAdd = newAmount <= balance && newAmount <= creditCardBalance;
                                 return (
                                   <Button
                                     key={`add-${inc}`}
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setCcPaymentAmount((newAmount).toString())}
                                     disabled={!canAdd}
                                     className="text-xs px-2"
                                   >
                                     +${inc}
                                   </Button>
                                 );
                               })}
                             </div>
                             
                             <div className="flex gap-1">
                               {[1, 5, 10, 25, 50].map(inc => {
                                 const currentAmount = parseFloat(ccPaymentAmount || '0');
                                 const newAmount = Math.max(0, currentAmount - inc);
                                 return (
                                   <Button
                                     key={`sub-${inc}`}
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setCcPaymentAmount(newAmount.toString())}
                                     disabled={currentAmount < inc}
                                     className="text-xs px-2"
                                   >
                                     -${inc}
                                   </Button>
                                 );
                               })}
                             </div>
                             
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setCcPaymentAmount('0')}
                               disabled={!ccPaymentAmount || parseFloat(ccPaymentAmount) === 0}
                               className="text-xs"
                             >
                               Clear
                             </Button>
                             
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setCcPaymentAmount(Math.min(balance, creditCardBalance).toString())}
                               className="text-xs"
                             >
                               Max
                             </Button>
                             
                             <Button
                               variant="default"
                               onClick={() => {
                                 const amount = parseFloat(ccPaymentAmount);
                                 if (amount > 0) {
                                   handleDebtPayment('credit', amount);
                                   setCcPaymentAmount('');
                                 }
                               }}
                               disabled={!ccPaymentAmount || parseFloat(ccPaymentAmount) <= 0 || parseFloat(ccPaymentAmount) > balance}
                             >
                               Pay ${ccPaymentAmount || '0'}
                             </Button>
                           </div>
                         </div>
                        {ccPaymentAmount && parseFloat(ccPaymentAmount) > 0 && (
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {(() => {
                              const payment = parseFloat(ccPaymentAmount);
                              const calc = calculatePayoffTime(creditCardBalance, payment, creditCardInterestRate);
                              return (
                                <div>
                                  <div>Payoff time: <strong>{calc.months} months</strong></div>
                                  <div>Total interest: <strong>${calc.totalInterest.toFixed(2)}</strong></div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentDebt > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-medium">Other Debt Payment</h5>
                       <div className="space-y-3">
                         <div>
                           <Label>Payment Amount</Label>
                           <div className="flex items-center gap-2 mt-1">
                             <div className="text-sm text-muted-foreground">
                               Current Amount: ${debtPaymentAmount || '0'}
                             </div>
                           </div>
                           
                           {/* Increment buttons */}
                           <div className="flex flex-wrap gap-2 mt-2">
                             <div className="flex gap-1">
                               {[1, 5, 10, 25, 50].map(inc => {
                                 const newAmount = parseFloat(debtPaymentAmount || '0') + inc;
                                 const canAdd = newAmount <= balance && newAmount <= currentDebt;
                                 return (
                                   <Button
                                     key={`add-${inc}`}
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setDebtPaymentAmount((newAmount).toString())}
                                     disabled={!canAdd}
                                     className="text-xs px-2"
                                   >
                                     +${inc}
                                   </Button>
                                 );
                               })}
                             </div>
                             
                             <div className="flex gap-1">
                               {[1, 5, 10, 25, 50].map(inc => {
                                 const currentAmount = parseFloat(debtPaymentAmount || '0');
                                 const newAmount = Math.max(0, currentAmount - inc);
                                 return (
                                   <Button
                                     key={`sub-${inc}`}
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setDebtPaymentAmount(newAmount.toString())}
                                     disabled={currentAmount < inc}
                                     className="text-xs px-2"
                                   >
                                     -${inc}
                                   </Button>
                                 );
                               })}
                             </div>
                             
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setDebtPaymentAmount('0')}
                               disabled={!debtPaymentAmount || parseFloat(debtPaymentAmount) === 0}
                               className="text-xs"
                             >
                               Clear
                             </Button>
                             
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setDebtPaymentAmount(Math.min(balance, currentDebt).toString())}
                               className="text-xs"
                             >
                               Max
                             </Button>
                             
                             <Button
                               variant="default"
                               onClick={() => {
                                 const amount = parseFloat(debtPaymentAmount);
                                 if (amount > 0) {
                                   handleDebtPayment('debt', amount);
                                   setDebtPaymentAmount('');
                                 }
                               }}
                               disabled={!debtPaymentAmount || parseFloat(debtPaymentAmount) <= 0 || parseFloat(debtPaymentAmount) > balance}
                             >
                               Pay ${debtPaymentAmount || '0'}
                             </Button>
                           </div>
                         </div>
                        {debtPaymentAmount && parseFloat(debtPaymentAmount) > 0 && (
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {(() => {
                              const payment = parseFloat(debtPaymentAmount);
                              const calc = calculatePayoffTime(currentDebt, payment, debtInterestRate);
                              return (
                                <div>
                                  <div>Payoff time: <strong>{calc.months} months</strong></div>
                                  <div>Total interest: <strong>${calc.totalInterest.toFixed(2)}</strong></div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Financial Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-6 h-6" />
              Financial Activity Log - Week {week}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.weekLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions recorded this week.
                </div>
              ) : (
                state.weekLog.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{entry.title || entry.type}</div>
                      <div className="text-sm text-muted-foreground mt-1">{entry.option || entry.note}</div>
                      {entry.impact && entry.impact.includes('creditCard') && (
                        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          This purchase will accrue interest on your credit card
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {entry.date} • Week {entry.week}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${entry.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.amount >= 0 ? '+' : ''}${entry.amount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Balance: ${entry.balanceAfter?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Financial Status */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Current Financial Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Current Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-muted-foreground">Financial Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{creditScore}</div>
                <div className="text-sm text-muted-foreground">Credit Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${(creditCardBalance + currentDebt) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${(creditCardBalance + currentDebt).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Debt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Loop Integration */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">
                {week > 4 ? 'Ready for Monthly Summary?' : `Ready for Week ${week + 1}?`}
              </h3>
              <p className="text-muted-foreground">
                {week > 4 
                  ? 'You\'ve completed all four weeks! View your monthly report to see how you did overall and reflect on your financial journey.'
                  : 'Review your performance above, then continue to the next week when you\'re ready to face new financial challenges.'
                }
              </p>
              <Button 
                size="lg" 
                className="w-full max-w-md mx-auto"
                onClick={() => {
                  console.log('WeeklySummary Button clicked - Week:', week, 'Should end game?', week > 4);
                  if (week > 4) {
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
                {week > 4 ? '📊 View Monthly Summary' : `➡️ Go to Week ${week + 1}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Game Over/Reflection Screen (only shows after 4 complete weeks)
  const ReflectionScreen = () => {
    // Only show reflection if we've truly completed all 4 weeks
    const isActuallyComplete = week > 4 || (week === 4 && phase === 'REFLECT' && isGameOver);
    
    if (!isActuallyComplete) {
      // If we're here incorrectly, redirect back to appropriate phase
      console.log('ReflectionScreen called prematurely - redirecting. Week:', week, 'Phase:', phase, 'GameOver:', isGameOver);
      
      // Determine correct phase based on current state
      if (week <= 4 && state.scenarioIndex < state.weeklyScenarios.length) {
        // Should be in LIVE phase for more scenarios
        return <ScenarioScreen />;
      } else if (week <= 4) {
        // Should be in WEEKLY_SUMMARY 
        return <WeeklySummaryScreen />;
      }
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl">4-Week Game Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-muted-foreground">
              Congratulations! You've completed all 4 weeks of the Money Management Game and gained practical experience with real-world financial decisions.
            </p>

            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Game Summary</h4>
              <div className="text-sm text-muted-foreground">
                Completed {week > 4 ? 4 : week} weeks • {Math.max(0, (week - 1) * 5 + state.scenarioIndex)} scenarios faced
              </div>
            </div>

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

            {/* Only call onComplete if we've actually finished all 4 weeks */}
            <Button 
              size="lg" 
              onClick={() => {
                // Double check we're actually complete before calling onComplete
                if (week > 4 || (week === 4 && isGameOver)) {
                  onComplete?.();
                  trackGameInteraction('lesson_completed', { 
                    finalScore: score, 
                    finalBalance: balance,
                    weeksCompleted: week > 4 ? 4 : week
                  });
                } else {
                  console.warn('Attempted to complete lesson prematurely');
                  // Force back to correct state
                  dispatch({ type: 'NEXT_WEEK' });
                }
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
  };

  // Main render logic with debugging
  if (showWelcome) {
    return <WelcomeScreen />;
  }

  // Debug logging to understand game state
  console.log('Game render state:', { 
    phase, 
    week, 
    scenarioIndex: state.scenarioIndex, 
    weeklyScenarios: state.weeklyScenarios?.length || 0,
    hasScenarios: !!state.weeklyScenarios?.length,
    currentScenario: state.currentScenario?.title || 'none',
    isGameOver 
  });

  if (phase === 'PLAN') {
    return <BudgetPlanningScreen />;
  }

  if (phase === 'LIVE') {
    return <ScenarioScreen />;
  }

  if (phase === 'SCENARIO_OUTCOME') {
    return <ScenarioOutcomeSummaryScreen />;
  }

  if (phase === 'WEEKLY_SUMMARY') {
    return <WeeklySummaryScreen />;
  }

  // Only go to reflection screen if we've actually completed 4 weeks
  if (phase === 'REFLECT' && (week > 4 || isGameOver)) {
    return <ReflectionScreen />;
  }

  // If we somehow get into an invalid state, reset to appropriate phase
  if (phase === 'REFLECT' && week <= 4) {
    console.warn('Invalid state: REFLECT phase with week <= 4. Redirecting to appropriate phase.');
    // Force back to correct phase
    if (state.scenarioIndex < state.weeklyScenarios.length) {
      return <ScenarioScreen />;
    } else {
      return <WeeklySummaryScreen />;
    }
  }

  return <div>Loading game... (Week: {week}, Phase: {phase})</div>;
};

// Main lesson component - direct game without container wrapper
export const MoneyManagementGameMicroLesson: React.FC<GameProps> = (props) => {
  return <MoneyManagementGame {...props} />;
};