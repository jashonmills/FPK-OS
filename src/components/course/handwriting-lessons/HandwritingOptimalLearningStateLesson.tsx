import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart } from 'lucide-react';

export const HandwritingOptimalLearningStateLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="The Optimal Learning State for Handwriting"
      lessonId={2}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Preparing Your Mind and Body
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Before we dive into handwriting techniques, we need to prepare our nervous system for optimal learning. 
              The state of your mind and body directly affects your ability to develop fine motor skills.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">The Science of Learning States:</h3>
              <p className="text-sm">
                When we're calm and focused, our brain can form new neural pathways more effectively. 
                Stress and tension in our body create interference that makes learning motor skills more difficult.
              </p>
            </div>

            <h3 className="font-semibold">Creating Your Optimal State:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">1. Physical Preparation</h4>
                <p className="text-sm text-gray-600">
                  Sit comfortably with feet flat on the floor, back straight but relaxed. 
                  Ensure your writing surface is at the right height.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">2. Breathing and Relaxation</h4>
                <p className="text-sm text-gray-600">
                  Take three deep breaths, releasing tension in your shoulders and arms. 
                  This activates your parasympathetic nervous system for learning.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">3. Mental Focus</h4>
                <p className="text-sm text-gray-600">
                  Set a clear intention for your practice session. Approach each exercise with 
                  curiosity rather than judgment.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Practice Tip:
              </h3>
              <p className="text-sm">
                Before each handwriting session, take a moment to check in with your body. 
                Notice any tension and consciously release it. This simple practice will 
                dramatically improve your learning speed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};