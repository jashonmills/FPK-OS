import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Bird, Zap, Heart } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const PhoenixBreathLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%207%20-%20Phoenix%20Flames%20Breath.mp4"
        type="video"
        title="Phoenix Flames Breath"
        mediaId="phoenix-breath-video"
        courseId="empowering-learning-state"
        moduleId="8"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bird className="h-6 w-6 text-primary" />
            Phoenix Flames Breath
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-orange-700">
              Breathe like a magical firebird and rise into your power
            </p>
          </div>
          
          <div className="grid gap-4">
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-orange-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <Bird className="h-5 w-5" />
                  Imagine You Are a Phoenix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-800">
                  Close your eyes and picture yourself as a Phoenix – a magical bird made of fire and light. You've just come back to life from warm glowing ashes, and now you're ready to rise and soar.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <Zap className="h-5 w-5" />
                  Wings Up – Big Breathe In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800">
                  Stand or sit up straight. Hold your arms by your sides like wings, with your fingers stretched out. Take a big deep breath in through your nose while you slowly lift your arms up above your head, just like you're about to fly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <Flame className="h-5 w-5" />
                  Fire Breath Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800">
                  Now breathe out with a strong "HAAAH!" sound through your mouth, as if you're breathing out fire. At the same time, sweep your arms back down slowly, like powerful wings flapping flames into the sky. Let go of any worries, anger or nervous feelings with your breath.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <Heart className="h-5 w-5" />
                  Rest in the Ashes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Pause for a moment after you breathe out. Feel still and calm, like you're sitting quietly in the warm comforting ashes. This is your time to rest before you rise again.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                  <Bird className="h-5 w-5" />
                  Repeat the Phoenix Breath
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800">
                  Do this breath five times (or more if you like). With each breath, imagine you're getting braver, stronger, and calmer—just like a Phoenix rising.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-indigo-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">6</span>
                  <Zap className="h-5 w-5" />
                  Phoenix Power Pose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-800">
                  After your last breath, place your hands gently on your chest. Close your eyes and say quietly to yourself: <strong>"I am strong. I am calm. I can rise like a Phoenix."</strong>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-orange-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Phoenix Breath is perfect for releasing stress, anger, or nervous energy. Use it when you need to feel empowered and ready to tackle challenges with confidence and calm strength.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};