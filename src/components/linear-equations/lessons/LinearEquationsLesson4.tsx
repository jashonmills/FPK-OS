import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';

interface LinearEquationsLesson4Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const LinearEquationsLesson4: React.FC<LinearEquationsLesson4Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Graphing Linear Equations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Discover the geometric meaning of linear equations and learn to create their visual representations.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Introduction to Graphing */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">From Equation to Graph</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed mb-3">
                Every linear equation creates a <strong>straight line</strong> when graphed on a coordinate plane. 
                This line represents all the solutions to the equation.
              </p>
              <div className="bg-white/60 p-3 rounded">
                <p className="font-mono text-center">Standard Form: y = mx + b</p>
                <p className="text-sm text-center text-muted-foreground mt-1">
                  where m = slope, b = y-intercept
                </p>
              </div>
            </div>
          </div>

          {/* Slope and Y-Intercept */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Understanding Slope and Y-Intercept</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Slope (m)</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Definition:</strong> Rise over run (vertical change / horizontal change)</li>
                  <li><strong>Positive slope:</strong> Line goes up from left to right</li>
                  <li><strong>Negative slope:</strong> Line goes down from left to right</li>
                  <li><strong>Zero slope:</strong> Horizontal line</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Y-Intercept (b)</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Definition:</strong> Where the line crosses the y-axis</li>
                  <li><strong>Point:</strong> (0, b)</li>
                  <li><strong>To find:</strong> Set x = 0 in the equation</li>
                  <li><strong>Starting point:</strong> Begin graphing here</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Example 1: y = 2x + 3 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 1: Graphing y = 2x + 3</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Step-by-Step Graphing:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> y = 2x + 3</p>
                    <p className="ml-4">Slope (m) = 2, Y-intercept (b) = 3</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Plot the y-intercept</p>
                    <p className="ml-4">Point: (0, 3)</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Use the slope to find another point</p>
                    <p className="ml-4">From (0, 3): go right 1, up 2 → (1, 5)</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 3:</strong> Draw a line through the points</p>
                    <p className="ml-4">The line extends infinitely in both directions</p>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <div className="text-8xl mb-2">📈</div>
                  <p className="text-sm text-muted-foreground">
                    Line with positive slope going up
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Finding X and Y Intercepts */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Finding X and Y Intercepts</h3>
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white/60 p-4 rounded">
                  <h4 className="font-medium text-green-700">X-Intercept</h4>
                  <p className="text-sm text-muted-foreground mb-2">Where the line crosses the x-axis</p>
                  <p><strong>Method:</strong> Set y = 0 and solve for x</p>
                  <p><strong>Form:</strong> (x, 0)</p>
                </div>
                <div className="bg-white/60 p-4 rounded">
                  <h4 className="font-medium text-green-700">Y-Intercept</h4>
                  <p className="text-sm text-muted-foreground mb-2">Where the line crosses the y-axis</p>
                  <p><strong>Method:</strong> Set x = 0 and solve for y</p>
                  <p><strong>Form:</strong> (0, y)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2: Finding Intercepts */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 2: Find intercepts of 3x + 2y = 12</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Finding X-Intercept:</strong></p>
                    <p className="ml-2">Set y = 0:</p>
                    <p className="ml-2">3x + 2(0) = 12</p>
                    <p className="ml-2">3x = 12</p>
                    <p className="ml-2">x = 4</p>
                    <p className="ml-2 font-medium">X-intercept: (4, 0)</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Finding Y-Intercept:</strong></p>
                    <p className="ml-2">Set x = 0:</p>
                    <p className="ml-2">3(0) + 2y = 12</p>
                    <p className="ml-2">2y = 12</p>
                    <p className="ml-2">y = 6</p>
                    <p className="ml-2 font-medium">Y-intercept: (0, 6)</p>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <p><strong>Graph:</strong> Draw a line through points (4, 0) and (0, 6)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Different Forms of Linear Equations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Forms of Linear Equations</h3>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">Slope-Intercept Form</h4>
                <p className="font-mono">y = mx + b</p>
                <p className="text-sm text-muted-foreground">Easy to identify slope and y-intercept</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700">Standard Form</h4>
                <p className="font-mono">Ax + By = C</p>
                <p className="text-sm text-muted-foreground">Easy to find x and y intercepts</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-700">Point-Slope Form</h4>
                <p className="font-mono">y - y₁ = m(x - x₁)</p>
                <p className="text-sm text-muted-foreground">Useful when you know slope and one point</p>
              </div>
            </div>
          </div>

          {/* Graphing Tips */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">📊 Graphing Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Always label your axes and scale</li>
              <li>Plot at least two points to draw the line</li>
              <li>Use a ruler for straight, accurate lines</li>
              <li>Check your work by substituting points back into the equation</li>
              <li>Remember: one equation = one straight line</li>
            </ul>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll explore special cases and learn about equations with no solution or infinite solutions!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Equations with no solution</li>
              <li>Equations with infinite solutions</li>
              <li>Identifying inconsistent systems</li>
              <li>Understanding identity equations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 4 of 7 • Graphing Linear Equations
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Mark as Complete
            </Button>
          )}
          {isCompleted && hasNext && (
            <Button onClick={onNext} className="fpk-gradient text-white">
              Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};