import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlayCircle, Search, Target, Users, BookOpen } from 'lucide-react';

interface LogicLesson2_1Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function LogicLesson2_1({ onComplete, onNext, hasNext = false }: LogicLesson2_1Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Identifying Arguments in Context</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the skill of recognizing arguments embedded in different contexts and apply charitable interpretation
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
              <span>Recognize arguments embedded in various contexts (academic, political, personal, commercial)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Apply the principle of charitable interpretation when analyzing arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Identify hidden premises using contextual clues</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Reconstruct complex arguments using systematic techniques</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Same Argument, Different Contexts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            The Same Argument, Different Contexts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            The same basic argument can appear very differently depending on the context. 
            Here's how an argument about meditation might look in different settings:
          </p>
          
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-600">Academic Paper</h4>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm">
                <p>"Research indicates that regular meditation practice correlates with reduced anxiety levels. Given the prevalence of anxiety disorders among college students, universities should consider implementing meditation programs."</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Features: Formal language, citations, technical terms</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-600">Political Speech</h4>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded text-sm">
                <p>"Folks, our young people are suffering from unprecedented levels of stress and anxiety. We need practical solutions, not just talk. That's why I propose funding meditation programs in our schools—because the science shows it works."</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Features: Persuasive language, emotional appeals, audience awareness</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-purple-600">Friend's Text</h4>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded text-sm">
                <p>"Dude, you seem really stressed about exams. Maybe try that meditation app? My psych prof says it actually helps with anxiety."</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Features: Casual language, personal experience, relationship dynamics</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-orange-600">Advertisement</h4>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded text-sm">
                <p>"Feeling overwhelmed? Join millions who have discovered the life-changing power of meditation. MindfulApp reduces anxiety—it's scientifically proven!"</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Features: Benefit-focused, problem-solution structure, urgency</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Discussion:</strong> What's the same? What's different? How does context change how we interpret the argument?
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Context Types */}
      <Card>
        <CardHeader>
          <CardTitle>Arguments in Different Contexts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Academic Context
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Features:</strong> Formal language, citations, technical terms</p>
                <p><strong>Argument style:</strong> Structured, evidence-heavy, acknowledges limitations</p>
                <p><strong>Hidden assumptions:</strong> Shared disciplinary knowledge, research methodology validity</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                Political Context
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Features:</strong> Persuasive language, emotional appeals, audience awareness</p>
                <p><strong>Argument style:</strong> Simplified, repetitive, action-oriented</p>
                <p><strong>Hidden assumptions:</strong> Shared values, policy preferences, group identity</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-orange-600">Commercial Context</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Features:</strong> Benefit-focused, problem-solution structure, urgency</p>
                <p><strong>Argument style:</strong> Implicit premises, emotional triggers, selective evidence</p>
                <p><strong>Hidden assumptions:</strong> Consumer desires, product effectiveness, value propositions</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-purple-600">Personal/Informal Context</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Features:</strong> Casual language, personal experience, relationship dynamics</p>
                <p><strong>Argument style:</strong> Storytelling, emotional reasoning, assumed shared knowledge</p>
                <p><strong>Hidden assumptions:</strong> Personal history, relationship context, cultural background</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Principle of Charitable Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>The Principle of Charitable Interpretation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Definition:</h3>
            <p>Charitable interpretation means understanding an argument in its strongest, most reasonable form before evaluating it.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Why It Matters:</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Ensures fair evaluation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Prevents strawman fallacies</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Leads to productive dialogue</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Demonstrates intellectual honesty</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">How to Apply Charitable Interpretation:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Clarify Ambiguous Language</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Consider multiple possible meanings</p>
                    <p>• Choose the interpretation that makes most sense in context</p>
                    <p>• Ask: "What would a reasonable person mean by this?"</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fill in Missing Premises</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Add reasonable unstated assumptions</p>
                    <p>• Consider what premises would make the argument stronger</p>
                    <p>• Don't add premises the arguer would reject</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Consider the Best Version</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Reconstruct the argument in its most compelling form</p>
                    <p>• Fix minor logical gaps if possible</p>
                    <p>• Present the argument as the arguer would want it presented</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charitable Interpretation Example */}
      <Card>
        <CardHeader>
          <CardTitle>Charitable Interpretation in Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Original Statement:</h4>
            <p>"We shouldn't hire John because he's too old."</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Uncharitable Reading:</h4>
            <p>"This person is making an ageist argument based on irrelevant characteristics."</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Charitable Reading:</h4>
            <p>"The person might mean that John lacks familiarity with new technologies essential for this position, or that he might retire soon, affecting project continuity."</p>
          </div>
        </CardContent>
      </Card>

      {/* Context Detective Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Context Detective</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Can you identify the original context of this argument based on clues in the language?
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Mystery Argument:</h4>
            <p className="text-sm">
              "The data clearly demonstrates a significant correlation between implementation of this intervention and improved outcomes across multiple metrics. Furthermore, the cost-benefit analysis indicates substantial long-term savings that offset initial implementation expenses. Therefore, adoption of this approach represents an evidence-based solution to our current challenges."
            </p>
          </div>
          
          <details>
            <summary className="cursor-pointer text-primary hover:underline font-medium">
              Click to reveal the context and analysis
            </summary>
            <div className="mt-3 p-4 bg-green-50 dark:bg-green-950/20 rounded">
              <p className="text-sm">
                <strong>Likely Context:</strong> Academic or policy research paper
              </p>
              <p className="text-sm mt-2">
                <strong>Clues:</strong> Formal language ("demonstrates," "correlation," "metrics"), technical terms ("cost-benefit analysis," "evidence-based"), objective tone, structured reasoning. This is typical of academic or professional policy writing.
              </p>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Charitable Interpretation Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Practice: Charitable Interpretation Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Practice applying charitable interpretation to potentially problematic statements:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Statement 1:</p>
              <p className="text-sm mb-3">"These young people today have no work ethic."</p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Apply charitable interpretation
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Charitable reading:</strong> "Young people today may have different priorities and work styles than previous generations, which can be mistaken for lack of commitment. They might value work-life balance more, or prefer flexible arrangements that older generations find unfamiliar."</p>
                </div>
              </details>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Statement 2:</p>
              <p className="text-sm mb-3">"We need to stop letting emotions control our politics."</p>
              <details>
                <summary className="cursor-pointer text-primary hover:underline">
                  Apply charitable interpretation
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                  <p><strong>Charitable reading:</strong> "Political decisions should be based more on evidence, data, and rational analysis rather than solely on emotional appeals. While emotions and values are important, they should be balanced with careful reasoning about consequences and effectiveness."</p>
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Systematic Reconstruction */}
      <Card>
        <CardHeader>
          <CardTitle>Systematic Argument Reconstruction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Initial Analysis</h4>
                <p className="text-sm text-muted-foreground">Read/listen to complete text, identify main conclusion, locate explicit premises, note indicator words</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Context Integration</h4>
                <p className="text-sm text-muted-foreground">Consider audience and purpose, identify relevant background knowledge, note cultural/situational factors</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Reconstruction</h4>
                <p className="text-sm text-muted-foreground">State conclusion clearly, list all explicit premises, add necessary implicit premises, organize into logical structure</p>
              </div>
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
              <span>Context shapes how arguments are presented and should be interpreted</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Charitable interpretation helps us understand arguments in their strongest form</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Hidden premises can be identified through contextual clues and background knowledge</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Systematic reconstruction helps reveal the true structure of complex arguments</span>
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
                  ? "Great work! You can now identify arguments in any context and interpret them charitably."
                  : "Complete this lesson to master contextual argument analysis."
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