import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Eye, Target, Search } from 'lucide-react';

interface NeurodiversityLesson5Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson5: React.FC<NeurodiversityLesson5Props> = ({
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
          <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
          <span className="text-red-800 dark:text-red-200 font-semibold">UNIT 3: APPLYING YOUR STRENGTHS</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 3.1: Thriving in Economics</h1>
        <p className="text-xl text-muted-foreground">Economics: A Science of Patterns and Systems</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Economics: A Science of Patterns and Systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              The entire field of economics is built on <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('patterns')}
              >patterns</strong> and <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('relationships')}
              >relationships</strong>. This is where your mind's unique wiring shines. You may not enjoy reading a dense textbook, but you are naturally equipped to understand the underlying logic that makes the economy tick. Don't feel pressured to read every single word; instead, use your visual and systematic strengths.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Economics is a subject about memorizing a lot of complicated facts.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> Economics is a science of cause and effect. It's about recognizing patterns and understanding relationships. Your neurodivergent ability to see connections and think in systems gives you a natural advantage in this field. You don't have to memorize; you can <strong>understand</strong> the logic.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> You have to be good at math to be good at economics.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> While math is a tool in economics, the most important skills are logic and reasoning. Many of the most successful economists and business leaders are big-picture thinkers who can see trends, not just numbers. Your ability to think in systems is a far greater asset than rote mathematical skill.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Your Strengths in Action */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Your Strengths in Action:</h3>
        
        {/* Strength 1: Pattern Recognition */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Eye className="w-6 h-6 mr-2" />
              Pattern Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Instead of getting bogged down in text, focus on the charts, graphs, and visual aids. Use your ability to see patterns in data to understand concepts like supply and demand. Recreating graphs and models can be a powerful learning tool for you.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Financial Analyst</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A financial analyst with a neurodivergent mind might look at a complex stock market graph and instantly see a pattern—a repeating shape or trend—that a neurotypical mind would have to analyze with slow, deliberate steps. This ability to spot patterns can lead to a significant competitive advantage. For example, they might be the first to notice a company's stock price repeating a specific pattern just before a major breakthrough, giving them a heads-up on the market.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    What trends in the real world have you noticed that others don't seem to see? How can you apply this to your studies? Think about your favorite video game: did you notice a pattern in how the game works that gave you an advantage over other players? This is the same skill you'll use in this course.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strength 2: Hyperfocus */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
              <Target className="w-6 h-6 mr-2" />
              Hyperfocus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Use your capacity for deep, intense focus to master a single, complex topic. If a subject like the European Central Bank's policy or a company's corporate strategy fascinates you, dive in without distraction. This deep immersion is your path to becoming an expert.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Practical Application:</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Find a news article about a company you find interesting. Set a timer for 15 minutes and dive into it with no distractions. What can you learn in a short amount of time when you are completely focused?
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Strength 3: Attention to Detail */}
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
                This will make you great at analyzing economic policies. You can spot the small details in a government budget or a trade agreement that others might miss. You can also use this strength to carefully check your work and identify small errors.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Real-World Example:</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Think about a new government policy. A neurotypical person might focus on the headline, but your attention to detail could help you read the fine print. What could you learn about a tax cut that others would overlook?
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            The Full Teaching Moment: Your Brain's Economic Advantage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Economics is not a subject that requires a specific type of brain; it is a subject that rewards clear thinking, logical reasoning, and a systematic approach. Your neurodiverse mind is uniquely equipped to excel at this. Don't be intimidated by the numbers or the jargon. Instead, focus on the relationships and the cause-and-effect patterns. Your brain is wired to see these connections, and this course will give you the language to express what you already intuitively understand.
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