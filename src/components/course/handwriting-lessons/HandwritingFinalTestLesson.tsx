import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, Target } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const HandwritingFinalTestLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Final Handwriting Assessment"
      lessonId={10}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Comprehensive Handwriting Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Congratulations on reaching the final assessment! This comprehensive test will 
              demonstrate how much your handwriting has improved through your dedicated practice.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Assessment Components:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Letter formation consistency and accuracy</li>
                <li>Spacing and alignment control</li>
                <li>Overall legibility and presentation</li>
                <li>Personal style development</li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Part 1: Letter Practice</h3>
                <p className="text-sm mb-3">
                  Write the alphabet in both uppercase and lowercase letters, focusing on 
                  proper formation and consistent sizing.
                </p>
                <div className="text-sm text-gray-600">
                  <p>Remember: Start from the top, maintain consistent slant, control letter size</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Part 2: Word Practice</h3>
                <p className="text-sm mb-3">
                  Write these practice words, paying attention to letter spacing and word spacing:
                </p>
                <div className="bg-white p-3 rounded border text-sm font-mono">
                  handwriting • practice • excellent • improvement • confident • beautiful
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Part 3: Sentence Composition</h3>
                <p className="text-sm mb-3">
                  Write this complete sentence, maintaining consistent quality throughout:
                </p>
                <div className="bg-white p-3 rounded border text-sm italic">
                  "Through mindful practice and understanding, I have developed confident 
                  handwriting skills that will serve me well in all areas of life."
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Part 4: Personal Expression</h3>
                <p className="text-sm mb-3">
                  Write a few sentences about your handwriting journey - what you've learned 
                  and how you plan to continue improving.
                </p>
                <div className="text-sm text-gray-600">
                  <p>This is your opportunity to showcase your personal handwriting style!</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Congratulations!
              </h3>
              <p className="text-sm">
                By completing this assessment, you've demonstrated mastery of the fundamental 
                handwriting principles. Your continued practice will only make your skills stronger. 
                Well done on this achievement!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};