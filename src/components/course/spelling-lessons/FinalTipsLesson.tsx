import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Clock, CheckCircle } from 'lucide-react';
import lesson5Content from '@/assets/lesson5-content.png';

export const FinalTipsLesson: React.FC = () => {
  const mediaRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={mediaRef}
              src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/empowering-mp4-spelling/Module%205%20-%20Conclusion%20(4).mp4"
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
            <Lightbulb className="h-6 w-6 text-primary" />
            Final Tips - Conclusion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Reference Image */}
            <div className="mb-6">
              <img 
                src={lesson5Content} 
                alt="Final Tips Content Reference" 
                className="w-full max-w-2xl mx-auto rounded-lg border shadow-sm"
              />
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-lg font-medium mb-6">Final Tips for Success with the Empowering Learning for Spelling Technique</p>
            </div>
            
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="text-muted-foreground">Write the word on the post-it note if you are unsure of spelling</p>
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
                      <p className="text-muted-foreground">Always make sure they can see the letters clearly</p>
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
                      <p className="text-muted-foreground">If they are having problems seeing the letters, encourage them to make the letters bigger</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <p className="text-muted-foreground">Always ask them to make the letters a different colour</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <div>
                      <p className="text-muted-foreground">Always ask them to spell backwards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <div>
                      <p className="text-muted-foreground">Use the whiteboard once they have mastered the post-it technique</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                      7
                    </div>
                    <div>
                      <p className="text-muted-foreground">Practice for 10 minutes EVERY day for 28 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
                      8
                    </div>
                    <div>
                      <p className="text-muted-foreground">REMEMBER: it should be fun so be creative with words</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-teal-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-sm">
                      9
                    </div>
                    <div>
                      <p className="text-muted-foreground">Good Luck!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20 mt-6">
              <CardContent className="pt-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h5 className="font-semibold mb-2">Course Complete!</h5>
                  <p className="text-muted-foreground">
                    You now have all the tools needed to master spelling through visual learning techniques.
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