import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

interface EconomicsLesson1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsLesson1: React.FC<EconomicsLesson1Props> = ({ 
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
            <BookOpen className="w-6 h-6 text-primary" />
            <CardTitle>Introduction to Economics</CardTitle>
            <Badge variant="outline">Lesson 1</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Welcome to your first lesson in economics! In this lesson, we'll explore what economics is, 
            why it matters, and how it affects our daily lives.
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>What is Economics?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Economics is the social science that studies how individuals, businesses, governments, 
              and societies make choices about allocating limited resources to satisfy unlimited wants and needs.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Economic Concepts:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Scarcity:</strong> Resources are limited while wants are unlimited</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Choice:</strong> We must choose how to allocate our scarce resources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Opportunity Cost:</strong> The value of the next best alternative given up</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Microeconomics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Studies individual consumers, firms, and markets. Focuses on supply and demand, 
                    pricing, and resource allocation at the individual level.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-300">Macroeconomics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Studies the economy as a whole. Focuses on inflation, unemployment, 
                    economic growth, and government policies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Example: Your Daily Choices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Every day, you make economic decisions. Consider this scenario:
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium">Scenario:</p>
              <p>
                You have $20 and 2 hours of free time. You can either:
              </p>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Go to a movie ($15) and grab coffee ($5)</li>
                <li>• Buy a book ($20) and read at home</li>
                <li>• Save the money and work part-time ($10/hour)</li>
              </ul>
            </div>

            <p>
              Each choice involves opportunity cost - what you give up by choosing one option over another. 
              This is the essence of economic thinking!
            </p>
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
                  Great job! You've learned the fundamental concepts of economics.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Supply and Demand
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about the basic principles of economics. Ready to move on?
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 1
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};