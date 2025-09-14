import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface EconomicsLesson4Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsLesson4: React.FC<EconomicsLesson4Props> = ({ 
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
            <PlayCircle className="w-6 h-6 text-primary" />
            <CardTitle>Economic Indicators</CardTitle>
            <Badge variant="outline">Lesson 4</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Economic indicators are statistics that provide information about the overall health and 
            performance of an economy. They help policymakers, businesses, and individuals make informed decisions.
          </p>
        </CardContent>
      </Card>

      {/* GDP Section */}
      <Card>
        <CardHeader>
          <CardTitle>Gross Domestic Product (GDP)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              GDP is the total monetary value of all finished goods and services produced within 
              a country's borders in a specific time period. It's the most widely used indicator of economic health.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Three Ways to Measure GDP:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Production Approach:</strong> Sum of value added by all producers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Income Approach:</strong> Sum of all incomes earned in production</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Expenditure Approach:</strong> C + I + G + (X - M)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">GDP Formula (Expenditure Approach):</h4>
              <p className="font-mono text-lg">GDP = C + I + G + (X - M)</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li><strong>C</strong> = Consumer spending</li>
                <li><strong>I</strong> = Investment</li>
                <li><strong>G</strong> = Government spending</li>
                <li><strong>X</strong> = Exports</li>
                <li><strong>M</strong> = Imports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inflation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inflation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Inflation is the general increase in prices of goods and services over time, 
              reducing the purchasing power of money.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-red-700 dark:text-red-300">Causes of Inflation</h4>
                </div>
                <ul className="space-y-1 text-sm">
                  <li>• Demand-pull inflation</li>
                  <li>• Cost-push inflation</li>
                  <li>• Monetary inflation</li>
                  <li>• Built-in inflation</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Measuring Inflation</h4>
                </div>
                <ul className="space-y-1 text-sm">
                  <li>• Consumer Price Index (CPI)</li>
                  <li>• Producer Price Index (PPI)</li>
                  <li>• GDP Deflator</li>
                  <li>• Core inflation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unemployment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Unemployment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Unemployment measures the percentage of the labor force that is actively seeking work 
              but unable to find employment.
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Types of Unemployment:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Frictional:</strong> Short-term unemployment during job transitions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Structural:</strong> Mismatch between skills and job requirements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Cyclical:</strong> Unemployment due to economic downturns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Seasonal:</strong> Regular unemployment patterns due to seasons</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Key Unemployment Metrics:</h4>
              <ul className="space-y-1 text-sm">
                <li><strong>Unemployment Rate:</strong> (Unemployed / Labor Force) × 100</li>
                <li><strong>Labor Force Participation Rate:</strong> (Labor Force / Adult Population) × 100</li>
                <li><strong>Natural Rate of Unemployment:</strong> Frictional + Structural unemployment</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Application */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Economic Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium">Economic Indicators in Action:</p>
              <p className="mt-2 text-sm">
                During the 2008 financial crisis, GDP contracted, unemployment rose to over 10%, 
                and deflation became a concern. Policymakers used these indicators to implement 
                stimulus measures and monetary policy changes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-card border rounded-lg">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Healthy Economy</h4>
                <p className="text-sm mt-1">GDP: 2-3% growth</p>
                <p className="text-sm">Inflation: 2% target</p>
                <p className="text-sm">Unemployment: 4-5%</p>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Moderate Concern</h4>
                <p className="text-sm mt-1">GDP: 0-2% growth</p>
                <p className="text-sm">Inflation: 3-4%</p>
                <p className="text-sm">Unemployment: 6-7%</p>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Economic Stress</h4>
                <p className="text-sm mt-1">GDP: Negative growth</p>
                <p className="text-sm">Inflation: Very high/low</p>
                <p className="text-sm">Unemployment: {'>'}8%</p>
              </div>
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
                <PlayCircle className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Excellent! You now understand key economic indicators and how to interpret them.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Monetary Policy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about GDP, inflation, and unemployment indicators.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 4
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};