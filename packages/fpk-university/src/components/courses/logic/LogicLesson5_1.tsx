import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, TrendingUp, BarChart3, Target, Lightbulb } from 'lucide-react';

interface LogicLesson5_1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson5_1({ onComplete, onNext, hasNext = false }: LogicLesson5_1Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">The Nature of Inductive Arguments</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore reasoning that moves from specific observations to general conclusions and deals with probability rather than certainty
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
              <span>Distinguish inductive from deductive reasoning</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Understand the role of probability in inductive arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognize the difference between strong and weak inductive arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Apply criteria for evaluating inductive reasoning</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Deductive vs Inductive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Deductive vs. Inductive Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Deductive Reasoning</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Direction:</strong> General → Specific
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Goal:</strong> Certainty through logic
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Structure:</strong> If premises are true, conclusion must be true
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>All birds have feathers</p>
                  <p>Robins are birds</p>
                  <p>→ Therefore, robins have feathers</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">100% certain if premises are true</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">Inductive Reasoning</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Direction:</strong> Specific → General
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Goal:</strong> Probability through patterns
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Structure:</strong> Premises make conclusion probable
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>Every swan I've seen is white</p>
                  <p>I've seen hundreds of swans</p>
                  <p>→ Therefore, all swans are white</p>
                </div>
                <p className="text-xs text-green-600 mt-2">Highly probable, but not certain</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strength vs Validity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Strength in Inductive Arguments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Unlike deductive arguments that are either valid or invalid, inductive arguments 
              exist on a spectrum of strength. The stronger the argument, the more probable 
              the conclusion becomes.
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-l-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Strong Inductive Arguments</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Premises make the conclusion highly probable
                </p>
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-xs mb-2">
                    "In 50 randomly selected polls, 98% of respondents preferred chocolate ice cream. 
                    Therefore, most people prefer chocolate ice cream."
                  </p>
                  <p className="text-xs text-green-600">Strong: Large, random sample supports conclusion</p>
                </div>
              </div>
              
              <div className="border-l-4 border-l-red-500 pl-4">
                <h4 className="font-semibold text-red-600 mb-2">Weak Inductive Arguments</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Premises provide little support for the conclusion
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-xs mb-2">
                    "My friend likes chocolate ice cream. Therefore, most people prefer chocolate ice cream."
                  </p>
                  <p className="text-xs text-red-600">Weak: Single case doesn't support general conclusion</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types of Inductive Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle>Common Patterns in Inductive Reasoning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Statistical Generalization
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Drawing conclusions about a population based on a sample
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Pattern:</strong> X% of observed A's are B → X% of all A's are probably B</p>
                <p><strong>Example:</strong> 85% of surveyed voters support the policy → 85% of all voters probably support it</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Causal Reasoning
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Inferring cause-and-effect relationships from observed patterns
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Pattern:</strong> A regularly precedes B → A probably causes B</p>
                <p><strong>Example:</strong> Exercise is followed by better mood → Exercise probably improves mood</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Analogical Reasoning
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Drawing conclusions based on similarities between cases
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p><strong>Pattern:</strong> A and B are similar in many ways, A has property X → B probably has property X</p>
                <p><strong>Example:</strong> Earth and Mars are both planets with atmospheres, Earth has weather → Mars probably has weather</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluating Inductive Arguments */}
      <Card>
        <CardHeader>
          <CardTitle>Criteria for Strong Inductive Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Sample Size</h4>
                <p className="text-sm text-muted-foreground">
                  Larger samples generally provide stronger support for generalizations
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Representativeness</h4>
                <p className="text-sm text-muted-foreground">
                  The sample should accurately represent the target population
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Relevant Similarities</h4>
                <p className="text-sm text-muted-foreground">
                  In analogies, the similarities should be relevant to the conclusion
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Alternative Explanations</h4>
                <p className="text-sm text-muted-foreground">
                  Consider whether other factors could explain the observed patterns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Evaluate These Inductive Arguments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm mb-3">
                "I've owned three Honda cars, and they've all been very reliable. 
                Therefore, Honda makes reliable cars."
              </p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline text-sm">
                  Click to see evaluation
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Strength:</strong> Moderate to weak</p>
                  <p><strong>Issues:</strong> Small sample size (3), possible selection bias, no comparison to other brands</p>
                  <p><strong>Improvement:</strong> Larger sample, include reliability data, compare with other manufacturers</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-sm mb-3">
                "A study of 10,000 randomly selected adults found that those who exercise regularly 
                have 30% lower rates of heart disease. Exercise probably reduces heart disease risk."
              </p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline text-sm">
                  Click to see evaluation
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Strength:</strong> Strong</p>
                  <p><strong>Strengths:</strong> Large sample, random selection, significant correlation</p>
                  <p><strong>Considerations:</strong> Correlation vs. causation, possible confounding variables</p>
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
              <span>Inductive arguments deal with probability, not certainty</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Strength depends on sample size, representativeness, and relevance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Strong inductive arguments can still have false conclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Always consider alternative explanations and confounding factors</span>
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
                  ? "Excellent! You now understand the fundamentals of inductive reasoning."
                  : "Complete this lesson to master the nature of inductive arguments."
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