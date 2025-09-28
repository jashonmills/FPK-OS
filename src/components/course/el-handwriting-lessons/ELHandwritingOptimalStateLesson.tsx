import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaPlayer from '@/components/course/MediaPlayer';
import { Brain } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingOptimalStateLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle="The Optimal Learning State"
      lessonId={2}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <MediaPlayer
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/Module%202%20-%20The%20Optimal%20Learning%20State%20(3).mp4"
          type="video"
          title="Module 2 - The Optimal Learning State"
          mediaId="el-handwriting-optimal-state-video"
          courseId="el-handwriting"
          moduleId="2"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              The Optimal Learning State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Okay, I know I know I know I've said it too many times you probably wanna give me a slap at this stage but the very first thing we have to do is get our children into the best optimal learning state.
            </p>
            
            <p>
              So go back to the learning state course, grab the techniques that have worked for your children and the ones that have worked for you. Get yourselves all grounded, and that's going to help you get into the learning state.
            </p>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800 mb-2">Key Techniques to Use:</h3>
              <ul className="list-disc list-inside space-y-1 text-green-700">
                <li>Tree grounding technique</li>
                <li>Deep breathing exercises</li>
                <li>Body relaxation methods</li>
                <li>Mental focus preparation</li>
              </ul>
            </div>

            <p>
              Then come back and jump in to module 3.
            </p>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};