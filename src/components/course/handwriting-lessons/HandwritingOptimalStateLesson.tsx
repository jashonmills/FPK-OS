import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Focus, Target } from 'lucide-react';

export const HandwritingOptimalStateLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Maintaining Your Optimal State"
      lessonId={6}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Focus className="h-6 w-6" />
              Sustaining Peak Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Now that you understand the optimal learning state, let's explore how to maintain 
              this state throughout your handwriting practice and daily writing tasks.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Building Consistency:</h3>
              <p className="text-sm">
                The key to handwriting mastery isn't just knowing the optimal state - it's being 
                able to access it reliably every time you pick up a pen.
              </p>
            </div>

            <h3 className="font-semibold">Practical Strategies:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Quick Reset Technique</h4>
                <p className="text-sm text-gray-600">
                  Before any writing session: three deep breaths, shoulder roll, 
                  gentle wrist circles. This takes 30 seconds but transforms your results.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Environmental Setup</h4>
                <p className="text-sm text-gray-600">
                  Create a consistent writing environment: proper lighting, comfortable seating, 
                  quality writing tools. Your environment supports your state.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Mental Anchoring</h4>
                <p className="text-sm text-gray-600">
                  Develop a simple phrase or image that instantly brings you into focus. 
                  "Calm, clear, confident" or visualizing smooth, flowing lines.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Integration:
              </h3>
              <p className="text-sm">
                Use these techniques not just during practice, but in real-world writing situations: 
                signing documents, taking notes, writing cards. Quality becomes habit.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Recovery Strategies:</h3>
              <p className="text-sm">
                When you notice tension or frustration creeping in, pause immediately. 
                A 30-second reset is better than 10 minutes of tense practice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};