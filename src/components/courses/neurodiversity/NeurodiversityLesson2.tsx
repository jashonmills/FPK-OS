import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eye, Zap, Cog } from 'lucide-react';

interface NeurodiversityLesson2Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson2: React.FC<NeurodiversityLesson2Props> = ({
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
          <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-200 font-semibold">UNIT 1: A NEW WAY OF THINKING</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 1.2: Your Brain's Superpowers</h1>
        <p className="text-xl text-muted-foreground">Reframing Traits as Strengths</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Reframing Traits as Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              In this lesson, we reframe common neurodivergent traits as powerful strengths. Your brain is not a weakness; it's an asset. Your unique wiring is a source of talent that many neurotypical individuals don't possess. The key is to stop viewing your traits through a negative lens and start seeing their potential.
            </p>
            <p>
              Here are some examples of how common neurodivergent traits can be leveraged as superpowers:
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dyslexia Superpower */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
            <Eye className="w-6 h-6 mr-2" />
            Dyslexia: The Creative Visionary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              While dyslexia can present challenges with decoding text, the brain often develops incredible strengths to compensate. This can lead to a superior ability for <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('pattern_recognition')}
              >pattern recognition</strong>, <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('spatial_reasoning')}
              >spatial reasoning</strong>, and <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('holistic_thinking')}
              >holistic thinking</strong>. Instead of processing information in a slow, linear way, the dyslexic mind can often see the entire system at once, making it a natural for fields like engineering, architecture, and creative arts.
            </p>
          </div>
          
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Architect Who Sees in 3D</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                An architect with dyslexia struggles to read building codes but can walk into a room and instantly visualize it from every angle, understanding its spatial relationships and potential. When asked to solve a design problem, they don't draw a 2D floor plan first; they build a complex mental model and rotate it in their mind. This ability to "see" a problem from every side leads to innovative and elegant solutions.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                <p className="text-muted-foreground">
                  Can you remember a time when your brain seemed to skip steps and go straight to the answer? Maybe you saw a pattern in a math problem without knowing the formula, or you had a perfect vision of a project's end result before you knew how to get there. What does this tell you about your brain's unique ability?
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* ADHD Superpower */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
            <Zap className="w-6 h-6 mr-2" />
            ADHD: The Hyperfocused Innovator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              The label "attention deficit" is a misnomer. A more accurate description is "attention variability." A mind with ADHD can be highly associative, making connections between seemingly unrelated ideas, a key driver of <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('creativity')}
              >creativity</strong> and <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('innovative_thinking')}
              >thinking outside the box</strong>. Your ability for <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('hyperfocus')}
              >hyperfocus</strong> on areas of passion is a superpower for deep, intense work, allowing you to achieve a level of productivity others can only dream of.
            </p>
          </div>
          
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Event Planner Who Connects Everything</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                An event planner with ADHD is tasked with organizing a major conference. While a neurotypical planner might feel overwhelmed by the thousands of tiny details, the ADHD brain can rapidly jump between them—from finding a speaker to arranging catering to securing a venue—seeing how each detail affects the others. Their ability to manage a seemingly chaotic system of moving parts is their greatest asset.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                <p className="text-muted-foreground">
                  What is a topic or task that you can lose hours doing? What is it about that subject that allows your mind to enter a state of deep, intense focus? How can you apply that same energy to other parts of your life?
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Autism Superpower */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <Cog className="w-6 h-6 mr-2" />
            Autism: The Systematic Problem Solver
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              You have a natural advantage in fields that require precision and logic. Strengths often include an exceptional <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('attention_to_detail')}
              >attention to detail</strong>, a highly <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('logical_systematic_approach')}
              >logical and systematic approach</strong> to tasks, and an extraordinary capacity for <strong 
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded"
                onClick={() => handleConceptClick('deep_focus')}
              >deep focus</strong> on specific subjects of interest. This makes you a natural for problem-solving, data analysis, and technical fields.
            </p>
          </div>
          
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">Case Study: The Software Engineer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A software engineer with autism is tasked with debugging a massive piece of code. While a neurotypical colleague might get frustrated by the complexity, the autistic mind can methodically break the problem down into a logical system. They can spot the tiny, misplaced comma or the flawed line of code that others overlooked, solving a problem that seemed impossible.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Moment of Reflection:</h4>
                <p className="text-muted-foreground">
                  Describe a process you enjoy, like building with blocks, following a recipe, or organizing a collection. What about the methodical, step-by-step nature of it appeals to you? How does it make you feel to see a chaotic system become orderly and predictable?
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Myth vs. Fact: Unpacking the Misconceptions</h3>
        
        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Having ADHD means you are lazy and unmotivated.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> A person with ADHD is often trying to manage an overactive nervous system and an "engine with no brakes." The feeling of being "unmotivated" is often related to a struggle with executive function and working on tasks that are not stimulating. It has nothing to do with a lack of effort or a desire to succeed.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p><strong>Myth:</strong> Autism means you lack empathy or emotion.</p>
            <p className="mt-2 text-muted-foreground">
              <strong>Fact:</strong> Many people with autism feel emotions intensely, but they may express them differently. Some studies even suggest that autistic individuals can have a heightened sense of empathy for others they relate to, as they can more easily understand different perspectives.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            The Full Teaching Moment: A Superpower, Not a Deficit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              The goal of this lesson is to show you how to start seeing your traits not as personal failings, but as superpowers. Your unique wiring is not a flaw; it is a source of strength that society is just beginning to fully appreciate. We live in a world that is increasingly complex, and we need creative thinkers, systematic problem-solvers, and people who can see patterns that others miss. Your brain is a perfect fit for this new world. By understanding your unique strengths, you can choose a path in life—and in your education—that is custom-made for your success. Don't ever forget how truly powerful your mind is.
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