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
                <p className="text-muted-foreground">
                  This lesson introduces the foundational concepts of nouns and how to apply empowering learning techniques to master their spelling. Follow along with the video to understand the visual memory techniques that will help you remember noun spellings more effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};