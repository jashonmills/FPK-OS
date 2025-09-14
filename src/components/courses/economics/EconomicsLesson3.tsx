import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calculator, ArrowRight } from 'lucide-react';

interface EconomicsLesson3Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsLesson3: React.FC<EconomicsLesson3Props> = ({ 
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
            <Calculator className="w-6 h-6 text-primary" />
            <CardTitle>Market Structures</CardTitle>
            <Badge variant="outline">Lesson 3</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Markets come in different forms depending on the number of participants, 
            barriers to entry, and degree of competition. Understanding market structures 
            helps explain pricing strategies and business behavior.
          </p>
        </CardContent>
      </Card>

      {/* Perfect Competition */}
      <Card>
        <CardHeader>
          <CardTitle>Perfect Competition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Perfect competition is a theoretical market structure with many buyers and sellers, 
              identical products, and no barriers to entry.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Characteristics:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Many buyers and sellers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Homogeneous (identical) products</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Perfect information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No barriers to entry or exit</span>
                </li>
              </ul>
              <p className="mt-2 text-sm italic">Example: Agricultural commodities like wheat or corn</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monopoly */}
      <Card>
        <CardHeader>
          <CardTitle>Monopoly</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              A monopoly exists when there is only one seller of a product with no close substitutes 
              and high barriers to entry.
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Characteristics:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Single seller</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Unique product (no close substitutes)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>High barriers to entry</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Price maker (controls price)</span>
                </li>
              </ul>
              <p className="mt-2 text-sm italic">Example: Local utility companies, patented drugs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Oligopoly and Monopolistic Competition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Oligopoly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                Few large firms dominate the market, with high barriers to entry.
              </p>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <ul className="space-y-1 text-sm">
                  <li>• Few sellers</li>
                  <li>• Interdependent decisions</li>
                  <li>• High barriers to entry</li>
                  <li>• May have differentiated products</li>
                </ul>
                <p className="mt-2 text-xs italic">Example: Airlines, telecommunications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monopolistic Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                Many firms with differentiated products and low barriers to entry.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <ul className="space-y-1 text-sm">
                  <li>• Many sellers</li>
                  <li>• Differentiated products</li>
                  <li>• Low barriers to entry</li>
                  <li>• Some price control</li>
                </ul>
                <p className="mt-2 text-xs italic">Example: Restaurants, clothing brands</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Market Structure Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-2 text-left">Structure</th>
                  <th className="border border-border p-2 text-left">Number of Firms</th>
                  <th className="border border-border p-2 text-left">Product Type</th>
                  <th className="border border-border p-2 text-left">Price Control</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2 font-medium">Perfect Competition</td>
                  <td className="border border-border p-2">Many</td>
                  <td className="border border-border p-2">Identical</td>
                  <td className="border border-border p-2">None</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="border border-border p-2 font-medium">Monopolistic Competition</td>
                  <td className="border border-border p-2">Many</td>
                  <td className="border border-border p-2">Differentiated</td>
                  <td className="border border-border p-2">Some</td>
                </tr>
                <tr>
                  <td className="border border-border p-2 font-medium">Oligopoly</td>
                  <td className="border border-border p-2">Few</td>
                  <td className="border border-border p-2">Identical or Differentiated</td>
                  <td className="border border-border p-2">Significant</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="border border-border p-2 font-medium">Monopoly</td>
                  <td className="border border-border p-2">One</td>
                  <td className="border border-border p-2">Unique</td>
                  <td className="border border-border p-2">Complete</td>
                </tr>
              </tbody>
            </table>
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
                <Calculator className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Great work! You now understand different market structures and their characteristics.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Economic Indicators
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about different market structures and competition levels.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 3
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};