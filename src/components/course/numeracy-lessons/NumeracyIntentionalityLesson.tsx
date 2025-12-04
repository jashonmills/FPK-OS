import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Brain, Zap, Users } from 'lucide-react';

export function NumeracyIntentionalityLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The Power of Intentionality in Numeracy
            </h1>
            <p className="text-xl text-gray-600">Deep Dive Module 1</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-3 h-8 w-8 text-blue-600" />
              Module 1 Deep Dive: The Power of Intentionality in Numeracy
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                The introduction to our main course, while brief, hints at a powerful idea: intentionality. This is the conscious practice of setting aside a few minutes every day to focus on a new skill. It's not about the quantity of time, but the quality of focus. The brain, particularly for a young person, learns best when it is given clear, consistent, and short bursts of focused attention. This intentionality builds a habit, and habits are the foundation of long-term improvement. The science behind this is neuroplasticity—the brain's ability to reorganize itself by forming new neural connections. Your daily practice, no matter how brief, is what strengthens these pathways over time, leading to significant and lasting improvement.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 h-6 w-6 text-green-600" />
              Real-World Connection
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Think about a professional athlete. They don't just "show up" and play. They spend focused, intentional time on specific drills—practicing a free throw, a specific footwork pattern, or a passing technique. The consistency of this deliberate practice, even for a few minutes a day, is what allows them to perform flawlessly under pressure. That same intentionality is what you're building with your numeracy practice. You're training your brain to see numbers not as a source of stress, but as a series of patterns it can master with focused effort.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="mr-2 h-6 w-6 text-purple-600" />
              The Science of Neuroplasticity
            </h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>Neuroplasticity:</strong> The brain's ability to reorganize itself by forming new neural connections</p>
              <p><strong>Quality over Quantity:</strong> Short, focused sessions are more effective than long, unfocused ones</p>
              <p><strong>Consistent Practice:</strong> Daily practice strengthens neural pathways over time</p>
              <p><strong>Habit Formation:</strong> Regular practice builds automatic responses and confidence</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="mr-2 h-6 w-6 text-yellow-600" />
              Learning Moment
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Remember that every small step is a building block. You're not just practicing numeracy for five minutes; you're actively strengthening your brain's ability to focus and learn. Be proud of the habit you are building, because it is the single most important factor in your long-term success. What new skill will you apply this intentionality to next?
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Takeaway</h3>
            <p className="text-gray-700 font-medium">
              Intentional, focused practice for just a few minutes daily builds lasting neural pathways and creates the foundation for mathematical confidence and success.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}