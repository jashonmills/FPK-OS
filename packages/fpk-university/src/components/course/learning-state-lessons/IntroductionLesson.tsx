import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const IntroductionLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%201%20(a)%20-%20Learning%20State%20Introduction.mp4"
        type="video"
        title="Getting Into The Most Effective Learning State - Introduction"
        mediaId="learning-state-intro"
        courseId="optimal-learning-state"
        moduleId="1"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Getting Into The Most Effective Learning State
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <h2 className="text-xl font-semibold">Introduction:</h2>
            
            <p>Firstly, let's get one thing straight from the beginning: every child can learn. Every child is born with creativity, imagination and a desire to gain knowledge. Most students will experience an educational system based on a 250-year-old model that rewards children who can sit down, be quiet and regurgitate the information they hear, on demand for an exam or test. This does not reflect real life in any way, shape or form. By undertaking these programmes, we hope that you and your child will develop the skills to calm your nervous system, reduce overload and develop a life-long love of learning, while never doubting your ability to do so. The following content is designed to help you create the most effective learning state for your child to give the best chance of being successful in their educational journey.</p>

            <p>By arming them with these simple techniques, they will be empowered to take control of their mental, emotional and visual systems, creating calmness within. It is almost impossible to learn when stressed, so this calmness is essential to our ability to grasp new concepts and knowledge.</p>

            <p>Some of these approaches will be really effective for your child, others may be less so, hence why we offer a range of tools which allow each learner to find what works best for them individually. This can present challenges for us as parents, as we may learn in a completely different way and it can be hard to grasp the fact that our children gain knowledge through, sometimes, completely opposing paths than us. So, one piece of advice, follow your child's lead, and be curious as to how they learn; they have innate skills that they understand better than anyone else on this planet!</p>

            <p>Have fun playing around trying to figure out the best path with your child and it's important to remember that they can change their minds as sometimes a technique that works now, might be less useful or effective in the future and this is okay! Don't overdo it; find the ones that work best for you and your child/student.</p>

            <p>Side Note: check out our Positive Parenting Skills and Parents Self-Care programmes to give you some extra skills to be able to manage your role as a parent…it ain't easy all the time!!</p>

            <p>These are all reasonable adjustments and anyone can do them - you don't need certification.</p>
          </div>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Key Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every child can learn. The key is finding the right approach that works for them individually and creating a calm, stress-free learning environment.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};