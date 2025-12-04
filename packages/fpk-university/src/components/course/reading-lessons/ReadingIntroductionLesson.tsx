import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, BookOpen } from 'lucide-react';

export const ReadingIntroductionLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <PlayCircle className="h-6 w-6 text-primary" />
            Introduction to Empowering Learning for Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder for video - will be added when provided */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="text-center space-y-2">
                <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Video will be added here</p>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-lg font-medium">A New Perspective on Learning</p>
              
              <p>Okay, here's your brief, short introduction to Empowering Learning Reading programme. This one is so simple, so straightforward, that you'll be amazed at how easy it works.</p>
              
              <p>Right, that's our introduction, jump straight into the next one.</p>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-6">
                <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                  <BookOpen className="h-5 w-5" />
                  Key Takeaway
                </h3>
                <p className="text-blue-700 mb-0">
                  Reading is a fundamental skill that empowers individuals to access information, engage with the world, and express themselves. This simple, straightforward programme will show you how easy effective reading can be.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};