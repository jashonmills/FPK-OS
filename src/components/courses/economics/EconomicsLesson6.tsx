import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BookOpen, ArrowRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface EconomicsLesson6Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: Record<string, any>) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const EconomicsLesson6: React.FC<EconomicsLesson6Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  isCompleted = false,
  trackInteraction,
  lessonId = 6,
  lessonTitle = "Fiscal Policy"
}) => {
  const handleComplete = () => {
    trackInteraction?.('lesson_complete_click', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      action: 'complete_button_clicked'
    });
    onComplete?.();
  };

  const handleConceptClick = (concept: string) => {
    trackInteraction?.('concept_interaction', {
      lesson_id: lessonId,
      concept,
      action: 'concept_viewed'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <CardTitle>Fiscal Policy</CardTitle>
            <Badge variant="outline">Lesson 6</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Fiscal policy refers to the government's use of spending and taxation to influence 
            the economy. It works alongside monetary policy to achieve economic stability and growth.
          </p>
        </CardContent>
      </Card>

      {/* Government Spending */}
      <Card>
        <CardHeader>
          <CardTitle>Government Spending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Government spending directly affects economic activity by creating demand for 
              goods and services, providing jobs, and investing in infrastructure.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Types of Government Spending:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Discretionary Spending:</strong> Defense, education, infrastructure</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Mandatory Spending:</strong> Social Security, Medicare, debt interest</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Transfer Payments:</strong> Unemployment benefits, welfare programs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Public Investment:</strong> Roads, bridges, research and development</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Multiplier Effect:</h4>
              <p className="text-sm">
                Government spending has a multiplier effect - every dollar spent by the government 
                generates more than one dollar of economic activity as it circulates through the economy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxation */}
      <Card>
        <CardHeader>
          <CardTitle>Taxation Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Taxes fund government operations and can be used as a tool to influence economic behavior 
              and redistribute income.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Types of Taxes:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Income taxes</li>
                  <li>• Corporate taxes</li>
                  <li>• Sales taxes</li>
                  <li>• Property taxes</li>
                  <li>• Payroll taxes</li>
                  <li>• Excise taxes</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Tax Systems:</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Progressive:</strong> Higher rates for higher incomes</li>
                  <li><strong>Proportional:</strong> Same rate for all income levels</li>
                  <li><strong>Regressive:</strong> Lower rates for higher incomes</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Tax Policy Effects:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium">Lower Taxes:</p>
                  <p>Increase consumer spending and business investment</p>
                </div>
                <div>
                  <p className="font-medium">Higher Taxes:</p>
                  <p>Reduce spending power but increase government revenue</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expansionary vs Contractionary Fiscal Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Types of Fiscal Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Expansionary Fiscal Policy
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Goal:</strong> Stimulate economic growth during recessions</p>
                <p><strong>Methods:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Increase government spending</li>
                  <li>• Decrease taxes</li>
                  <li>• Expand transfer payments</li>
                </ul>
                <p><strong>Effect:</strong> Higher budget deficits but increased GDP</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Contractionary Fiscal Policy
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Goal:</strong> Cool down an overheated economy</p>
                <p><strong>Methods:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Decrease government spending</li>
                  <li>• Increase taxes</li>
                  <li>• Reduce transfer payments</li>
                </ul>
                <p><strong>Effect:</strong> Lower budget deficits but reduced GDP growth</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Government Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              The government budget reflects the balance between revenue (taxes) and expenditures (spending).
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">Budget Scenarios:</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Budget Surplus</p>
                    <p className="text-xs text-muted-foreground">Revenue {'>'}  Expenditures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">Balanced Budget</p>
                    <p className="text-xs text-muted-foreground">Revenue = Expenditures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Budget Deficit</p>
                    <p className="text-xs text-muted-foreground">Revenue {'<'} Expenditures</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2">National Debt:</h4>
              <p className="text-sm">
                The accumulation of budget deficits over time. High debt levels can limit 
                future fiscal policy options and require interest payments that crowd out other spending.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Example */}
      <Card>
        <CardHeader>
          <CardTitle>Case Study: 2009 American Recovery Act</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">Fiscal Stimulus Response to Great Recession:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Package Components:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• $787 billion total spending</li>
                    <li>• Tax cuts for individuals</li>
                    <li>• Infrastructure investments</li>
                    <li>• Extended unemployment benefits</li>
                    <li>• Aid to state governments</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Objectives:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Create jobs quickly</li>
                    <li>• Boost consumer spending</li>
                    <li>• Prevent state budget cuts</li>
                    <li>• Invest in long-term growth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges and Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>Fiscal Policy Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">Key Challenges:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Time Lags:</strong> Legislative process delays implementation</li>
                <li>• <strong>Political Constraints:</strong> Disagreements over spending priorities</li>
                <li>• <strong>Crowding Out:</strong> Government borrowing may reduce private investment</li>
                <li>• <strong>Debt Sustainability:</strong> Long-term fiscal health concerns</li>
                <li>• <strong>Automatic Stabilizers:</strong> Programs that adjust automatically to economic conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Completion */}
      <Card className="border-2 border-dashed border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isCompleted ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <BookOpen className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Excellent work! You now understand how governments use fiscal policy to manage economic conditions.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: International Trade
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about government spending, taxation, and budget policy.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 6
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};