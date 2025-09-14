import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, BookOpen } from 'lucide-react';

interface NeurodiversityLesson1Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson1: React.FC<NeurodiversityLesson1Props> = ({
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
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-200 font-semibold">UNIT 1: A NEW WAY OF THINKING</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 1.1: What is Neurodiversity?</h1>
        <p className="text-xl text-muted-foreground">A New Lens for Understanding the Brain</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            A New Lens for Understanding the Brain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Neurodiversity is a concept that challenges the traditional view of neurological differences as disorders. Instead, it proposes that variations in brain function—from how we learn and socialize to how we pay attention—are a natural and valuable part of human diversity. Think of it like <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('biodiversity')}
              >biodiversity</strong> in an ecosystem. A healthy, robust ecosystem isn't one with just a single type of tree; it's one with a wide variety of plants and animals that interact in complex ways. In the same way, a diverse society is a more resilient and innovative one.
            </p>
            <p>
              This idea represents a profound shift. For decades, the dominant perspective was the <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('medical_model')}
              >medical model</strong>, which viewed neurological differences as medical problems to be "cured" or "fixed." The neurodiversity movement, however, champions a <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('social_model')}
              >social model</strong>, which argues that the real issue isn't the individual's brain, but a society that is not built to accommodate a wide range of minds. It asks, "What can our environment do to support people?"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Case Study */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Case Study: The Human Brain Forest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Imagine a team working on a new app. The lead developer is highly logical and systematic, preferring a clear, step-by-step process. The graphic designer is dyslexic and thinks in creative, non-linear ways, visualizing the entire user experience as a whole. The marketing manager has ADHD and jumps between ideas, connecting unrelated concepts to create a unique campaign. Their neurotypical manager values all of these approaches.
            </p>
            <p>
              Each person's unique way of thinking is like a different "tree" in the team's "forest." The systematic thinker is the strong, straight trunk, providing structure. The visual thinker is the broad canopy, providing creative cover. The associative thinker is the vibrant undergrowth, linking everything together in unexpected ways.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
            <p className="text-muted-foreground">
              Think about a time you had a group project. Did you notice people approaching the problem differently? Was there a "tree" that felt different from yours? How did that difference contribute to the final project, even if it felt confusing at the time?
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Key Terms and Their History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-l-green-500 pl-4">
              <h4 className="font-semibold">Neurodiversity:</h4>
              <p className="text-muted-foreground">
                The term was coined in 1998 by Australian sociologist Judy Singer. She used it to advocate for the rights of autistic people and to promote the idea that neurological differences are a form of human biodiversity.
              </p>
            </div>
            <div className="border-l-4 border-l-green-500 pl-4">
              <h4 className="font-semibold">Neurodiverse:</h4>
              <p className="text-muted-foreground">
                An individual whose brain functions in a way that diverges significantly from the neurotypical majority. This term was created to be more empowering and inclusive than older clinical labels.
              </p>
            </div>
            <div className="border-l-4 border-l-green-500 pl-4">
              <h4 className="font-semibold">Neurotypical:</h4>
              <p className="text-muted-foreground">
                An individual whose brain functions in a way that aligns with the societal norm. It is a necessary term to highlight the diversity that exists and to avoid pathologizing differences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Neurodiversity is a new, trendy concept that romanticizes disabilities.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> The concept has existed for over two decades and is supported by a growing body of scientific research and advocacy. It doesn't deny the challenges associated with neurodiversity; instead, it reframes them in a way that promotes dignity and empowers individuals to seek appropriate support without shame.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> It's just a way to avoid getting a diagnosis.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> The neurodiversity movement does not discourage diagnoses. For many people, a formal diagnosis provides access to accommodations and a community of people with similar experiences. The movement simply wants to ensure that a diagnosis is not seen as a label of inferiority.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-6 h-6 mr-2" />
            The Full Teaching Moment: Building a Foundation of Understanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              At its core, this lesson is your first step toward self-discovery. For a long time, the world may have made you feel like you were trying to fit into a box that was too small. This course is about throwing that box away. It's about recognizing that every brain has its own unique architecture. You are not a broken version of a neurotypical person. You are a unique and valuable human being, and by understanding your own mind, you can build a personalized system for success. Your journey starts now. Let's begin.
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