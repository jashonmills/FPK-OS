import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, ArrowRight, Coins, ArrowUp, ArrowDown } from 'lucide-react';

interface EconomicsLesson5Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsLesson5: React.FC<EconomicsLesson5Props> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <CardTitle>Monetary Policy</CardTitle>
            <Badge variant="outline">Lesson 5</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Monetary policy refers to the actions taken by a nation's central bank to control 
            the money supply and achieve macroeconomic goals such as stable prices, full employment, 
            and economic growth.
          </p>
        </CardContent>
      </Card>

      {/* Central Banking */}
      <Card>
        <CardHeader>
          <CardTitle>Central Bank Functions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Central banks (like the Federal Reserve in the US) are responsible for managing 
              the country's money supply and financial system stability.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Key Functions:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Issue Currency:</strong> Control the nation's money supply</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Bank Regulation:</strong> Supervise and regulate banks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Lender of Last Resort:</strong> Provide emergency funding to banks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Payment System:</strong> Facilitate interbank payments</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monetary Policy Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Monetary Policy Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Interest Rates */}
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-700 dark:text-green-300">Interest Rate Policy</h4>
              </div>
              <p className="text-sm mb-2">
                The federal funds rate is the primary tool for monetary policy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <ArrowDown className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Lower Rates</p>
                    <p className="text-xs">Stimulate borrowing and spending</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <ArrowUp className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Higher Rates</p>
                    <p className="text-xs">Reduce inflation and cool economy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserve Requirements */}
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Reserve Requirements</h4>
              <p className="text-sm mb-2">
                The percentage of deposits banks must hold as reserves.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Higher reserves = Less money to lend = Contractionary</li>
                <li>• Lower reserves = More money to lend = Expansionary</li>
              </ul>
            </div>

            {/* Open Market Operations */}
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Open Market Operations</h4>
              <p className="text-sm mb-2">
                Buying and selling government securities to control money supply.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium">Buying Securities:</p>
                  <p className="text-xs">Increases money supply (expansionary)</p>
                </div>
                <div>
                  <p className="font-medium">Selling Securities:</p>
                  <p className="text-xs">Decreases money supply (contractionary)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expansionary vs Contractionary */}
      <Card>
        <CardHeader>
          <CardTitle>Types of Monetary Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300 flex items-center">
                <ArrowUp className="w-5 h-5 mr-2" />
                Expansionary Policy
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Goal:</strong> Stimulate economic growth</p>
                <p><strong>When Used:</strong> During recessions or slow growth</p>
                <p><strong>Actions:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Lower interest rates</li>
                  <li>• Buy government securities</li>
                  <li>• Reduce reserve requirements</li>
                </ul>
                <p><strong>Effects:</strong> Increased borrowing, spending, and investment</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center">
                <ArrowDown className="w-5 h-5 mr-2" />
                Contractionary Policy
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Goal:</strong> Control inflation and cool economy</p>
                <p><strong>When Used:</strong> During high inflation periods</p>
                <p><strong>Actions:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Raise interest rates</li>
                  <li>• Sell government securities</li>
                  <li>• Increase reserve requirements</li>
                </ul>
                <p><strong>Effects:</strong> Reduced borrowing, spending, and investment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Example */}
      <Card>
        <CardHeader>
          <CardTitle>Case Study: 2008 Financial Crisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">Federal Reserve Response:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Actions Taken:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Cut interest rates to near zero</li>
                    <li>• Implemented quantitative easing</li>
                    <li>• Provided emergency lending</li>
                    <li>• Purchased mortgage-backed securities</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Objectives:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Stabilize financial markets</li>
                    <li>• Encourage lending</li>
                    <li>• Prevent deflation</li>
                    <li>• Support economic recovery</li>
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
          <CardTitle>Monetary Policy Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">Key Challenges:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Time Lags:</strong> Policy effects take time to materialize</li>
                <li>• <strong>Zero Lower Bound:</strong> Interest rates can't go below zero</li>
                <li>• <strong>Global Interconnectedness:</strong> International factors affect domestic policy</li>
                <li>• <strong>Expectations:</strong> Market expectations can influence policy effectiveness</li>
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
                <Trophy className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Outstanding! You now understand how central banks use monetary policy to manage the economy.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Fiscal Policy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about monetary policy tools and their economic impacts.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 5
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};