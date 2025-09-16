import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

export const HandwritingIntroductionLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Introduction to Handwriting Excellence"
      lessonId={1}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-6 w-6" />
              Welcome to Handwriting Mastery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to your handwriting journey! This comprehensive program will transform your approach to writing, 
              helping you develop fluent, legible, and confident handwriting skills.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What You'll Learn:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Optimal learning states for handwriting practice</li>
                <li>Proper letter formation and spacing techniques</li>
                <li>Building fluency and speed in writing</li>
                <li>Developing your personal writing style</li>
              </ul>
            </div>

            <p>
              Handwriting is more than just putting pen to paper - it's a complex motor skill that engages your brain, 
              muscles, and nervous system. Through systematic practice and understanding, you'll develop not just better 
              handwriting, but improved focus, memory, and learning capacity.
            </p>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Journey Ahead:</h3>
              <p className="text-sm">
                This course combines proven techniques with modern understanding of how we learn motor skills. 
                Each lesson builds upon the previous one, creating a solid foundation for lifelong handwriting excellence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};