import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Square, AlertCircle } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const BreathingLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%206%20-%20Breathing.mp4"
        type="video"
        title="Box Breathing Technique"
        mediaId="box-breathing-video"
        courseId="empowering-learning-state"
        moduleId="7"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Wind className="h-6 w-6 text-primary" />
            Breathing: Box Breathing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Box breathing is a tool we use constantly, both for ourselves and the people we work with. This technique allows you to regulate your breathing and control your nervous system. Plus, it is so simple.</p>
          </div>
          
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                <Square className="h-5 w-5" />
                Box Breathing Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-blue-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div>Begin by closing your eyes or if you prefer, keep them open and commit to focusing on your breathing, nothing else matters right now.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div><strong>Breathe in for four seconds</strong> through your nose. Take a good deep breath, deep into your belly, filling your whole lungs without raising your shoulders.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div><strong>Hold your breath for four seconds.</strong> This can be challenging when we start out but very quickly, you won't even notice the time.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <div><strong>Breathe out, through your nose, for four seconds</strong> or a little longer. Breathe out nice and slowly, controlling your breath.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                  <div><strong>Hold your breath for four seconds.</strong></div>
                </li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800 font-medium">Continue this process until you feel yourself calming down.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <AlertCircle className="h-5 w-5" />
                Important Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800">
                <strong>Breathing in and out through your nose</strong> has many benefits, especially in sending calming messages to your nervous system. Mouth breathing is more excitable and stressful, increasing overload. This is the best way to breathe 24x7, but for special occasions you might like to try releasing energy with Dragon breaths.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wind className="h-5 w-5 text-blue-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start with shorter counts (2-3 seconds) if 4 seconds feels too long. Gradually build up to 4 seconds as you become more comfortable with the technique. The key is consistency and relaxation, not perfection.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};