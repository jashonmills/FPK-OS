import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const HandwritingScienceLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="The Science of Handwriting"
      lessonId={5}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Understanding How We Learn to Write
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Let's explore the fascinating science behind handwriting - understanding how your brain 
              and nervous system work together to create this complex motor skill.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Neural Pathways and Motor Learning:</h3>
              <p className="text-sm">
                When you write, multiple areas of your brain coordinate: the motor cortex plans movements, 
                the cerebellum fine-tunes them, and the visual cortex processes feedback. With practice, 
                these pathways become more efficient and automatic.
              </p>
            </div>

            <h3 className="font-semibold">The Role of Your Nervous System:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Parasympathetic State</h4>
                <p className="text-sm text-gray-600">
                  When you're calm and focused, your parasympathetic nervous system allows for 
                  precise motor control and better learning retention.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium">Sympathetic Interference</h4>
                <p className="text-sm text-gray-600">
                  Stress and tension activate your sympathetic nervous system, creating muscle 
                  rigidity that interferes with fine motor control.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Muscle Memory Formation:
              </h3>
              <p className="text-sm">
                Repeated practice in a calm state creates strong neural pathways. This is why 
                practicing slowly and accurately is more effective than rushed repetitions.
              </p>
            </div>

            <h3 className="font-semibold">Research Insights:</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">Cognitive Benefits</h4>
                <p className="text-xs text-gray-600">
                  Studies show handwriting activates areas of the brain involved in learning 
                  and memory more than typing.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">Motor Development</h4>
                <p className="text-xs text-gray-600">
                  Handwriting practice develops fine motor skills that transfer to other 
                  precise activities.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Practical Application:</h3>
              <p className="text-sm">
                Understanding this science helps you optimize your practice: stay relaxed, 
                practice mindfully, and trust the learning process. Your brain is constantly 
                refining these motor patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};