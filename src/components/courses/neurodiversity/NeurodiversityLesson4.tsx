import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Clock, Bot, Palette } from 'lucide-react';

interface NeurodiversityLesson4Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson4: React.FC<NeurodiversityLesson4Props> = ({
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
          <Monitor className="w-5 h-5 mr-2 text-green-600" />
          <span className="text-green-800 dark:text-green-200 font-semibold">UNIT 2: STRATEGIES FOR SUCCESS</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 2.2: The PK University Advantage</h1>
        <p className="text-xl text-muted-foreground">A Platform Built for Your Brain</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-6 h-6 mr-2" />
            A Platform Built for Your Brain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              PK University was not designed with a neurotypical student in mind. It was built for you. We recognize that one-size-fits-all education doesn't work. We offer the following features to support your learning, allowing you to bypass the friction that traditional learning environments often create.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Using technology and tools to learn is cheating.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> Assistive technology is a powerful tool for leveling the playing field. Just as a person with a broken leg uses crutches, a neurodivergent learner can use tools like text-to-speech software, noise-canceling headphones, and AI coaches to access information in a way that works for them. Technology isn't cheating; it's empowering.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> These tools are only for people with a formal diagnosis.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> These tools are for everyone. Our platform is designed using the principles of <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('universal_design_learning')}
              >Universal Design for Learning (UDL)</strong>, which means that the features that help one group of students also benefit everyone. You do not need a diagnosis to use these tools effectively.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Platform Features */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Core Platform Features:</h3>
        
        {/* Feature 1: Customizable Interface */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <Palette className="w-6 h-6 mr-2" />
              Customizable Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Our platform allows you to adjust font sizes, colors, and layouts to reduce sensory overload and optimize your focus. You have control over your own learning environment.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Sensory-Sensitive Learner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student with high sensory sensitivity finds that bright white screens and small text are overwhelming. They adjust the platform's settings to a dark theme with a larger, more readable font. This simple change drastically reduces their eye strain and allows them to focus on the content, not the screen itself.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    If you were to design the perfect study space, what would it look like? What colors would you choose? What sounds would you filter out? What layout would help you focus? Our platform can help you create that digital space.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Feature 2: Flexible Pacing */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
              <Clock className="w-6 h-6 mr-2" />
              Flexible Pacing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Our courses are self-paced, allowing you to take breaks and work at a rhythm that suits your energy levels and focus. This is a crucial element for managing your mental energy throughout the day.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Pomodoro Technique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student with a fluctuating energy level struggles to stay on task for long periods. They use the Pomodoro Technique, working for 25 minutes with a timer, and then taking a short 5-minute break. This predictable rhythm helps them manage their energy and prevents burnout.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    For a one-hour study session, would you prefer to work for 50 minutes straight or to work in 25-minute sprints with 5-minute breaks? Which plan feels more manageable for you, and why?
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Feature 3: AI Study Coach */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Bot className="w-6 h-6 mr-2" />
              AI Study Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Our AI coach uses a <strong 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('socratic_method')}
                >Socratic method</strong> to provide structured, guided learning. It can help you organize thoughts, break down complex topics, and get to the root of a problem. It provides a judgment-free space for you to work through challenges.
              </p>
            </div>
            
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Organizational Partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A student feels overwhelmed by a long list of research topics for an essay. They use the AI study coach to get started. The AI asks questions like, "What is your main idea?" and "What are three key points that support it?" This Socratic dialogue helps the student organize their thoughts and build a clear outline without a blank page.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                  <p className="text-muted-foreground">
                    How might an AI that asks you questions help you to organize a jumbled set of ideas in your head? How is that different from an AI that just gives you a summary?
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-6 h-6 mr-2" />
            The Full Teaching Moment: A Partner in Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              This platform is more than just a place to take courses—it's your partner in learning. We provide the tools and flexibility you need to succeed, but the real power comes from your willingness to use them. These features are not crutches; they are accelerators. They are designed to help you bypass the obstacles of traditional education and showcase your incredible potential. Embrace these tools, and make this platform your own. We are here to help you every step of the way.
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