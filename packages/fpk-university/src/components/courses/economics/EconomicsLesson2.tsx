import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface EconomicsLesson2Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: Record<string, any>) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const EconomicsLesson2: React.FC<EconomicsLesson2Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  isCompleted = false,
  trackInteraction,
  lessonId = 2,
  lessonTitle = "Supply and Demand"
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
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle>Supply and Demand</CardTitle>
            <Badge variant="outline">Lesson 2</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Supply and demand are the fundamental forces that drive market economies. 
            Understanding these concepts is crucial for grasping how prices are determined and markets function.
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>The Law of Demand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              The law of demand states that as the price of a good increases, the quantity demanded decreases, 
              and vice versa, all other factors being equal.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Factors Affecting Demand:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Price:</strong> Primary factor - inverse relationship with demand</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Income:</strong> Higher income typically increases demand for normal goods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Preferences:</strong> Consumer tastes and preferences affect demand</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Substitutes:</strong> Availability of alternative products</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Law of Supply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              The law of supply states that as the price of a good increases, the quantity supplied increases, 
              and vice versa, all other factors being equal.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Factors Affecting Supply:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Production Costs:</strong> Lower costs increase supply</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Technology:</strong> Better technology can increase supply</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Number of Sellers:</strong> More producers increase market supply</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Expectations:</strong> Future price expectations affect current supply</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Equilibrium */}
      <Card>
        <CardHeader>
          <CardTitle>Market Equilibrium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Market equilibrium occurs where supply and demand curves intersect. 
              At this point, the quantity demanded equals the quantity supplied.
            </p>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="font-medium text-purple-700 dark:text-purple-300">Example: Coffee Market</p>
              <p className="mt-2">
                If coffee is priced too high, there will be a surplus (excess supply). 
                If priced too low, there will be a shortage (excess demand). 
                The market naturally moves toward equilibrium price.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium">Case Study: Gasoline Prices</p>
              <p className="mt-2">
                When oil production decreases (supply shift), gasoline prices rise. 
                Higher prices cause consumers to drive less or seek alternatives (demand response). 
                This demonstrates how supply and demand interact in real markets.
              </p>
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
                <TrendingUp className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Excellent! You now understand how supply and demand determine market prices.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Market Structures
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about supply, demand, and market equilibrium.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 2
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};