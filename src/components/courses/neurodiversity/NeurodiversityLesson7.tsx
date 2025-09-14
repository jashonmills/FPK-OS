import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Brain, Settings, TrendingUp } from 'lucide-react';

interface NeurodiversityLesson7Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson7: React.FC<NeurodiversityLesson7Props> = ({
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
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
          <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
          <span className="text-indigo-800 dark:text-indigo-200 font-semibold">UNIT 4: INTERACTIVE STUDY GUIDE</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 4.1: Key Concepts Review</h1>
        <p className="text-xl text-muted-foreground">A Quick Review of Core Ideas</p>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            Review Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              This section is designed to help you quickly review the most important ideas from each unit. Read through the key concepts, reflect on them, and then test your knowledge in the next lesson's quiz.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unit 1 Review */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
            <Brain className="w-6 h-6 mr-2" />
            Unit 1: A New Way of Thinking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('neurodiversity')}
                >
                  Neurodiversity:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Challenges traditional views of neurological differences as disorders, positing them as natural, valuable variations in human brain function.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('medical_vs_social_model')}
                >
                  Medical Model vs. Social Model:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The medical model views neurological differences as problems to be cured, while the social model argues that societal structures are the issue, not the individual's brain.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('reframing_traits')}
                >
                  Reframing Traits as Strengths:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The central idea that common neurodivergent traits can be seen as powerful assets.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('superpowers')}
                >
                  Superpowers:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Dyslexia (pattern recognition), ADHD (hyperfocus), and Autism (systematic problem-solving).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit 2 Review */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <Settings className="w-6 h-6 mr-2" />
            Unit 2: Strategies for Success
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('personal_operating_system')}
                >
                  Personal Operating System:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The importance of finding and building individual learning strategies rather than conforming to a single "correct" way.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('udl')}
                >
                  Universal Design for Learning (UDL):
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The principle that diverse learning approaches benefit everyone.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('core_strategies')}
                >
                  Core Strategies:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Using structure and predictability, engaging in multisensory learning, and practicing self-advocacy.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('pk_university_advantage')}
                >
                  PK University Advantage:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The platform is designed with features like a customizable interface, flexible pacing, and an AI Study Coach to support neurodiverse learners.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit 3 Review */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700 dark:text-red-300">
            <TrendingUp className="w-6 h-6 mr-2" />
            Unit 3: Applying Your Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('economics')}
                >
                  Economics:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                A science of patterns and systems where strengths like pattern recognition, hyperfocus, and attention to detail provide a natural advantage.
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('logic_critical_thinking')}
                >
                  Logic & Critical Thinking:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                A field that rewards systematic thinking, attention to detail, and logical reasoning, making it a natural fit for neurodivergent minds.
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <span 
                  className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                  onClick={() => handleConceptClick('myth_vs_fact')}
                >
                  Myth vs. Fact:
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Debunks common misconceptions about economics and logic, highlighting that these subjects are about understanding logic, not rote memorization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Neurodiversity is a strength:</strong> Your unique brain wiring is an asset, not a deficit.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Build your own system:</strong> There's no one-size-fits-all approach to learning.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Leverage your superpowers:</strong> Pattern recognition, hyperfocus, and systematic thinking are your advantages.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Use the right tools:</strong> Technology and accommodations are accelerators, not crutches.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Apply strategically:</strong> Your strengths align perfectly with subjects like economics and logic.
              </p>
            </div>
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