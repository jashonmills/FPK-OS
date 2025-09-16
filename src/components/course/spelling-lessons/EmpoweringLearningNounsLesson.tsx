import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import MediaPlayerDisplay from '@/components/course/MediaPlayerDisplay';

export const EmpoweringLearningNounsLesson: React.FC = () => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {};
  const handleLoadedMetadata = () => {};
  const handleEnterFullscreen = () => {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Empowering Learning - Nouns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <MediaPlayerDisplay
                  type="video"
                  src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/empowering-mp4-spelling/Module%203%20-%20Empowering%20Learning%20-%20Nouns%20(3).mp4"
                  title="Module 3: Empowering Learning - Nouns"
                  mediaRef={mediaRef}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnterFullscreen={handleEnterFullscreen}
                />
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-gray max-w-none space-y-4">
                  <p>
                    Okay before we even get started on the technique we have to get ourselves into a nice calm state which helps us learn. It's what we call The Optimal Learning State, sounds very fancy but it's not.
                  </p>
                  
                  <p>
                    In our experience a lot of people who struggle with spelling and learning in school are very visual. So maybe you're very good at art or coming up with stories or being very creative. Well what we are gonna show you today, uses that visual memory that you have but what we have to do is learn to control that visual memory in order to help us learn.
                  </p>
                  
                  <p>
                    So, what I'm gonna say is, if you haven't, please go back to the learning state and find one of the techniques that works best for you just to help to calm yourself down. Now, for me, the easiest one is the Big Strong Tree, so pause this video and do your Big Strong Tree or whichever one of the learning state processes helps you and then come back and press play.
                  </p>
                  
                  <p>
                    Okay now you're back. Hopefully you are feeling a bit calmer and a bit more relaxed. You're breathing nice and deeply and everything is just chilled. Right, now we're in the Optimal Learning State which gives the best chance of keeping the information in and now we're ready to move on to the simple steps. Let's move onto the next module.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};