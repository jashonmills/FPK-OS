import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Sparkles } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const HandwritingBeyondLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Beyond Basic Handwriting"
      lessonId={8}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6" />
              Expanding Your Handwriting Horizons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Now that you have a solid foundation, let's explore how to take your handwriting 
              to the next level and integrate it meaningfully into your life.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Developing Personal Style:</h3>
              <p className="text-sm">
                With consistent fundamentals in place, your unique handwriting personality will 
                naturally emerge. Embrace and refine these individual characteristics while 
                maintaining legibility and consistency.
              </p>
            </div>

            <h3 className="font-semibold">Advanced Applications:</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium">Expressive Writing</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Journaling and reflection</li>
                  <li>• Creative writing and poetry</li>
                  <li>• Personal correspondence</li>
                  <li>• Greeting cards and invitations</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">Professional Skills</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Note-taking in meetings</li>
                  <li>• Whiteboard presentations</li>
                  <li>• Form completion</li>
                  <li>• Signature development</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium">Speed Development</h4>
                <p className="text-sm text-gray-600">
                  Once accuracy is established, gradually increase writing speed while 
                  maintaining quality. Speed without control leads to deterioration.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-medium">Specialty Scripts</h4>
                <p className="text-sm text-gray-600">
                  Explore cursive writing, italic script, or basic calligraphy as advanced 
                  challenges that further refine your motor control.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                The Bigger Picture:
              </h3>
              <p className="text-sm">
                Excellent handwriting is about more than just letters on paper. It develops 
                patience, attention to detail, and pride in craftsmanship - qualities that 
                enhance every area of your life.
              </p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Lifelong Learning:</h3>
              <p className="text-sm">
                Consider handwriting a skill you'll refine throughout your life. Each piece 
                of writing is an opportunity to practice mindfulness, precision, and personal 
                expression.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};