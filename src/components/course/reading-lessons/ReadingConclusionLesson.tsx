import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Heart, Moon, ExternalLink } from 'lucide-react';

export const ReadingConclusionLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            Celebrating Your Reading Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-lg font-medium">Another congratulations, you've finished another course, the Empowering Learning Reading. I hope you found it useful. I hope you're having fun practising it.</p>
              
              <p>I hope that we're taking the pressure off everybody through this process, including yourself as a parent or educator, or a young person if you're watching this yourself.</p>
              
              <p>Take your time and start to learn and enjoy reading for the things that it brings, calmness.</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
                <Moon className="h-6 w-6" />
                Bedtime Reading Tips
              </h3>
              <div className="text-blue-700 space-y-3">
                <p>Bedtime is a good one, just that unwind. Instead of flashing cartoons or flashing games, which your child might really want to do, even just set aside 5 minutes for reading time, can help to start to still the mind and help with the wind down to get to sleep.</p>
                <p className="font-medium">So give it a go and if you want to learn more check out Olive Hickmott, and she will absolutely give you all the information you need.</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-3">
                <Heart className="h-5 w-5" />
                Key Benefits of This Approach
              </h3>
              <ul className="text-green-700 space-y-2 mb-0">
                <li>• Reduces pressure on both children and adults</li>
                <li>• Creates positive associations with reading</li>
                <li>• Promotes calmness and relaxation</li>
                <li>• Helps with bedtime wind-down routines</li>
                <li>• Builds a foundation for lifelong learning</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-3">
                <ExternalLink className="h-5 w-5" />
                Continue Your Learning Journey
              </h3>
              <p className="text-purple-700 mb-0">
                Right, that's the end of this one, you're onto the next one. Look after yourselves!
              </p>
            </div>

            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                Congratulations on completing the foundational reading course!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};