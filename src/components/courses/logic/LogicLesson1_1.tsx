import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, Brain, AlertTriangle, Target, Lightbulb } from 'lucide-react';

interface LogicLesson1_1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson1_1({ onComplete, onNext, hasNext = false }: LogicLesson1_1Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">What is Critical Thinking?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the foundations of rational thought and learn to distinguish between automatic thinking and deliberate reasoning
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
              <span>Define critical thinking using at least three key characteristics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Distinguish between automatic thinking and critical thinking in given scenarios</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Identify at least two personal thinking biases using self-reflection tools</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Explain why critical thinking matters in academic and personal contexts</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* The Monty Hall Problem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Opening Challenge: The Monty Hall Problem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
            <p className="text-lg mb-4">
              You're on a game show with three doors. Behind one is a car, behind the others are goats. 
              You pick door #1. The host opens door #3, revealing a goat, and asks if you want to 
              switch to door #2.
            </p>
            <p className="font-semibold text-purple-700 dark:text-purple-300">
              What do you do?
            </p>
          </div>
          
          <details className="mt-4">
            <summary className="cursor-pointer text-primary hover:underline font-medium">
              Click to see the surprising answer
            </summary>
            <div className="mt-3 p-4 bg-muted/50 rounded">
              <p className="text-sm">
                <strong>You should switch!</strong> Switching gives you a 2/3 chance of winning, 
                while staying gives you only 1/3. This counterintuitive result shows why our 
                "gut feelings" aren't always right - we need systematic thinking.
              </p>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Defining Critical Thinking */}
      <Card>
        <CardHeader>
          <CardTitle>What is Critical Thinking?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-lg font-medium mb-4">
              Critical thinking is the disciplined mental activity of evaluating arguments or 
              propositions and making judgments that can guide the development of beliefs and actions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Characteristics:</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Purposeful</h4>
                  <p className="text-sm text-muted-foreground">Has a clear goal or question</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Reasoned</h4>
                  <p className="text-sm text-muted-foreground">Based on evidence and logic rather than emotion or tradition</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Multi-perspective</h4>
                  <p className="text-sm text-muted-foreground">Considers different viewpoints and possibilities</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Self-reflective</h4>
                  <p className="text-sm text-muted-foreground">Aware of one's own biases and limitations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-semibold">Action-oriented</h4>
                  <p className="text-sm text-muted-foreground">Leads to better decisions and beliefs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Critical Thinking Process */}
      <Card>
        <CardHeader>
          <CardTitle>The Critical Thinking Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: "IDENTIFY", description: "the problem or question" },
              { step: 2, title: "GATHER", description: "relevant information" },
              { step: 3, title: "CONSIDER", description: "multiple perspectives" },
              { step: 4, title: "EVALUATE", description: "evidence and arguments" },
              { step: 5, title: "DRAW", description: "reasonable conclusions" },
              { step: 6, title: "MONITOR", description: "and adjust thinking as needed" }
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-muted-foreground ml-2">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Barriers to Clear Thinking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Common Mental Traps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-600">Confirmation Bias</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Seeking information that confirms our existing beliefs
              </p>
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> Only reading news sources that agree with your political views
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-orange-600">Availability Heuristic</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Judging probability by how easily examples come to mind
              </p>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> Overestimating plane crash risk after seeing news coverage
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-yellow-600">Anchoring Bias</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Over-relying on the first piece of information encountered
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> Negotiations starting from an arbitrary number
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-purple-600">Emotional Reasoning</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Believing something is true because it feels true
              </p>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> "This investment feels right, so it must be good"
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intellectual Virtues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-500" />
            Intellectual Virtues vs. Vices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">Intellectual Virtues</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                  <h4 className="font-medium">Intellectual Humility</h4>
                  <p className="text-sm text-muted-foreground">Recognizing the limits of your knowledge</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                  <h4 className="font-medium">Intellectual Courage</h4>
                  <p className="text-sm text-muted-foreground">Questioning popular beliefs when evidence suggests otherwise</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                  <h4 className="font-medium">Intellectual Empathy</h4>
                  <p className="text-sm text-muted-foreground">Understanding others' viewpoints</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">Intellectual Vices</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded">
                  <h4 className="font-medium">Intellectual Arrogance</h4>
                  <p className="text-sm text-muted-foreground">Overestimating your knowledge</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded">
                  <h4 className="font-medium">Intellectual Cowardice</h4>
                  <p className="text-sm text-muted-foreground">Avoiding challenging ideas</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded">
                  <h4 className="font-medium">Close-mindedness</h4>
                  <p className="text-sm text-muted-foreground">Refusing to consider new ideas</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Bias Recognition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Read each scenario and identify which thinking bias might be at work:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Scenario A:</p>
              <p className="text-sm mb-3">
                Sarah is choosing a college. She visits State University on a beautiful, sunny day and 
                immediately feels it's the right choice, despite not researching academics or costs.
              </p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Likely bias:</strong> Emotional reasoning and availability heuristic</p>
                  <p>Sarah is letting a single positive experience (sunny day) heavily influence a major decision.</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Scenario B:</p>
              <p className="text-sm mb-3">
                Mark only reads news from sources that align with his political views and dismisses 
                contradictory information as "fake news."
              </p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Likely bias:</strong> Confirmation bias</p>
                  <p>Mark is actively seeking information that confirms his existing beliefs while avoiding challenging perspectives.</p>
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
              <span>Critical thinking is purposeful, reasoned, and considers multiple perspectives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>We all have cognitive biases that can lead us astray from rational thinking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Developing intellectual virtues helps us become better thinkers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>The critical thinking process provides a systematic approach to decision-making</span>
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
                  ? "Great start! You've learned the foundations of critical thinking."
                  : "Complete this lesson to begin your journey in logical reasoning."
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