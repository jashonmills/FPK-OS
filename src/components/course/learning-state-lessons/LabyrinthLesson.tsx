import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, Brain, Target } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';
import labyrinthImage from '@/assets/labyrinth-image.jpg';

export const LabyrinthLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%205%20-%20Labyrinth.mp4"
        type="video"
        title="Labyrinths for Learning Focus"
        mediaId="labyrinth-video"
        courseId="empowering-learning-state"
        moduleId="6"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Navigation className="h-6 w-6 text-primary" />
            Labyrinths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Before we start working, doing labyrinths can help to get us focused, grab a pencil or colour (or just use your finger to trace around the labyrinth) until you arrive at the centre point. Then trace the route back again. After you have done this, then you can start your work. Labyrinths help with lots of right/left brain integration.</p>
          </div>
          
          <Card className="mt-6 bg-indigo-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-indigo-900">
                <Target className="h-5 w-5" />
                Practice Labyrinth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <img 
                  src={labyrinthImage} 
                  alt="Practice Labyrinth for tracing" 
                  className="mx-auto max-w-full h-auto rounded-lg shadow-md"
                />
                <p className="text-indigo-700 text-sm">
                  Use your finger, a pencil, or colored pen to trace from the entrance to the center, then back out again.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p>• <strong>Brain Integration:</strong> Helps connect left and right brain hemispheres</p>
                <p>• <strong>Focus Enhancement:</strong> Calms the mind and improves concentration</p>
                <p>• <strong>Stress Reduction:</strong> Meditative tracing reduces anxiety</p>
                <p>• <strong>Preparation:</strong> Gets you ready for learning and work</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};