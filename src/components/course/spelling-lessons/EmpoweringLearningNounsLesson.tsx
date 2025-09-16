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
                <div className="relative">
                  <video
                    ref={mediaRef}
                    src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/empowering-mp4-spelling/Module%203%20-%20Empowering%20Learning%20-%20Nouns%20(3).mp4"
                    className="w-full h-auto"
                    controls
                    preload="metadata"
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  >
                    <p>Your browser does not support the video tag. Please use a modern browser to view this content.</p>
                  </video>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-primary">Empowering Learning</h3>
                  <h4 className="text-xl font-semibold text-center">STEP BY STEP</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>1.</strong> Grounding - use the tree or another technique from the Learning State programme.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>2.</strong> Ask person to visualise their dog.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>3.</strong> Check if the picture is still or moving.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>4.</strong> If it is moving stop it by using the dog or traffic lights</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>5.</strong> Ask your partner to visualise the item you want them to spell.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>6.</strong> Write the word on a Post-it.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>7.</strong> Hold the post it where they can see it best.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>8.</strong> Ask 'Can you see the letters?'</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>9.</strong> When they can, ask what colours the letters are.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>10.</strong> Ask them to spell the word.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>11.</strong> Then ask them to change the colour of the letters.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>12.</strong> Ask them to spell the word in reverse.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>13.</strong> Use the swan to find their Whiteboard.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>14.</strong> Write the word on a Post-it.</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p><strong>15.</strong> Repeat steps 6-11.</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p><strong>16.</strong> Practice for 10 minutes EVERY day for 28 days.</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p><strong>17.</strong> REMEMBER - it should be fun so be creative with words.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};