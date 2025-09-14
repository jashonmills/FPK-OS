import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Palette, MessageSquare } from 'lucide-react';

interface NeurodiversityLesson3Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson3: React.FC<NeurodiversityLesson3Props> = ({
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
        <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
          <Settings className="w-5 h-5 mr-2 text-green-600" />
          <span className="text-green-800 dark:text-green-200 font-semibold">UNIT 2: STRATEGIES FOR SUCCESS</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 2.1: Foundational Learning Strategies</h1>
        <p className="text-xl text-muted-foreground">Building Your Own Operating System for Learning</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Building Your Own Operating System for Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Just as a computer needs a specific operating system to run programs, your brain needs a set of strategies to learn effectively. The key to academic success is not to force your brain to be something it isn't, but to find the strategies that make it run efficiently.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> I have to learn like everyone else to be successful.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> There is no single "correct" way to learn. Research into <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('universal_design_learning')}
              >Universal Design for Learning (UDL)</strong> shows that what works for one person may not work for another. The most effective approach is to find what works for you and build your own learning system.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> I should force myself to sit still to study.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> Many neurodiverse individuals benefit from <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('movement_learning')}
              >movement</strong> while learning. Research shows that physical activity can help with focus and information retention. Fidget toys, walking while studying, or taking short breaks can be highly effective tools for learning.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Strategies */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Core Strategies: Your Personal Toolkit</h3>
        
        {/* Strategy 1: Structure and Predictability */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Calendar className="w-6 h-6 mr-2" />
              Structure and Predictability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Neurodiverse brains often thrive on routine. Our platform is designed with clear deadlines and a structured format to reduce anxiety and free up your mental energy for learning.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Visual Scheduler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student with ADHD finds it hard to start tasks because they feel overwhelmed. They build a visual schedule using a calendar app, color-coding each subject and breaking down large assignments into smaller, manageable chunks. They also include short, 10-minute breaks to walk around, which helps them stay on track.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    When you have a big task, do you feel overwhelmed? How can you apply the strategy of breaking it down into smaller parts? Try creating a simple schedule for a study session. Does seeing the plan laid out make you feel more in control?
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strategy 2: Multisensory Learning */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <Palette className="w-6 h-6 mr-2" />
              Multisensory Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                We go beyond text. Your brain may not process a long paragraph the same way. We encourage you to engage multiple senses. Use visual aids, interactive activities, and audio content to improve comprehension and retention.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Kinesthetic Learner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student with dyslexia and dyspraxia struggles to understand abstract concepts in economics. Instead of just reading about supply and demand, they use clay to build a physical model of the supply and demand curves. This hands-on, three-dimensional activity helps them internalize the concept in a way that words alone could not.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    What senses help you learn best? Do you remember things by a visual image? By a sound? By doing something with your hands? How can you use that knowledge in your next class?
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strategy 3: Self-Advocacy */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <MessageSquare className="w-6 h-6 mr-2" />
              Self-Advocacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                This is a key skill for success. Learn to understand your own needs and to confidently communicate them. This isn't about asking for special treatment; it's about asking for the specific support you need to do your best work.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Email That Changed Everything</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student with a processing disorder feels overwhelmed by the fast pace of a lecture. Instead of staying silent, they send a polite email to the professor asking for a PDF of the lecture slides so they can review them at their own pace. The professor agrees, and the student's grades improve dramatically.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    What is one specific thing that you need to be a better student? It could be a quieter space, a longer break, or something else. How would you confidently communicate that need to a teacher, a friend, or a family member?
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            The Full Teaching Moment: Building Your System for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Your brain is unique, and that means you deserve a unique learning system. There is no magic formula, but you are the best person to build one. This lesson is about empowering you with the tools to take control of your academic journey. Don't be afraid to experiment, to try new things, and to discard what doesn't work for you. By embracing who you are and what you need, you can design a path to success that is custom-made for you. You have the power to do this.
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