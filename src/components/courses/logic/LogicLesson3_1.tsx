import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, ArrowRight, Brain, Target, Lightbulb } from 'lucide-react';

interface LogicLesson3_1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson3_1({ onComplete, onNext, hasNext = false }: LogicLesson3_1Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">What is Deductive Reasoning?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the foundations of logical reasoning where conclusions follow necessarily from premises
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
              <span>Define deductive reasoning and understand its characteristics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Distinguish deductive arguments from inductive arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Understand the concepts of validity and soundness</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognize basic patterns in deductive reasoning</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Definition and Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Understanding Deductive Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Definition</h3>
            <p className="text-muted-foreground mb-4">
              Deductive reasoning is a form of logical thinking that starts with general principles 
              or premises and moves to a specific conclusion. In a valid deductive argument, 
              if the premises are true, the conclusion must be true.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Characteristics:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Top-Down Logic:</strong> Moves from general to specific</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Certainty:</strong> Conclusions are guaranteed if premises are true</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Structure-Dependent:</strong> Validity depends on logical form</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Truth-Preserving:</strong> True premises lead to true conclusions</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classic Example */}
      <Card>
        <CardHeader>
          <CardTitle>The Classic Syllogism</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">P1</span>
                </div>
                <p className="text-lg">All humans are mortal</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">P2</span>
                </div>
                <p className="text-lg">Socrates is human</p>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">C</span>
                  </div>
                  <p className="text-lg font-semibold">Therefore, Socrates is mortal</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Why this works:</strong> If we accept that all humans are mortal (P1) and that 
              Socrates is human (P2), then we must logically conclude that Socrates is mortal. 
              There's no way for the premises to be true and the conclusion to be false.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validity vs Soundness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Validity vs. Soundness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-600">Validity</h3>
              <p className="text-sm text-muted-foreground">
                An argument is valid if the conclusion logically follows from the premises, 
                regardless of whether the premises are actually true.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                <p className="text-sm font-medium">Valid but Unsound Example:</p>
                <p className="text-xs mt-1">All birds can fly → Penguins are birds → Penguins can fly</p>
                <p className="text-xs text-green-600 mt-1">✓ Valid structure, but false premise</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-600">Soundness</h3>
              <p className="text-sm text-muted-foreground">
                An argument is sound if it is both valid AND all its premises are actually true.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                <p className="text-sm font-medium">Sound Example:</p>
                <p className="text-xs mt-1">All mammals breathe air → Whales are mammals → Whales breathe air</p>
                <p className="text-xs text-blue-600 mt-1">✓ Valid structure + true premises</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Common Deductive Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Categorical Syllogism</h4>
              <div className="text-sm space-y-1">
                <p>All A are B</p>
                <p>All C are A</p>
                <p>Therefore, all C are B</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Hypothetical Syllogism</h4>
              <div className="text-sm space-y-1">
                <p>If P, then Q</p>
                <p>If Q, then R</p>
                <p>Therefore, if P, then R</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Modus Ponens</h4>
              <div className="text-sm space-y-1">
                <p>If P, then Q</p>
                <p>P</p>
                <p>Therefore, Q</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Test Your Understanding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Which of these is a valid deductive argument?</p>
              <div className="space-y-2 text-sm">
                <div className="p-2 border rounded cursor-pointer hover:bg-muted/50">
                  <p>A) Most students study hard → John is a student → John studies hard</p>
                </div>
                <div className="p-2 border rounded cursor-pointer hover:bg-muted/50">
                  <p>B) All squares have four sides → This shape is a square → This shape has four sides</p>
                </div>
                <div className="p-2 border rounded cursor-pointer hover:bg-muted/50">
                  <p>C) Some cars are red → My car is red → My car is some car</p>
                </div>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see the answer
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded">
                  <p className="text-sm">
                    <strong>Answer: B</strong> - This follows the valid form "All A are B, X is A, therefore X is B." 
                    Option A uses "most" which makes it inductive, and Option C has confused logic.
                  </p>
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
              <span>Deductive reasoning moves from general principles to specific conclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Valid deductive arguments guarantee their conclusions if premises are true</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Soundness requires both validity and true premises</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>The logical structure determines validity, not the content</span>
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
                  ? "Excellent! You now understand the foundations of deductive reasoning."
                  : "Complete this lesson to unlock the next stage of logical thinking."
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