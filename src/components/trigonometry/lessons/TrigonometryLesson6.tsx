import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface TrigonometryLesson6Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const TrigonometryLesson6: React.FC<TrigonometryLesson6Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Solving Trigonometric Equations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Master techniques for solving equations involving trigonometric functions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Types of Trigonometric Equations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Types of Trigonometric Equations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Linear Equations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Equations where the trig function appears only once.
                  </p>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold">Examples:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• sin x = 1/2</li>
                      <li>• cos x = -√3/2</li>
                      <li>• tan x = 1</li>
                      <li>• 2 sin x - 1 = 0</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Quadratic Equations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Equations with squared trig functions.
                  </p>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold">Examples:</p>  
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• sin²x - sin x = 0</li>
                      <li>• 2cos²x - cos x - 1 = 0</li>
                      <li>• tan²x - 3 = 0</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Solving Linear Trigonometric Equations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Solving Linear Equations</h3>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Step-by-Step Process</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-semibold text-blue-700">Step 1: Isolate</h5>
                    <p className="text-sm mt-1">Isolate the trigonometric function.</p>
                    <p className="text-xs text-muted-foreground mt-1">Example: 2sin x - 1 = 0 → sin x = 1/2</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-semibold text-blue-700">Step 2: Reference Angle</h5>
                    <p className="text-sm mt-1">Find the reference angle using inverse functions.</p>
                    <p className="text-xs text-muted-foreground mt-1">Example: sin⁻¹(1/2) = 30°</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-semibold text-blue-700">Step 3: All Solutions</h5>
                    <p className="text-sm mt-1">Find all angles in the specified domain.</p>
                    <p className="text-xs text-muted-foreground mt-1">Consider all quadrants where the function is positive/negative.</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-semibold text-blue-700">Step 4: General Solution</h5>
                    <p className="text-sm mt-1">Express using periodicity if needed.</p>
                    <p className="text-xs text-muted-foreground mt-1">Example: x = 30° + 360°n or x = 150° + 360°n</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Walkthrough */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Worked Example: sin x = 1/2</h3>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold">Problem: Solve sin x = 1/2 for 0° &le; x &lt; 360°</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-sm">1</div>
                      <div>
                        <p className="font-medium">Find the reference angle</p>
                        <p className="text-sm text-muted-foreground">sin⁻¹(1/2) = 30°</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-sm">2</div>
                      <div>
                        <p className="font-medium">Identify where sine is positive</p>
                        <p className="text-sm text-muted-foreground">Sine is positive in Quadrants I and II</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-sm">3</div>
                      <div>
                        <p className="font-medium">Find angles in each quadrant</p>
                        <p className="text-sm text-muted-foreground">
                          Quadrant I: x = 30°<br/>
                          Quadrant II: x = 180° - 30° = 150°
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-sm">✓</div>
                      <div>
                        <p className="font-medium">Final Answer</p>
                        <p className="text-sm text-muted-foreground">x = 30° or x = 150°</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quadratic Equations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Solving Quadratic Trigonometric Equations</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Factoring Method</h4>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded">
                  <h5 className="font-semibold text-green-700">Example: 2sin²x - sin x - 1 = 0</h5>
                  <div className="mt-3 space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Let u = sin x, so we have: 2u² - u - 1 = 0</p>
                    <p><strong>Step 2:</strong> Factor: (2u + 1)(u - 1) = 0</p>
                    <p><strong>Step 3:</strong> Solve: u = -1/2 or u = 1</p>
                    <p><strong>Step 4:</strong> Substitute back: sin x = -1/2 or sin x = 1</p>
                    <p><strong>Step 5:</strong> Find all angles in the domain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Using Identities */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Using Identities to Solve Equations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-700">Pythagorean Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use sin²x + cos²x = 1 to convert between functions.
                  </p>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="font-semibold">Example:</p>
                    <p className="text-sm mt-1">sin²x + cos x - 1 = 0</p>
                    <p className="text-sm">→ (1 - cos²x) + cos x - 1 = 0</p>
                    <p className="text-sm">→ -cos²x + cos x = 0</p>
                    <p className="text-sm">→ cos x(1 - cos x) = 0</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-orange-700">Double Angle Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Convert double angles to single angles.
                  </p>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="font-semibold">Example:</p>
                    <p className="text-sm mt-1">cos 2x = cos x</p>
                    <p className="text-sm">→ 2cos²x - 1 = cos x</p>
                    <p className="text-sm">→ 2cos²x - cos x - 1 = 0</p>
                    <p className="text-sm">→ (2cos x + 1)(cos x - 1) = 0</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Solution Strategies */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">General Solution Strategies</h3>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-700">When to Use Each Method:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Direct solving:</strong> When equation has one trig function</li>
                    <li><strong>Factoring:</strong> When you can factor out common terms</li>
                    <li><strong>Quadratic formula:</strong> When factoring doesn't work</li>
                    <li><strong>Identities:</strong> When multiple functions are present</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-700">Common Pitfalls:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Forgetting to check all quadrants</li>
                    <li>• Not considering the specified domain</li>
                    <li>• Dividing by expressions that might be zero</li>
                    <li>• Missing periodic solutions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Considerations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Domain and Range Considerations</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Sine Equations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Range: [-1, 1]</li>
                    <li>• Period: 360°</li>
                    <li>• Solutions in Q1 and Q2 when positive</li>
                    <li>• Solutions in Q3 and Q4 when negative</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Cosine Equations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Range: [-1, 1]</li>
                    <li>• Period: 360°</li>
                    <li>• Solutions in Q1 and Q4 when positive</li>
                    <li>• Solutions in Q2 and Q3 when negative</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Tangent Equations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Range: All real numbers</li>
                    <li>• Period: 180°</li>
                    <li>• Solutions in Q1 and Q3 when positive</li>
                    <li>• Solutions in Q2 and Q4 when negative</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Practice Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Tips for Success</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Before You Start:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Identify the type of equation</li>
                  <li>• Note the domain restrictions</li>
                  <li>• Look for opportunities to use identities</li>
                  <li>• Consider if substitution would help</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Check Your Work:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Substitute solutions back into original equation</li>
                  <li>• Verify solutions are in the correct domain</li>
                  <li>• Make sure you found all solutions</li>
                  <li>• Check for extraneous solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 6 of 7 • Solving Trig Equations
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