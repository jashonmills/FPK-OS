import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Anchor, ArrowDown } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const BigStrongTreeLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module-2-Learning%20State/Module%202%20-%20Planting%20(Grounding).mp4"
        type="video"
        title="Big Strong Tree - Planting (Grounding)"
        mediaId="big-strong-tree-video"
        courseId="optimal-learning-state"
        moduleId="3"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TreePine className="h-6 w-6 text-primary" />
            Planting (Grounding): Big Strong Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Stand up (sitting also works if you cannot stand) and follow the instructions below.</p>
            
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              Big Strong Tree:
            </h2>
          </div>
          
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <ol className="space-y-4 text-green-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div>You will know if you are feeling grounded or not. If you are not grounded, you will likely be very wobbly or slightly unsteady on your feet.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div>Breathing in and out through your nose, close your eyes and slow your breathing down.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div>Picture yourself as a big strong tree, the biggest, strongest tree in the forest.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <div>You're so strong, nothing can knock you over.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                  <div className="flex items-center gap-2">
                    Now picture the roots of the tree coming out of your feet and going into the ground, spreading really far and wide, connecting you even more to the ground and making you even more solid.
                    <ArrowDown className="h-4 w-4 text-green-600" />
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">6</span>
                  <div>Picture all the stress and worry in your body leaving through the roots and disappearing into the ground.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">7</span>
                  <div>Now picture all the strength and positive energy you need coming in through the roots and filling your body with power.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">8</span>
                  <div>Now notice your breath and see how much more solid you are.</div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Anchor className="h-5 w-5 text-blue-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Big Strong Tree technique helps you feel grounded and stable. Practice this technique whenever you feel wobbly, anxious, or need to center yourself before learning or any challenging activity.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};