import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Cog, Search, GitBranch } from 'lucide-react';

interface NeurodiversityLesson6Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson6: React.FC<NeurodiversityLesson6Props> = ({
  onComplete,
  isCompleted,
  trackInteraction,
  lessonId,
  lessonTitle
}) => {

  const handleConceptClick = (concept: string) => {
    trackInteraction?.('concept_click', {
      concept,
      lessonId,
      lessonTitle,
      timestamp: Date.now()
    });
  };

  const handleComplete = () => {
    trackInteraction?.('lesson_completion', {
      lessonId,
      lessonTitle,
      completionMethod: 'manual',
      timestamp: Date.now()
    });
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Unit Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full">
          <Users className="w-5 h-5 mr-2 text-red-600" />
          <span className="text-red-800 dark:text-red-200 font-semibold">UNIT 3: APPLYING YOUR STRENGTHS</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 3.2: Excelling in Logic & Critical Thinking</h1>
        <p className="text-xl text-muted-foreground">Logic: A System for Thinking Clearly</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Logic: A System for Thinking Clearly
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              This course is a natural fit for a mind that is <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('logical')}
              >logical</strong>, <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('systematic')}
              >systematic</strong>, and pays <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('attention_to_detail')}
              >attention to detail</strong>. You can think of logic as a set of rules for making sense of the world. While others may get lost in emotional arguments or fallacies, your brain can cut through the noise and get to the truth.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Arguments are just about who is loudest or most persuasive.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> An argument's strength depends on its internal logic, not its emotional appeal. Your logical and systematic mind is naturally equipped to evaluate this. You are less likely to be swayed by rhetoric and more likely to see the truth. This is a crucial skill in a world full of misinformation.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Logic is cold and has no place in human arguments.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> Logic is a tool for clarity, not a replacement for empathy. By using logic to ensure our arguments are sound, we can have more productive and honest conversations with people who think differently from us. A clear argument is a compassionate one.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Your Strengths in Action */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Your Strengths in Action:</h3>
        
        {/* Strength 1: Systematic Thinking */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <Cog className="w-6 h-6 mr-2" />
              Systematic Thinking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                You have a natural advantage in this subject. Use <strong 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('argument_mapping')}
                >argument mapping</strong> as a primary study tool—it's a structured and visual way to break down complex ideas that can be more effective than just reading.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Software Engineer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A software engineer with a highly logical mind builds programs by breaking down a large, abstract problem into a series of small, solvable steps. They see the code as a logical system. Think about an argument you heard recently. Try to draw a simple map with a main conclusion at the top and arrows pointing to the premises that support it. What does the structure look like to you?
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strength 2: Attention to Detail */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <Search className="w-6 h-6 mr-2" />
              Attention to Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                This is your superpower for spotting <strong 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('logical_fallacies')}
                >logical fallacies</strong>. You can identify the subtle errors in an argument that others would overlook.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Practical Application:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Find a news article or social media post that makes an argument you disagree with. Read it carefully. Can you find a single flaw in the logic, no matter how small? Use your attention to detail to find the weak point that others missed. Your ability to spot these issues will be a valuable skill in every area of your life.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strength 3: Logical Reasoning */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <GitBranch className="w-6 h-6 mr-2" />
              Logical Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                The formal rules of <strong 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('deductive_reasoning')}
                >deductive</strong> and <strong 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('inductive_reasoning')}
                >inductive reasoning</strong> will make sense to your logical mind. You'll be great at building strong, well-structured arguments that are impossible to tear down.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Build an Argument:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Take a simple statement like, "All dogs are mammals." Add a second premise and a conclusion to create a foolproof argument. What does the logical flow feel like? Practice building these small arguments to train your mind to see the underlying logic in more complex debates.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-6 h-6 mr-2" />
            The Full Teaching Moment: Your Brain's Logical Superpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Logic and critical thinking are not abstract subjects; they are practical skills that will help you in every area of your life. Your neurodivergent mind is uniquely equipped to excel at this. You can cut through the noise, see the underlying structure of an argument, and build a case that is sound and true. This course will give you the tools and the language to express what you already intuitively understand.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      {!isCompleted && (
        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleComplete}
            size="lg"
            className="px-8 py-3"
          >
            Complete Lesson
          </Button>
        </div>
      )}
    </div>
  );
};