import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, Scale, Target, Star, AlertTriangle } from 'lucide-react';

interface LogicLesson2_2Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson2_2({ onComplete, onNext, hasNext = false }: LogicLesson2_2Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Evaluating Argument Quality</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn systematic criteria to assess the strength and soundness of arguments using comprehensive evaluation frameworks
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
              <span>Apply systematic criteria to evaluate argument quality</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Distinguish between truth of premises and validity of logical structure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Use a comprehensive framework for argument assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Provide constructive feedback on argument strengths and weaknesses</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Opening Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            Rate These Arguments Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Before we learn systematic evaluation, rate these arguments on a scale of 1-10 based on your initial impression:
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Argument A:</h4>
              <p className="text-sm mb-2">"All dogs are mammals. Fido is a dog. Therefore, Fido is a mammal."</p>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <div key={num} className="w-8 h-8 border rounded flex items-center justify-center text-xs hover:bg-muted cursor-pointer">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Argument B:</h4>
              <p className="text-sm mb-2">"Studies show that 90% of successful people wake up before 6 AM. You want to be successful. Therefore, you should wake up before 6 AM."</p>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <div key={num} className="w-8 h-8 border rounded flex items-center justify-center text-xs hover:bg-muted cursor-pointer">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Argument C:</h4>
              <p className="text-sm mb-2">"My grandfather smoked cigarettes every day and lived to be 95. Cigarettes don't cause health problems."</p>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <div key={num} className="w-8 h-8 border rounded flex items-center justify-center text-xs hover:bg-muted cursor-pointer">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-sm">
              By the end of this lesson, you'll have systematic criteria to evaluate any argument objectively and consistently.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Four Pillars of Argument Quality */}
      <Card>
        <CardHeader>
          <CardTitle>The Four Pillars of Argument Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">1</span>
                </div>
                Structural Validity
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Question:</strong> "If the premises were true, would the conclusion logically follow?"
              </p>
              <p className="text-xs text-muted-foreground">
                Focus: The logical connection between premises and conclusion<br/>
                Independent of: Whether premises are actually true
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">2</span>
                </div>
                Premise Truth
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Question:</strong> "Are the premises actually true or well-supported?"
              </p>
              <p className="text-xs text-muted-foreground">
                Focus: The factual accuracy and evidence base<br/>
                Independent of: Whether the logic is valid
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xs">3</span>
                </div>
                Premise Relevance
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Question:</strong> "Do the premises actually relate to the conclusion?"
              </p>
              <p className="text-xs text-muted-foreground">
                Focus: Whether premises provide appropriate support<br/>
                Common problem: Red herring premises that sound related but aren't
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xs">4</span>
                </div>
                Completeness
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Question:</strong> "Are there important premises missing or counterarguments unaddressed?"
              </p>
              <p className="text-xs text-muted-foreground">
                Focus: Whether the argument considers the full picture<br/>
                Common problem: Cherry-picking evidence or ignoring obvious objections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Matrix Example */}
      <Card>
        <CardHeader>
          <CardTitle>Argument Quality Matrix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Let's evaluate our opening arguments using these four criteria:
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border p-2 text-left">Argument</th>
                  <th className="border p-2">Validity</th>
                  <th className="border p-2">Truth</th>
                  <th className="border p-2">Relevance</th>
                  <th className="border p-2">Completeness</th>
                  <th className="border p-2">Overall</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Dog/Mammal</td>
                  <td className="border p-2 text-center text-green-600">High</td>
                  <td className="border p-2 text-center text-green-600">High</td>
                  <td className="border p-2 text-center text-green-600">High</td>
                  <td className="border p-2 text-center text-green-600">High</td>
                  <td className="border p-2 text-center text-green-600 font-bold">Excellent</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Wake-up time</td>
                  <td className="border p-2 text-center text-yellow-600">Medium</td>
                  <td className="border p-2 text-center text-yellow-600">Medium</td>
                  <td className="border p-2 text-center text-red-600">Low</td>
                  <td className="border p-2 text-center text-red-600">Low</td>
                  <td className="border p-2 text-center text-red-600 font-bold">Poor</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Grandfather smoking</td>
                  <td className="border p-2 text-center text-red-600">Low</td>
                  <td className="border p-2 text-center text-green-600">High</td>
                  <td className="border p-2 text-center text-red-600">Low</td>
                  <td className="border p-2 text-center text-red-600">Low</td>
                  <td className="border p-2 text-center text-red-600 font-bold">Very Poor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Truth vs Validity Deep Dive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Truth vs. Validity: A Critical Distinction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Validity = Logical Structure</h3>
              <div className="space-y-2 text-sm">
                <p>• An argument is valid if the conclusion follows logically from the premises</p>
                <p>• Validity is about the relationship between statements, not their truth</p>
                <p>• You can have valid arguments with false premises</p>
                <p>• You can have invalid arguments with true premises</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">Truth = Factual Accuracy</h3>
              <div className="space-y-2 text-sm">
                <p>• Individual statements are true or false based on reality</p>
                <p>• Truth is about correspondence with facts</p>
                <p>• Premises need to be true AND the argument needs to be valid for a sound argument</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">The Four Possible Combinations:</h3>
            <div className="grid gap-4">
              <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-950/20">
                <h4 className="font-semibold text-green-700 dark:text-green-300">1. Valid + True Premises = SOUND (Best quality)</h4>
                <p className="text-sm">Example: "All birds have feathers. Robins are birds. Therefore, robins have feathers."</p>
              </div>
              
              <div className="border rounded-lg p-3 bg-yellow-50 dark:bg-yellow-950/20">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">2. Valid + False Premises = UNSOUND (Good structure, bad information)</h4>
                <p className="text-sm">Example: "All birds can fly. Penguins are birds. Therefore, penguins can fly."</p>
              </div>
              
              <div className="border rounded-lg p-3 bg-orange-50 dark:bg-orange-950/20">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300">3. Invalid + True Premises = UNSOUND (Good information, bad structure)</h4>
                <p className="text-sm">Example: "Some birds can fly. Robins are birds. Therefore, all birds can fly."</p>
              </div>
              
              <div className="border rounded-lg p-3 bg-red-50 dark:bg-red-950/20">
                <h4 className="font-semibold text-red-700 dark:text-red-300">4. Invalid + False Premises = UNSOUND (Bad structure AND bad information)</h4>
                <p className="text-sm">Example: "All birds live underwater. Cats are birds. Therefore, cats live underwater."</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STAR Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            The STAR Method for Argument Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">S</span>
              </div>
              <div>
                <h4 className="font-semibold">Structure Analysis</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Identify premises and conclusion</p>
                  <p>• Check logical connections</p>
                  <p>• Look for missing steps</p>
                  <p>• Assess argument type (deductive vs. inductive)</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">T</span>
              </div>
              <div>
                <h4 className="font-semibold">Truth Assessment</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Evaluate premise credibility</p>
                  <p>• Check evidence quality</p>
                  <p>• Consider source reliability</p>
                  <p>• Look for factual errors</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">A</span>
              </div>
              <div>
                <h4 className="font-semibold">Adequacy Review</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Determine if premises are sufficient</p>
                  <p>• Check for relevant missing information</p>
                  <p>• Consider counterevidence</p>
                  <p>• Assess scope and limitations</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">R</span>
              </div>
              <div>
                <h4 className="font-semibold">Reasonableness Check</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Apply common sense tests</p>
                  <p>• Consider practical implications</p>
                  <p>• Check for bias or unfair assumptions</p>
                  <p>• Evaluate overall persuasiveness</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STAR Method Example */}
      <Card>
        <CardHeader>
          <CardTitle>STAR Method in Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Sample Argument:</h4>
            <p className="text-sm">
              "The city should ban plastic bags because they harm marine life. Sea turtles mistake plastic bags for jellyfish and die after eating them. We've found plastic bags in the stomachs of beached whales. Therefore, banning plastic bags will save marine animals."
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-600">S - Structure Analysis</h4>
              <div className="text-sm space-y-1">
                <p>• Clear premise-conclusion structure ✓</p>
                <p>• Logical connection between harm and solution ✓</p>
                <p>• Missing premise: plastic bags actually reach marine environments</p>
                <p>• Type: Practical argument (inductive)</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-600">T - Truth Assessment</h4>
              <div className="text-sm space-y-1">
                <p>• Sea turtle behavior: Well-documented ✓</p>
                <p>• Whale stomach contents: Verifiable through research ✓</p>
                <p>• Causal connection: Supported by scientific studies ✓</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-purple-600">A - Adequacy Review</h4>
              <div className="text-sm space-y-1">
                <p>• Missing: How many animals affected vs. total population?</p>
                <p>• Missing: Would a ban actually reduce marine plastic?</p>
                <p>• Missing: Are there alternative solutions?</p>
                <p>• Counterevidence: Other sources of marine plastic pollution</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-orange-600">R - Reasonableness Check</h4>
              <div className="text-sm space-y-1">
                <p>• Practical feasibility of ban</p>
                <p>• Economic impacts on businesses</p>
                <p>• Effectiveness compared to alternatives</p>
                <p>• Overall: Reasonable concern, solution may be incomplete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Apply the STAR Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Your Turn:</h4>
            <p className="text-sm">
              "College tuition is too expensive because many students graduate with overwhelming debt. The average student loan debt is now over $30,000. This forces graduates to delay major life decisions like buying homes or starting families. Therefore, the government should make college free for everyone."
            </p>
          </div>
          
          <details>
            <summary className="cursor-pointer text-primary hover:underline font-medium">
              Click to see STAR analysis
            </summary>
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                <p className="text-sm"><strong>Structure:</strong> Clear causal chain, but big leap from "too expensive" to "free for everyone"</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                <p className="text-sm"><strong>Truth:</strong> $30,000 debt figure is verifiable, life delay effects are documented</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                <p className="text-sm"><strong>Adequacy:</strong> Missing costs of "free" college, alternative solutions, economic impacts</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                <p className="text-sm"><strong>Reasonableness:</strong> Identifies real problem but solution may be oversimplified</p>
              </div>
            </div>
          </details>
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
              <span>Use systematic criteria: validity, truth, relevance, and completeness</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Distinguish between logical structure (validity) and factual accuracy (truth)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>The STAR method provides a comprehensive evaluation framework</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Good arguments require both sound logic AND adequate supporting evidence</span>
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
                  ? "Excellent! You now have systematic tools to evaluate any argument's quality."
                  : "Complete this lesson to master comprehensive argument evaluation."
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