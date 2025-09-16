import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';

export const HandwritingConclusionLesson: React.FC<any> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Celebrating Your Handwriting Journey"
      lessonId={4}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Your Handwriting Transformation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Congratulations! You've completed the core handwriting program and learned the fundamental 
              skills that will serve you for life. Let's celebrate your progress and plan your continued growth.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5" />
                What You've Accomplished:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Mastered the optimal learning state for motor skills</li>
                <li>Developed proper grip and posture techniques</li>
                <li>Learned systematic letter formation principles</li>
                <li>Built awareness of spacing and alignment</li>
                <li>Created a foundation for lifelong improvement</li>
              </ul>
            </div>

            <h3 className="font-semibold">Continuing Your Journey:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Daily Practice</h4>
                <p className="text-sm text-gray-600">
                  Even 5-10 minutes of mindful handwriting practice daily will maintain and 
                  improve your skills. Quality over quantity.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Apply Your Skills</h4>
                <p className="text-sm text-gray-600">
                  Use your improved handwriting in real-world situations: journaling, 
                  note-taking, cards, and correspondence.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Personal Style</h4>
                <p className="text-sm text-gray-600">
                  As your skills solidify, your unique handwriting personality will emerge. 
                  Embrace and refine your individual style.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Remember:</h3>
              <p className="text-sm">
                Handwriting is a lifelong skill that reflects your attention to detail and 
                personal care. Continue to approach it with the patience and intentionality 
                you've learned in this course.
              </p>
            </div>

            <div className="text-center py-4">
              <p className="font-medium text-lg">
                🎉 Well done on completing your handwriting foundation course! 🎉
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};