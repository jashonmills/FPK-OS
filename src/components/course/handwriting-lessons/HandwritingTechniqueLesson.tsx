import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Target } from 'lucide-react';

export const HandwritingTechniqueLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Core Handwriting Techniques"
      lessonId={3}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-6 w-6" />
              Essential Handwriting Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Now that you're in the optimal learning state, let's explore the fundamental techniques 
              that form the foundation of excellent handwriting.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Pencil Grip</h3>
                <ul className="text-sm space-y-1">
                  <li>• Dynamic tripod grip (thumb, index, middle finger)</li>
                  <li>• Relaxed but controlled pressure</li>
                  <li>• Grip position 1-2 inches from tip</li>
                  <li>• Other fingers provide stability</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Paper Position</h3>
                <ul className="text-sm space-y-1">
                  <li>• Slight angle (20-30 degrees)</li>
                  <li>• Non-writing hand stabilizes paper</li>
                  <li>• Adjust position as you write</li>
                  <li>• Maintain consistent orientation</li>
                </ul>
              </div>
            </div>

            <h3 className="font-semibold">Letter Formation Principles:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">1. Start from the Top</h4>
                <p className="text-sm text-gray-600">
                  Most letters begin at the top line or mid-line. This creates consistent 
                  letter spacing and improves legibility.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium">2. Use Consistent Slant</h4>
                <p className="text-sm text-gray-600">
                  Whether printing or cursive, maintain a consistent slant throughout your writing. 
                  This creates visual harmony and professionalism.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium">3. Control Letter Size</h4>
                <p className="text-sm text-gray-600">
                  Maintain consistent proportions between tall letters, short letters, and 
                  letters with descenders.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Practice Focus:
              </h3>
              <p className="text-sm">
                Start with basic strokes and letter families. Master the fundamentals before 
                moving to speed and style. Quality over quantity in every practice session.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};