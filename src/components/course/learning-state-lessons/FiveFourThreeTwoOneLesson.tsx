import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Focus, Eye, Hand, Ear, Coffee, Zap } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const FiveFourThreeTwoOneLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module-4-Learning%20State/Module%204%20-%205,%204,%203,%202,%201%20Grounding.mp4"
        type="video"
        title="5, 4, 3, 2, 1 Grounding Technique"
        mediaId="five-four-three-video"
        courseId="optimal-learning-state"
        moduleId="5"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Focus className="h-6 w-6 text-primary" />
            Grounding: The 5, 4, 3, 2, 1 Technique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>The 5, 4, 3, 2, 1 technique is a simple way of getting yourself grounded and ready to learn. Follow the steps below to help you focus and get present.</p>
          </div>
          
          <div className="grid gap-4 mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">5</div>
                  <Eye className="h-6 w-6 text-blue-600" />
                  <div className="text-blue-800 font-medium">Say 5 things that you can see.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">4</div>
                  <Hand className="h-6 w-6 text-green-600" />
                  <div className="text-green-800 font-medium">Say 4 things you can touch.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold">3</div>
                  <Ear className="h-6 w-6 text-purple-600" />
                  <div className="text-purple-800 font-medium">Say 3 things you can hear.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2</div>
                  <Coffee className="h-6 w-6 text-orange-600" />
                  <div className="text-orange-800 font-medium">Say 2 things you can smell.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold">1</div>
                  <Zap className="h-6 w-6 text-red-600" />
                  <div className="text-red-800 font-medium">Say 1 thing you can taste.</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Focus className="h-5 w-5 text-blue-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This grounding technique uses your five senses to bring you into the present moment. It's particularly helpful when you feel anxious, overwhelmed, or need to focus before learning or working.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};