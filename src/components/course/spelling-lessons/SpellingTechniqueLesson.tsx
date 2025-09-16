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
            The Spelling Technique - Step by Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <h4 className="text-xl font-semibold mb-4">Empowering Learning: Step by Step</h4>
            </div>
            
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold">Grounding</h5>
                      <p className="text-muted-foreground">Use the tree or another technique from the Learning State programme.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold">Visualization Check</h5>
                      <p className="text-muted-foreground">Ask person to visualise their dog. Check if the picture is still or moving.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold">Stop Moving Images</h5>
                      <p className="text-muted-foreground">If it is moving stop it by using the dog or traffic lights.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                      4-7
                    </div>
                    <div>
                      <h5 className="font-semibold">Word Visualization</h5>
                      <p className="text-muted-foreplace">Ask your partner to visualise the item you want them to spell. Write the word on a Post-it. Hold the post it where they can see it best. Ask "Can you see the letters?"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                      8-12
                    </div>
                    <div>
                      <h5 className="font-semibold">Interactive Practice</h5>
                      <p className="text-muted-foreground">When they can see the letters, ask what colours they are. Ask them to spell the word. Ask them to change the colour of the letters. Ask them to spell the word in reverse.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      13-15
                    </div>
                    <div>
                      <h5 className="font-semibold">The Whiteboard Technique</h5>
                      <p className="text-muted-foreground">Use the swan to find their Whiteboard. Write the word on a Post-it. Repeat steps 6-11.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                      16-17
                    </div>
                    <div>
                      <h5 className="font-semibold">Daily Practice</h5>
                      <p className="text-muted-foreground">Practice for 10 minutes EVERY day for 28 days. REMEMBER: it should be fun so be creative with words.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  Key Reminder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The technique works by using your natural visual memory. Keep it fun and creative - this is the key to success!
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};