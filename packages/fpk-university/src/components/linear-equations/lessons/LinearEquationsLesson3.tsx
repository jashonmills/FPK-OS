import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

interface InteractionDetails {
  lessonId?: string;
  action?: string;
  element?: string;
  value?: string | number;
  timestamp?: number;
  [key: string]: unknown;
}

interface LinearEquationsLesson3Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const LinearEquationsLesson3: React.FC<LinearEquationsLesson3Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Multi-Step Equations and Distribution</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn to solve complex equations involving the distributive property and combining like terms.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The Distributive Property */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Distributive Property</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed mb-3">
                The <strong>distributive property</strong> allows us to multiply a number by a sum or difference:
              </p>
              <div className="bg-white/60 p-3 rounded text-center">
                <p className="font-mono text-lg">a(b + c) = ab + ac</p>
                <p className="font-mono text-lg">a(b - c) = ab - ac</p>
              </div>
            </div>
          </div>

          {/* Example 1: Distribution */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 1: 3(x + 4) = 21</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Step-by-Step Solution:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> 3(x + 4) = 21</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Distribute the 3</p>
                    <p className="ml-4">3 × x + 3 × 4 = 21</p>
                    <p className="ml-4">3x + 12 = 21</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Subtract 12 from both sides</p>
                    <p className="ml-4">3x + 12 - 12 = 21 - 12</p>
                    <p className="ml-4">3x = 9</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 3:</strong> Divide by 3</p>
                    <p className="ml-4">x = 3</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 3(3 + 4) = 3(7) = 21 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2: Distribution with Subtraction */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 2: 2(x - 3) + 5 = 11</h3>
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">More complex distribution:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> 2(x - 3) + 5 = 11</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Distribute the 2</p>
                    <p className="ml-4">2x - 6 + 5 = 11</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Combine like terms (-6 + 5)</p>
                    <p className="ml-4">2x - 1 = 11</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 3:</strong> Add 1 to both sides</p>
                    <p className="ml-4">2x = 12</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 4:</strong> Divide by 2</p>
                    <p className="ml-4">x = 6</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 2(6 - 3) + 5 = 2(3) + 5 = 11 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 3: Both Sides with Distribution */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 3: 3(x + 2) = 2(x + 5)</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Distribution on both sides:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> 3(x + 2) = 2(x + 5)</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Distribute on both sides</p>
                    <p className="ml-4">3x + 6 = 2x + 10</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Subtract 2x from both sides</p>
                    <p className="ml-4">3x - 2x + 6 = 2x - 2x + 10</p>
                    <p className="ml-4">x + 6 = 10</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 3:</strong> Subtract 6 from both sides</p>
                    <p className="ml-4">x = 4</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 3(4 + 2) = 18, and 2(4 + 5) = 18 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combining Like Terms */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Combining Like Terms</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong>Like terms</strong> have the same variable with the same power:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>3x and 5x are like terms</li>
                  <li>7 and -2 are like terms (constants)</li>
                  <li>4x and 4y are NOT like terms</li>
                  <li>x² and x are NOT like terms</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-2">🧮</div>
                  <p className="text-sm text-muted-foreground">
                    Group similar terms together
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Summary */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🎯 Strategy for Multi-Step Equations</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Distribute any parentheses</li>
              <li>Combine like terms on each side</li>
              <li>Use addition/subtraction to get all variables on one side</li>
              <li>Use addition/subtraction to get all constants on the other side</li>
              <li>Use multiplication/division to isolate the variable</li>
              <li>Check your answer!</li>
            </ol>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll explore how to graph linear equations and understand their geometric meaning!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Graphing linear equations</li>
              <li>Understanding slope and y-intercept</li>
              <li>Finding x and y intercepts</li>
              <li>Visual representation of solutions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};