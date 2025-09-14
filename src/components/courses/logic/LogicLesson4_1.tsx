import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, Network, Target, Layers, ArrowRight } from 'lucide-react';

interface LogicLesson4_1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson4_1({ onComplete, onNext, hasNext = false }: LogicLesson4_1Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Complex Deductive Arguments</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master multi-step reasoning, argument chains, and complex logical structures beyond simple syllogisms
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
              <span>Analyze multi-premise arguments with complex logical structures</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Understand serial arguments where conclusions become premises</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognize convergent and divergent argument patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Construct and evaluate complex conditional arguments</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Types of Complex Arguments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-500" />
            Types of Complex Argument Structures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-600">1. Serial Arguments (Chain Arguments)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                The conclusion of one argument becomes a premise for the next argument, creating a logical chain.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">1</span>
                      </div>
                      <span><strong>Step 1:</strong> All humans need clean water to survive</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">2</span>
                      </div>
                      <span>The river is the town's only water source</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">C1</span>
                      </div>
                      <span><strong>Therefore:</strong> The town depends on the river for survival</span>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-8 h-8 text-primary mx-auto" />
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">C1</span>
                      </div>
                      <span>The town depends on the river for survival <em>(now a premise)</em></span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">3</span>
                      </div>
                      <span>The factory will pollute the river</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xs">C2</span>
                      </div>
                      <span><strong>Therefore:</strong> The factory threatens the town's survival</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Key insight:</strong> If any link in the chain fails, the entire argument collapses.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-green-600">2. Convergent Arguments</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Multiple independent lines of reasoning support the same conclusion.
              </p>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                        Reasoning Line A:<br/>
                        Exercise improves cardiovascular health
                      </div>
                      <ArrowRight className="w-6 h-6 text-primary mx-auto rotate-45" />
                    </div>
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                        Reasoning Line B:<br/>
                        Exercise releases mood-boosting endorphins
                      </div>
                      <ArrowRight className="w-6 h-6 text-primary mx-auto rotate-[-45deg]" />
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded font-semibold">
                    Conclusion: You should exercise regularly
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Key insight:</strong> Each line of reasoning provides independent support - if one fails, others still support the conclusion.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-purple-600">3. Divergent Arguments</h4>
              <p className="text-sm text-muted-foreground mb-4">
                One set of premises supports multiple different conclusions.
              </p>
              
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <div className="text-sm">
                      <p><strong>Shared Premises:</strong></p>
                      <p>Climate change is accelerating</p>
                      <p>Sea levels are rising</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 gap-8">
                      <ArrowRight className="w-6 h-6 text-primary rotate-[-45deg]" />
                      <ArrowRight className="w-6 h-6 text-primary rotate-45" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded text-sm font-semibold">
                      Conclusion A:<br/>
                      Coastal cities need flood barriers
                    </div>
                    <div className="px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded text-sm font-semibold">
                      Conclusion B:<br/>
                      We need emission reduction policies
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complex Conditional Arguments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            Complex Conditional Arguments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Real-world arguments often involve multiple conditional statements and nested logic structures.
          </p>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Nested Conditionals</h4>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg space-y-2">
                <p className="text-sm">If economic growth continues, then employment will increase.</p>
                <p className="text-sm">If employment increases, then consumer spending will rise.</p>
                <p className="text-sm">If consumer spending rises, then businesses will invest more.</p>
                <p className="text-sm font-semibold">Therefore: If economic growth continues, then businesses will invest more.</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This creates a chain: Economic Growth → Employment → Spending → Investment
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Multiple Conditions</h4>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg space-y-2">
                <p className="text-sm">If it rains AND the roads are icy, then driving will be dangerous.</p>
                <p className="text-sm">It is raining.</p>
                <p className="text-sm">The temperature is below freezing (so roads are icy).</p>
                <p className="text-sm font-semibold">Therefore: Driving will be dangerous.</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Both conditions must be met for the conclusion to follow.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Disjunctive Conditions (Either/Or)</h4>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg space-y-2">
                <p className="text-sm">If either the power goes out OR the internet fails, then we cannot work remotely.</p>
                <p className="text-sm">The power has gone out.</p>
                <p className="text-sm font-semibold">Therefore: We cannot work remotely.</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Only one of the conditions needs to be true for the conclusion to follow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyzing Complex Arguments */}
      <Card>
        <CardHeader>
          <CardTitle>Strategies for Analyzing Complex Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Map the Structure</h4>
                <p className="text-sm text-muted-foreground">
                  Identify all premises and conclusions, then draw connections between them. Use boxes for statements and arrows for logical relationships.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Find the Weakest Link</h4>
                <p className="text-sm text-muted-foreground">
                  In serial arguments, identify which step is most questionable. In convergent arguments, assess which line of reasoning is strongest.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Check for Hidden Premises</h4>
                <p className="text-sm text-muted-foreground">
                  Complex arguments often rely on unstated assumptions. Make these explicit to fully evaluate the argument.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Test Each Component</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluate each sub-argument separately before assessing the overall structure. A complex argument is only as strong as its weakest component.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Analyze This Complex Argument</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Complex Argument:</h4>
            <div className="text-sm space-y-2">
              <p>"Social media use is associated with increased anxiety and depression among teenagers. This mental health crisis is affecting their academic performance, as stressed students cannot focus effectively on their studies. Poor academic performance limits future opportunities, including college admission and career prospects. Additionally, mental health problems in adolescence often persist into adulthood, creating long-term societal costs. Therefore, schools should implement strict limits on social media access during school hours, and parents should monitor their children's social media use more closely."</p>
            </div>
          </div>
          
          <details>
            <summary className="cursor-pointer text-primary hover:underline font-medium">
              Click to see structural analysis
            </summary>
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                <p className="text-sm font-medium">Structure Type: Serial + Divergent</p>
                <p className="text-sm">Serial chain: Social media → Mental health → Academic performance → Future opportunities</p>
                <p className="text-sm">Divergent: Same premises lead to two different solutions (school limits + parent monitoring)</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                <p className="text-sm font-medium">Key Premises:</p>
                <p className="text-sm">1. Social media increases teen anxiety/depression<br/>
                2. Mental health affects academic focus<br/>
                3. Poor grades limit opportunities<br/>
                4. Teen mental health issues persist into adulthood</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                <p className="text-sm font-medium">Potential Weaknesses:</p>
                <p className="text-sm">• Assumes correlation equals causation<br/>
                • May oversimplify complex relationship between social media and mental health<br/>
                • Solutions may not address root causes</p>
              </div>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Common Pitfalls */}
      <Card>
        <CardHeader>
          <CardTitle>Common Pitfalls in Complex Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-600">The Weak Link Problem</h4>
              <p className="text-sm text-muted-foreground">
                In serial arguments, if any step is invalid or has false premises, the entire chain fails. Always identify and scrutinize the weakest connection.
              </p>
            </div>
            
            <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-yellow-600">Hidden Assumption Overload</h4>
              <p className="text-sm text-muted-foreground">
                Complex arguments often rely on many unstated premises. Make sure you identify and evaluate these hidden assumptions.
              </p>
            </div>
            
            <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-orange-600">Structure Confusion</h4>
              <p className="text-sm text-muted-foreground">
                Don't mistake convergent arguments for serial ones, or vice versa. The evaluation criteria are different for each structure type.
              </p>
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
              <span>Complex arguments combine multiple logical structures (serial, convergent, divergent)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Serial arguments are only as strong as their weakest link</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Convergent arguments provide multiple independent lines of support</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Always map the structure before evaluating the content</span>
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
                  ? "Excellent! You can now analyze and construct complex multi-step arguments."
                  : "Complete this lesson to master advanced argument structures."
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