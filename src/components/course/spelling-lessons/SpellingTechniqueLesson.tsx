import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Eye, PenTool } from 'lucide-react';

export const SpellingTechniqueLesson: React.FC = () => {
  const mediaRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={mediaRef}
              src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/empowering-mp4-spelling/Module%204%20-%20Empowering%20Learning%20-%20Non-Nouns%20(2).mp4"
              className="w-full h-auto"
              controls
              preload="metadata"
            >
              <p>Your browser does not support the video tag. Please use a modern browser to view this content.</p>
            </video>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-primary" />
            Lesson 4: Spelling Non-Nouns - Step by Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-primary">Empowering Learning</h3>
            <h4 className="text-xl font-semibold text-center">STEP BY STEP</h4>
            
            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>1.</strong> Now that you've practised with nouns, it's time to move onto non-nouns.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>2.</strong> Get your partner to visualise a Swan.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>3.</strong> Write the word on a Post-it.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>4.</strong> Hold the post it where they can see it best.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>5.</strong> Ask them to visualise the swan clearly.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>6.</strong> Check if the swan image is still or moving.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>7.</strong> If it is moving, help them make it still.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>8.</strong> Ask 'Can you see the letters?'</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>9.</strong> When they can, ask what colours the letters are.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>10.</strong> Ask them to spell the word.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>11.</strong> Then ask them to change the colour of the letters.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>12.</strong> Ask them to spell the word in reverse.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>13.</strong> Once they have achieved this, get them to make the swan disappear and leave the letters on a white background.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>14.</strong> They now have their own imaginary whiteboard that they can put any word on.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>15.</strong> Ask can they still see the letters of swan.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>16.</strong> Follow steps 9 - 12.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-black"><strong>17.</strong> Now you can practise any words. Have fun!</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-black"><strong>18.</strong> Practice for 10 minutes EVERY day for 28 days.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};