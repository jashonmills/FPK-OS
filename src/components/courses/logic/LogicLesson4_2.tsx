import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, AlertTriangle, Lightbulb, Target, Brain } from 'lucide-react';

interface LogicLesson4_2Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson4_2({ onComplete, onNext, hasNext = false }: LogicLesson4_2Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Testing Deductive Arguments</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn systematic methods for evaluating the validity and soundness of deductive arguments
        </p>
      </div>

      {/* Learning Objectives */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Apply systematic methods to test argument validity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Use counterexample techniques to identify invalid arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Distinguish between validity and soundness in evaluation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Apply truth table methods for simple arguments</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Testing Validity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Methods for Testing Validity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. The Counterexample Method</h3>
            <p className="text-muted-foreground mb-4">
              Try to imagine a situation where the premises are true but the conclusion is false. 
              If you can find such a counterexample, the argument is invalid.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <p className="font-medium">Example Argument:</p>
              <div className="pl-4 border-l-2 border-primary space-y-1">
                <p>Premise 1: All politicians are wealthy</p>
                <p>Premise 2: John is wealthy</p>
                <p>Conclusion: Therefore, John is a politician</p>
              </div>
              
              <p className="font-medium mt-4">Counterexample Test:</p>
              <p className="text-sm">
                Can we imagine John being wealthy but NOT a politician? Yes - he could be a wealthy 
                business owner. This counterexample shows the argument is invalid.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. The Substitution Method</h3>
            <p className="text-muted-foreground mb-4">
              Replace the content words with other terms to see if the logical form holds up.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <p className="font-medium">Original Argument:</p>
              <div className="pl-4 border-l-2 border-green-500 space-y-1">
                <p>All dogs are animals</p>
                <p>Fido is a dog</p>
                <p>Therefore, Fido is an animal</p>
              </div>
              
              <p className="font-medium">Substitution Test:</p>
              <div className="pl-4 border-l-2 border-blue-500 space-y-1">
                <p>All cars are vehicles</p>
                <p>My Honda is a car</p>
                <p>Therefore, my Honda is a vehicle</p>
              </div>
              
              <p className="text-sm">
                The substituted argument is also valid, confirming the logical form is sound.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validity vs Soundness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Validity vs. Soundness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-600">Valid Arguments</h3>
              <p className="text-sm text-muted-foreground">
                The conclusion follows logically from the premises, regardless of whether 
                the premises are actually true.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                <p className="text-sm font-medium">Example:</p>
                <p className="text-xs">All unicorns are magical → Sparkles is a unicorn → Sparkles is magical</p>
                <p className="text-xs text-green-600 mt-1">✓ Valid (but not sound - false premise)</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-600">Sound Arguments</h3>
              <p className="text-sm text-muted-foreground">
                Both valid in structure AND all premises are actually true.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                <p className="text-sm font-medium">Example:</p>
                <p className="text-xs">All humans are mortal → Socrates is human → Socrates is mortal</p>
                <p className="text-xs text-blue-600 mt-1">✓ Sound (valid + true premises)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Truth Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Truth Table Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            For arguments involving logical connectors (and, or, if-then), truth tables provide 
            a systematic way to test validity.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Example: Testing "If P then Q, P, therefore Q"</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">P</th>
                    <th className="p-2 text-left">Q</th>
                    <th className="p-2 text-left">If P then Q</th>
                    <th className="p-2 text-left">Conclusion Valid?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">True</td>
                    <td className="p-2">True</td>
                    <td className="p-2">True</td>
                    <td className="p-2 text-green-600">✓ Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">True</td>
                    <td className="p-2">False</td>
                    <td className="p-2">False</td>
                    <td className="p-2 text-gray-500">N/A (premise false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">False</td>
                    <td className="p-2">True</td>
                    <td className="p-2">True</td>
                    <td className="p-2 text-gray-500">N/A (P false)</td>
                  </tr>
                  <tr>
                    <td className="p-2">False</td>
                    <td className="p-2">False</td>
                    <td className="p-2">True</td>
                    <td className="p-2 text-gray-500">N/A (P false)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Result: No case where premises are true and conclusion is false → Valid!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Test These Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Argument 1:</h4>
              <div className="space-y-1 text-sm">
                <p>All cats are independent</p>
                <p>Some pets are cats</p>
                <p>Therefore, some pets are independent</p>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p className="font-medium text-green-600">Valid!</p>
                  <p>This follows the valid form: All A are B, Some C are A, therefore Some C are B.</p>
                  <p>Counterexample test fails - no way for premises to be true and conclusion false.</p>
                </div>
              </details>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Argument 2:</h4>
              <div className="space-y-1 text-sm">
                <p>If it's raining, the streets are wet</p>
                <p>The streets are wet</p>
                <p>Therefore, it's raining</p>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p className="font-medium text-red-600">Invalid!</p>
                  <p>This commits the fallacy of affirming the consequent.</p>
                  <p>Counterexample: Streets could be wet from sprinklers, not rain.</p>
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle>Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Always test validity first - can the conclusion be false when premises are true?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Counterexamples are your best tool for detecting invalid arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>A valid argument with false premises is unsound but still logically correct</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Truth tables provide systematic testing for complex logical structures</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Completion Section */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              {isCompleted ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <PlayCircle className="w-16 h-16 text-primary" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {isCompleted ? "Lesson Complete!" : "Ready to finish?"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isCompleted 
                  ? "Great work! You've mastered the systematic evaluation of deductive arguments."
                  : "Complete this lesson to continue your journey in logical reasoning."
                }
              </p>
              
              <div className="flex gap-2 justify-center">
                {!isCompleted && (
                  <Button onClick={handleComplete} size="lg">
                    Complete Lesson
                  </Button>
                )}
                
                {isCompleted && hasNext && (
                  <Button onClick={onNext} size="lg">
                    Next Lesson
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}