import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowUp, Brain, Target } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const RaisingBookScreenLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module-9-Learning%20State/Module%209%20-%20Raising%20Up%20Book_Screen.mp4"
        type="video"
        title="Raising Up Book/Screen Technique"
        mediaId="raising-book-video"
        courseId="optimal-learning-state"
        moduleId="10"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Techniques for Enhancing Your Child's Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Once you have practised and found which techniques work best for your child. Here are some simple, but highly important elements to remember and incorporate into working on increasing your child's knowledge in any given subject.</p>
          </div>
          
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                <ArrowUp className="h-5 w-5" />
                Raising up of book/screen:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <p>
                  Traditionally, when we are doing work/homework, we sit with the book/tablet lying on a table and we look down at it. When we look down, this takes us into our emotions and internal dialogue and if we have a negative emotion attached to learning or our ability to do work, this negative emotion will likely come to the surface.
                </p>
                
                <p>
                  By simply propping up the book or tablet can help us lift our heads, that way we are looking straight ahead, or even better looking up, and not going into our emotions which can help build our confidence to do the work in front of us.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-900">
                  <Target className="h-5 w-5" />
                  Traditional Position (Avoid)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-red-700">
                  <p>• Book/tablet flat on table</p>
                  <p>• Looking down while working</p>
                  <p>• Triggers emotional responses</p>
                  <p>• Can increase negative associations</p>
                  <p>• May lower confidence</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                  <ArrowUp className="h-5 w-5" />
                  Optimal Position (Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-green-700">
                  <p>• Book/tablet propped up or elevated</p>
                  <p>• Looking straight ahead or slightly up</p>
                  <p>• Avoids emotional triggers</p>
                  <p>• Builds confidence</p>
                  <p>• Improves learning readiness</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                Implementation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p>• Use a book stand, tablet holder, or stack of books to prop up materials</p>
                <p>• Adjust the angle so eyes look straight ahead or slightly upward</p>
                <p>• Maintain good posture while keeping materials elevated</p>
                <p>• Notice the difference in how confident you feel when materials are raised</p>
                <p>• Practice this technique consistently for all learning activities</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};