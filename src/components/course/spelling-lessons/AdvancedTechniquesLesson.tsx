import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Monitor, Navigation } from 'lucide-react';

export const AdvancedTechniquesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            The Swan & The Whiteboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>The advanced techniques of "The Swan" and "The Whiteboard" take your visual spelling skills to the next level by helping you find your optimal visual learning position.</p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                    <Navigation className="h-5 w-5" />
                    The Swan Technique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-700">
                    <p className="font-semibold">Purpose:</p>
                    <p>Helps you find your natural visual access point - the direction your eyes naturally move when creating mental images.</p>
                    
                    <p className="font-semibold mt-4">How it works:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Ask the person to imagine a swan</li>
                      <li>• Watch which direction their eyes move</li>
                      <li>• This reveals their visual construction area</li>
                      <li>• Use this position for spelling practice</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                    <Monitor className="h-5 w-5" />
                    The Whiteboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-green-700">
                    <p className="font-semibold">Purpose:</p>
                    <p>Creates a consistent mental "screen" where you can clearly see and manipulate spelled words.</p>
                    
                    <p className="font-semibold mt-4">How to use it:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Imagine a clean whiteboard in your visual field</li>
                      <li>• "Write" words on this mental board</li>
                      <li>• Change colors, sizes, and styles</li>
                      <li>• Erase and rewrite as needed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg text-purple-900">Combining the Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-purple-700">
                  <ol className="space-y-2">
                    <li><span className="font-semibold">1.</span> Use the Swan to find the person's visual access point</li>
                    <li><span className="font-semibold">2.</span> Place the mental Whiteboard in that optimal position</li>
                    <li><span className="font-semibold">3.</span> Practice spelling words on the Whiteboard</li>
                    <li><span className="font-semibold">4.</span> Use colors and visual effects to enhance memory</li>
                    <li><span className="font-semibold">5.</span> Test by spelling words forward and backward</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h5 className="font-semibold mb-2">Pro Tip</h5>
                  <p className="text-muted-foreground">
                    Everyone's visual access point is different. Some look up and left, others up and right. 
                    The Swan technique helps you find what works best for each individual learner.
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