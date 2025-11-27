import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eye } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const HandwritingEmulationLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="empowering-learning-handwriting"
      lessonTitle="Learning Through Emulation"
      lessonId={7}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-6 w-6" />
              The Power of Modeling Excellence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              One of the most effective ways to improve your handwriting is through careful 
              observation and emulation of excellent examples. This isn't copying - it's learning 
              the underlying principles through practice.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Why Emulation Works:</h3>
              <p className="text-sm">
                When you carefully trace or copy well-formed letters, your brain and muscles 
                learn the correct movement patterns. This creates neural pathways for consistent, 
                beautiful handwriting.
              </p>
            </div>

            <h3 className="font-semibold">Effective Emulation Techniques:</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Careful Observation</h4>
                <p className="text-sm text-gray-600">
                  Before copying, study the letter shape, proportions, and spacing. 
                  Notice the starting point, direction changes, and ending position.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Slow, Deliberate Practice</h4>
                <p className="text-sm text-gray-600">
                  Copy slowly at first, focusing on accuracy over speed. Feel the movement 
                  patterns and commit them to muscle memory.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Progressive Challenge</h4>
                <p className="text-sm text-gray-600">
                  Start with individual letters, progress to letter combinations, then words, 
                  and finally sentences. Build complexity gradually.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                What to Emulate:
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Well-designed handwriting worksheets and exemplars</li>
                <li>• Calligraphy and typography references</li>
                <li>• Your own best letter formations (create personal models)</li>
                <li>• Professional handwriting samples</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Beyond Copying:</h3>
              <p className="text-sm">
                As you practice emulation, you'll begin to internalize the principles of good 
                handwriting. Eventually, you'll develop your own consistent, personal style 
                based on these solid foundations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};