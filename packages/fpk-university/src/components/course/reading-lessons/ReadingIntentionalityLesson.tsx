import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Lightbulb, Users } from 'lucide-react';

export const ReadingIntentionalityLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            Deep Dive: The Power of Intentionality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>The introduction to our main course, while brief, hints at a powerful idea: <strong>intentionality</strong>. This is the conscious practice of setting aside a few minutes every day to focus on a new skill.</p>
              
              <p>It's not about the quantity of time, but the quality of focus. The brain, particularly for a young person, learns best when it is given clear, consistent, and short bursts of focused attention.</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
                <Brain className="h-6 w-6" />
                The Science: Neuroplasticity
              </h3>
              <p className="text-blue-700 mb-3">
                This intentionality builds a habit, and habits are the foundation of long-term improvement. The science behind this is <strong>neuroplasticity</strong>—the brain's ability to reorganize itself by forming new neural connections.
              </p>
              <p className="text-blue-700 mb-0">
                Your daily practice, no matter how brief, is what strengthens these pathways over time, leading to significant and lasting improvement.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-4">
                <Users className="h-6 w-6" />
                Real-World Connection
              </h3>
              <p className="text-green-700 mb-3">
                Think about a professional athlete. They don't just "show up" and play. They spend focused, intentional time on specific drills—practicing a free throw, a specific footwork pattern, or a passing technique.
              </p>
              <p className="text-green-700 mb-0">
                The consistency of this deliberate practice, even for a few minutes a day, is what allows them to perform flawlessly under pressure. That same intentionality is what you're building with your reading practice.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-4">
                <Lightbulb className="h-6 w-6" />
                Learning Moment
              </h3>
              <div className="text-purple-700 space-y-3">
                <p>Remember that every small step is a building block. You're not just reading for five minutes; you're actively strengthening your brain's ability to focus and learn.</p>
                <p>Be proud of the habit you are building, because it is the single most important factor in your long-term success.</p>
                <p className="font-medium">What new skill will you apply this intentionality to next?</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};