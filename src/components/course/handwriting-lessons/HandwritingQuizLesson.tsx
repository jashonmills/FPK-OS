import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, CheckCircle } from 'lucide-react';

export const HandwritingQuizLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Handwriting Knowledge Quiz"
      lessonId={9}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Test Your Understanding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Let's review what you've learned about handwriting through these focused questions. 
              Take your time and think about each concept we've covered.
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Question 1: Optimal Learning State</h3>
                <p className="text-sm mb-3">
                  What are the three key components of preparing for optimal handwriting practice?
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Think about: Physical preparation, breathing, and mental focus</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Question 2: Pencil Grip</h3>
                <p className="text-sm mb-3">
                  Describe the dynamic tripod grip and why it's effective for handwriting.
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Consider: Which fingers are involved and how they provide control</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Question 3: Letter Formation</h3>
                <p className="text-sm mb-3">
                  What is the most important principle for consistent letter formation?
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Hint: It relates to where you begin each letter</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Question 4: Practice Approach</h3>
                <p className="text-sm mb-3">
                  Why is slow, deliberate practice more effective than fast repetition?
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Think about: Neural pathways and muscle memory formation</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Reflection Exercise:
              </h3>
              <p className="text-sm">
                Take a moment to write a few sentences using the techniques you've learned. 
                Notice how your handwriting has already begun to improve through mindful practice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};