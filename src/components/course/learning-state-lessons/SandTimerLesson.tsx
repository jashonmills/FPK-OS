import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Pause, Lightbulb, Shield } from 'lucide-react';
import { MediaPlayer } from '@/components/course/MediaPlayer';
import sandTimerImage from '@/assets/sand-timer-image.jpg';

export const SandTimerLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%208%20-%20Sand%20Timer.mp4"
        type="video"
        title="Sand Timer Technique"
        mediaId="sand-timer-video"
        courseId="empowering-learning-state"
        moduleId={9}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Timer className="h-6 w-6 text-primary" />
            Sand Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>The Sand Timer can really help us still our minds when we feel we are becoming or have become dysregulated, and it can help us get ready to learn. You can use different time lengths for various activities. If you don't have one in your home, you can use our virtual sand timer below. You can use this technique yourself, so let the adult know that you will turn the sand time over when things are getting too much.</p>
          </div>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <Timer className="h-5 w-5" />
                How to Use the Sand Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-amber-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div>Sit on a chair with a sand timer in front of you.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div>Watch all the grains of sand fall to the bottom. Your only job whilst they are falling is to relax, breathe gently as we explained above and get grounded.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div>Now you are ready to start learning!</div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                <Timer className="h-5 w-5" />
                Virtual Sand Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <img 
                  src={sandTimerImage} 
                  alt="Virtual Sand Timer" 
                  className="mx-auto max-w-xs h-auto rounded-lg shadow-md"
                />
                <p className="text-blue-700 text-sm">
                  Focus on this sand timer image and imagine watching the sand slowly fall from top to bottom while you breathe deeply and relax.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                <Shield className="h-5 w-5" />
                Empowerment Tool for Children
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                It is a handy tool to empower your child by turning over a sand timer, when they are getting overwhelmed, before a full meltdown. The rule is once the child turns over the sand timer, don't communicate with them until the stress has passed, thus avoiding sensory overload.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Sand Timer technique helps you focus on the present moment and naturally regulates your breathing and nervous system. Use it whenever you need to transition from stress to calm, focused learning.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};