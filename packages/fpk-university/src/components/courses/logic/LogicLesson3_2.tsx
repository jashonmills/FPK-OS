import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, Shapes, Target, Lightbulb, ArrowRight } from 'lucide-react';

interface LogicLesson3_2Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson3_2({ onComplete, onNext, hasNext = false }: LogicLesson3_2Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Basic Logical Forms</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the fundamental patterns of deductive reasoning through categorical and propositional logic
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
              <span>Identify and construct categorical syllogisms</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Understand propositional logic forms (modus ponens, modus tollens)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognize valid and invalid argument patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Apply logical forms to real-world arguments</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Categorical Syllogisms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shapes className="w-5 h-5 text-blue-500" />
            Categorical Syllogisms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Categorical syllogisms are three-part arguments that deal with categories and relationships 
              between them. They follow a specific structure with a major premise, minor premise, and conclusion.
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Standard Form AAA-1 (Barbara)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Major Premise</span>
                    <span>All M are P</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">Minor Premise</span>
                    <span>All S are M</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Conclusion</span>
                    <span>Therefore, all S are P</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                  <p className="font-medium mb-2">Real Example:</p>
                  <div className="space-y-1 text-sm">
                    <p>All metals conduct electricity (Major)</p>
                    <p>All copper objects are metals (Minor)</p>
                    <p>Therefore, all copper objects conduct electricity (Conclusion)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Form AII-1</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Major Premise</span>
                    <span>All M are P</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">Minor Premise</span>
                    <span>Some S are M</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Conclusion</span>
                    <span>Therefore, some S are P</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                  <p className="font-medium mb-2">Real Example:</p>
                  <div className="space-y-1 text-sm">
                    <p>All athletes are disciplined (Major)</p>
                    <p>Some students are athletes (Minor)</p>
                    <p>Therefore, some students are disciplined (Conclusion)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propositional Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-green-500" />
            Propositional Logic Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Propositional logic deals with whole propositions and their logical relationships, 
            using connectives like "if-then," "and," "or," and "not."
          </p>
          
          <div className="grid gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-green-600">Modus Ponens (Affirming the Antecedent)</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">If P, then Q</p>
                <p className="text-sm">P</p>
                <p className="text-sm font-medium">Therefore, Q</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>If it rains, then the streets get wet</p>
                  <p>It is raining</p>
                  <p><strong>Therefore, the streets are wet</strong></p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-600">Modus Tollens (Denying the Consequent)</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">If P, then Q</p>
                <p className="text-sm">Not Q</p>
                <p className="text-sm font-medium">Therefore, not P</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>If she studied hard, then she passed the exam</p>
                  <p>She did not pass the exam</p>
                  <p><strong>Therefore, she did not study hard</strong></p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-purple-600">Hypothetical Syllogism</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">If P, then Q</p>
                <p className="text-sm">If Q, then R</p>
                <p className="text-sm font-medium">Therefore, if P, then R</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>If you exercise regularly, then you'll be healthier</p>
                  <p>If you're healthier, then you'll be happier</p>
                  <p><strong>Therefore, if you exercise regularly, then you'll be happier</strong></p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-orange-600">Disjunctive Syllogism</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">Either P or Q</p>
                <p className="text-sm">Not P</p>
                <p className="text-sm font-medium">Therefore, Q</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>Either we take the highway or the back roads</p>
                  <p>The highway is closed</p>
                  <p><strong>Therefore, we take the back roads</strong></p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Invalid Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-red-500" />
            Common Invalid Forms (Fallacies)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            These forms look similar to valid ones but are actually invalid. Learning to recognize 
            them helps avoid logical mistakes.
          </p>
          
          <div className="grid gap-4">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-red-600">Affirming the Consequent (Invalid)</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">If P, then Q</p>
                <p className="text-sm">Q</p>
                <p className="text-sm">Therefore, P <span className="text-red-500 font-bold">❌ Invalid</span></p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Why it's wrong:</p>
                <div className="space-y-1 text-xs">
                  <p>If it rains, then the streets get wet</p>
                  <p>The streets are wet</p>
                  <p><strong>Therefore, it rained</strong> ← Could be sprinklers!</p>
                </div>
              </div>
            </div>
            
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-red-600">Denying the Antecedent (Invalid)</h4>
              <div className="space-y-2 mb-4">
                <p className="text-sm">If P, then Q</p>
                <p className="text-sm">Not P</p>
                <p className="text-sm">Therefore, not Q <span className="text-red-500 font-bold">❌ Invalid</span></p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                <p className="text-sm font-medium mb-2">Why it's wrong:</p>
                <div className="space-y-1 text-xs">
                  <p>If you study hard, then you'll pass</p>
                  <p>You didn't study hard</p>
                  <p><strong>Therefore, you won't pass</strong> ← You might still pass!</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Identify the Logical Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Argument 1:</p>
              <div className="space-y-1 text-sm mb-3">
                <p>If global temperatures rise, then ice caps will melt</p>
                <p>Global temperatures are rising</p>
                <p>Therefore, ice caps will melt</p>
              </div>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see the form
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Form:</strong> Modus Ponens (Valid)</p>
                  <p>If P, then Q; P; Therefore Q</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Argument 2:</p>
              <div className="space-y-1 text-sm mb-3">
                <p>All renewable energy sources are environmentally friendly</p>
                <p>Solar power is a renewable energy source</p>
                <p>Therefore, solar power is environmentally friendly</p>
              </div>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Click to see the form
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Form:</strong> Categorical Syllogism AAA-1 (Valid)</p>
                  <p>All M are P; All S are M; Therefore, all S are P</p>
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
              <span>Categorical syllogisms relate categories using "all," "some," and "no"</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Propositional forms like modus ponens and modus tollens are always valid</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Recognizing invalid forms helps avoid common logical mistakes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>The logical form determines validity, not the specific content</span>
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
                  ? "Great work! You've mastered the basic forms of deductive reasoning."
                  : "Complete this lesson to continue building your logical reasoning skills."
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