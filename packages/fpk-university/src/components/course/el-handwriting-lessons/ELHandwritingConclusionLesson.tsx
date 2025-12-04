import React from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaPlayer from '@/components/course/MediaPlayer';
import { Award } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingConclusionLesson: React.FC<LessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext, 
  lessonId, 
  lessonTitle, 
  totalLessons 
}) => {
  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle={lessonTitle || "Conclusion"}
      lessonId={lessonId || 4}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
      totalLessons={totalLessons}
    >
      <div className="space-y-6">
        <MediaPlayer
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/Module%204%20-%20Conclusion.mp4"
          type="video"
          title="Module 4 - Conclusion"
          mediaId="el-handwriting-conclusion-video"
          courseId="el-handwriting"
          moduleId="4"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to the end of the Empowering Learning for Handwriting module. I hope you've found it useful. I can't wait to receive all those letters from all those young people out there. Hopefully they say nice things to me.
            </p>
            
            <p>
              Parents, well done, you've done a fantastic job supporting your children to work through this whole process and we hope you've found it useful.
            </p>

            <p>
              Why not go check out more of our courses because you've built the foundation already, so your child can start to scaffold and you'll see massive improvement in their development in whatever areas they want to develop in and maybe you want to encourage them in.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-semibold text-purple-800">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700 mt-2">
                <li>Continue daily handwriting practice</li>
                <li>Explore other courses to support your child's development</li>
                <li>Apply the emulation technique to other learning areas</li>
                <li>Share your success stories with others</li>
              </ul>
            </div>

            <p>
              So, thanks so much for your attention, thanks so much for joining in and thanks so much for coming onto the platform and from me and the rest of the FPK Team, we'll see you very soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};