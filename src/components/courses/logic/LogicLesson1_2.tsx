import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, MessageSquare, Target, ArrowRight, Lightbulb } from 'lucide-react';

interface LogicLesson1_2Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson1_2({ onComplete, onNext, hasNext = false }: LogicLesson1_2Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Arguments vs. Opinions</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn to distinguish between arguments that provide reasoning and mere assertions or personal preferences
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
              <span>Distinguish arguments from opinions, explanations, and mere assertions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Identify premises and conclusions in written and spoken arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognize premise and conclusion indicator words</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Construct simple argument diagrams showing logical structure</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Opening Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Convince Me Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">Consider these two statements:</p>
          
          <div className="grid gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Statement A</h4>
              <p>"Chocolate ice cream is the best flavor."</p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Statement B</h4>
              <p>"You should eat chocolate ice cream because it contains antioxidants that may improve heart health, and it triggers endorphin release that improves mood."</p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Which is more convincing? Why?</strong> The difference is that Statement B gives you reasons—it makes an argument, while Statement A is just an assertion.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* What Makes an Argument */}
      <Card>
        <CardHeader>
          <CardTitle>What Makes an Argument?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Definition of Argument:</h3>
            <p>An argument is a set of statements where some statements (premises) are offered as support for another statement (conclusion).</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Components:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">P</span>
                </div>
                <div>
                  <h4 className="font-semibold">Premises</h4>
                  <p className="text-sm text-muted-foreground">Statements that provide support or evidence</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">C</span>
                </div>
                <div>
                  <h4 className="font-semibold">Conclusion</h4>
                  <p className="text-sm text-muted-foreground">The statement being supported or proven</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">→</span>
                </div>
                <div>
                  <h4 className="font-semibold">Inferential Claim</h4>
                  <p className="text-sm text-muted-foreground">The assertion that the premises support the conclusion</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Arguments Are NOT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-orange-500" />
            What Arguments Are NOT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-600">Mere Assertions</h4>
              <p className="text-sm text-muted-foreground mb-2">Claims without supporting reasons</p>
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> "Climate change is the most important issue facing humanity."
                <br /><em>No reasons given - just a claim.</em>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-yellow-600">Opinions</h4>
              <p className="text-sm text-muted-foreground mb-2">Personal preferences or feelings</p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> "I think horror movies are scary."
                <br /><em>Personal feeling, not supported by reasons.</em>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-600">Explanations</h4>
              <p className="text-sm text-muted-foreground mb-2">Statements that tell us why something is true (we already accept it's true)</p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm">
                <strong>Example:</strong> "The plant died because it didn't get enough water."
                <br /><em>Explains why something happened, doesn't try to prove it happened.</em>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Key Difference: Arguments vs. Explanations</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Argument:</strong> Tries to prove something is true</p>
                <p className="text-muted-foreground">Goal: Convince you to believe</p>
              </div>
              <div>
                <p><strong>Explanation:</strong> Tells us why something (already accepted as true) happened</p>
                <p className="text-muted-foreground">Goal: Help you understand</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicator Words */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-500" />
            Premise and Conclusion Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">Conclusion Indicators</h3>
              <p className="text-sm text-muted-foreground mb-3">Signal that what follows is the conclusion:</p>
              <div className="space-y-2">
                {["Therefore", "Thus", "Hence", "So", "Consequently", "As a result", "It follows that", "We can conclude that"].map((indicator) => (
                  <div key={indicator} className="px-3 py-1 bg-green-50 dark:bg-green-950/20 rounded text-sm">
                    {indicator}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Premise Indicators</h3>
              <p className="text-sm text-muted-foreground mb-3">Signal that what follows is a premise:</p>
              <div className="space-y-2">
                {["Because", "Since", "For", "Given that", "As indicated by", "The reason is that", "For the reason that", "May be inferred from"].map((indicator) => (
                  <div key={indicator} className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                    {indicator}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Important Note:</strong> Not all arguments use indicator words! Context and meaning matter most.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Practice Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Example 1:</h4>
              <p className="mb-3">"We should increase funding for public transportation <span className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">because</span> it reduces traffic congestion and helps the environment."</p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Conclusion:</strong> "We should increase funding for public transportation"</p>
                <p><strong>Premises:</strong> "it reduces traffic congestion" and "it helps the environment"</p>
                <p><strong>Indicator:</strong> "because" (premise indicator)</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Example 2:</h4>
              <p className="mb-3">"All birds have feathers. Penguins are birds. <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">Therefore</span>, penguins have feathers."</p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Premises:</strong> "All birds have feathers" and "Penguins are birds"</p>
                <p><strong>Conclusion:</strong> "Penguins have feathers"</p>
                <p><strong>Indicator:</strong> "Therefore" (conclusion indicator)</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Tricky Example:</h4>
              <p className="mb-3">"I'm going to bed early tonight since I have an important meeting tomorrow."</p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Question:</strong> Is this an argument or explanation?</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-primary hover:underline">
                    Click to see analysis
                  </summary>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded">
                    <p className="text-xs">Context matters! This could be either depending on what's being established. If the person is justifying their decision, it's an argument. If they're just explaining why they're going to bed early, it's an explanation.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Argument Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Argument Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Arguments can be visualized to show their logical structure:
          </p>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded border-2 border-blue-300">
                  Premise 1
                </div>
                <div className="flex items-center">
                  <span className="text-2xl">+</span>
                </div>
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded border-2 border-blue-300">
                  Premise 2
                </div>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-8 h-8 text-primary rotate-90" />
              </div>
              
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded border-2 border-green-300">
                Conclusion
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Identify Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            For each statement, determine if it's an argument, explanation, opinion, or assertion:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Statement 1:</p>
              <p className="text-sm mb-3">"Everyone should exercise regularly."</p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Type:</strong> Mere assertion</p>
                  <p>No reasons are given for why everyone should exercise.</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Statement 2:</p>
              <p className="text-sm mb-3">"You should wear a coat because it's cold outside and you might get sick."</p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Type:</strong> Argument</p>
                  <p><strong>Conclusion:</strong> "You should wear a coat"</p>
                  <p><strong>Premises:</strong> "it's cold outside" and "you might get sick"</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Statement 3:</p>
              <p className="text-sm mb-3">"I think pizza is delicious."</p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see analysis
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Type:</strong> Opinion</p>
                  <p>Personal preference with no supporting reasons.</p>
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
              <span>Arguments provide reasons (premises) to support conclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Not all statements are arguments - distinguish from opinions, assertions, and explanations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Indicator words help identify premises and conclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Context and meaning matter more than indicator words</span>
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
                  ? "Excellent! You can now distinguish arguments from other types of statements."
                  : "Complete this lesson to master the building blocks of logical reasoning."
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