import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ArrowUp, Palette, FileEdit, Target } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const LookingUpLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/ep-learning-v2/Module%2010%20-%20Looking%20Up.mp4"
        type="video"
        title="Looking Up Technique"
        mediaId="looking-up-video"
        courseId="empowering-learning-state"
        moduleId="11"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            Looking Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Following on from the above, we need to look up when we are trying to learn anything. Get a whiteboard or stick post-it notes on the wall for things you have to learn to help your visual learning. You can even write an essay while writing on paper on the wall—anything to reduce the emotional charge. This also helps if you need to move around to help you learn.</p>
          </div>
          
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                <ArrowUp className="h-5 w-5" />
                Why Look Up?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-green-800">
                <p>Looking up while learning helps you:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Access visual memory more effectively</li>
                  <li>• Reduce emotional charge associated with learning</li>
                  <li>• Stay out of negative internal dialogue</li>
                  <li>• Maintain a more confident learning state</li>
                  <li>• Support natural movement during learning</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                  <Palette className="h-5 w-5" />
                  Use a Whiteboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">
                  Mount a whiteboard on the wall at eye level or slightly above. Use it for practicing spelling, math problems, drawing diagrams, or brainstorming ideas. The vertical surface naturally encourages looking up.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                  <Target className="h-5 w-5" />
                  Post-it Notes on Walls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800">
                  Stick post-it notes with key information, vocabulary words, or formulas on walls around your learning space. This encourages movement and looking up while reviewing material.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-orange-900">
                  <FileEdit className="h-5 w-5" />
                  Wall Writing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-800">
                  Try writing essays or taking notes on paper attached to the wall. This unusual position can help break negative associations with writing and make the process more engaging and less emotionally charged.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <ArrowUp className="h-5 w-5" />
                Movement Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800">
                This technique is particularly helpful for kinesthetic learners who need to move while learning. Walking around and looking up at wall-mounted materials allows for natural movement while maintaining optimal visual access for learning.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-blue-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start by simply placing one learning material on the wall and notice how different it feels to interact with it while looking up. Gradually expand this approach to more of your learning activities.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};