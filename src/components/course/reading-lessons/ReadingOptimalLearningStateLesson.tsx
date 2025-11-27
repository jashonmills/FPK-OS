import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Lightbulb } from 'lucide-react';

export const ReadingOptimalLearningStateLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            The Optimal Learning State for Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="prose prose-gray max-w-none">
              <p>Okay, you know what's coming next don't you? Like with the Empowering Learning Spelling and Numeracy programmes, we need to get in to the optimal learning state.</p>
              
              <p>So we need to calm our nervous system down so that we give ourselves the best chance of being able to read successfully, and not have our brain going at 100 miles an hour.</p>
              
              <p>So, use your technique that works best for you or techniques cause sometimes one will work on one day but not on the next. Pick what it is you wanna do, get you and your child grounded and then we'll get ready to jump into the Empowering Learning Reading programme.</p>
              
              <p className="font-medium">That's so simple!</p>
            </div>

            <div className="grid gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                  <Heart className="h-5 w-5" />
                  Calming Techniques
                </h3>
                <ul className="text-green-700 space-y-1 mb-0">
                  <li>• Deep breathing exercises</li>
                  <li>• Gentle stretching or movement</li>
                  <li>• Mindful moments of quiet</li>
                  <li>• Progressive muscle relaxation</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                  <Lightbulb className="h-5 w-5" />
                  Why This Matters
                </h3>
                <p className="text-blue-700 mb-0">
                  When our nervous system is calm, our brain is in the optimal state for learning. This gives us the best chance of reading successfully without feeling overwhelmed or rushed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};