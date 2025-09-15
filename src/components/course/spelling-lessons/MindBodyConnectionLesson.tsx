import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Activity } from 'lucide-react';

export const MindBodyConnectionLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            The Power of the Optimal Learning State
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>Understanding the mind-body connection is crucial for effective learning. When we're in an optimal learning state, our brain is primed to absorb and retain information more effectively.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                    <Brain className="h-5 w-5" />
                    Mental State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Calm and focused</li>
                    <li>• Relaxed but alert</li>
                    <li>• Free from anxiety</li>
                    <li>• Open to learning</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                    <Heart className="h-5 w-5" />
                    Physical State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-green-700">
                    <li>• Deep, steady breathing</li>
                    <li>• Relaxed muscles</li>
                    <li>• Comfortable posture</li>
                    <li>• Balanced energy</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                  <Activity className="h-5 w-5" />
                  The Science Behind It
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-purple max-w-none">
                  <p>When we're stressed or anxious, our brain's fight-or-flight response is activated, making it harder to process and store new information. The optimal learning state activates the parasympathetic nervous system, which:</p>
                  <ul>
                    <li>Enhances memory formation</li>
                    <li>Improves focus and concentration</li>
                    <li>Increases visual processing abilities</li>
                    <li>Strengthens neural connections</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h5 className="font-semibold mb-2">Key Insight</h5>
                  <p className="text-muted-foreground">
                    Visual learners especially benefit from the optimal learning state because it enhances the brain's ability to create and manipulate mental images.
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