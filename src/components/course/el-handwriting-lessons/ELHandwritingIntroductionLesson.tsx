import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaPlayer from '@/components/course/MediaPlayer';
import { PenTool } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingIntroductionLesson: React.FC<LessonProps> = ({ onComplete }) => {
  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle="Introduction"
      lessonId={1}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <MediaPlayer
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/Module%201%20-%20Introduction%20(3).mp4"
          type="video"
          title="Module 1 - Introduction"
          mediaId="el-handwriting-intro-video"
          courseId="el-handwriting"
          moduleId="1"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-6 w-6" />
              Hello and welcome to the Empowering Learning for Handwriting programme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This is the last programme, for now, in the Empowering Learning series. I hope you've found it useful so far and I hope you and your children are proud of yourselves for the work that you've done.
            </p>
            
            <p>
              In this module, what we're going to do is look at how you can help your child improve their handwriting. This one can be a slow process, but it's absolutely worth it. So if you stick with it and practise for a few minutes every single day, your child is going to see significant improvement in the long-term in their handwriting.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="font-semibold text-blue-800">Teaching Moment:</p>
              <p className="text-blue-700 mt-1">
                Handwriting improvement is a journey that requires patience and consistent practice. The techniques you'll learn here are based on proven methods that help children develop confident, legible writing through systematic observation and emulation.
              </p>
            </div>

            <p>
              Okay, jump on into the next module.
            </p>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};