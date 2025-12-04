import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Shield, Volume2 } from 'lucide-react';

export const ReadingScienceLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            Deep Dive: The Science of Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>The core principle of this module is to get into an optimal learning state by calming the nervous system. The science behind this is understanding the <strong>fight-or-flight response</strong>.</p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
              <h3 className="flex items-center gap-2 text-red-800 font-semibold mb-4">
                <Shield className="h-6 w-6" />
                The Stress Response System
              </h3>
              <div className="text-red-700 space-y-3">
                <p>When we are stressed or anxious (often the case with reading difficulties), our <strong>sympathetic nervous system</strong> is activated, releasing hormones like adrenaline and cortisol.</p>
                <p>This state is designed for survival, not for learning. The act of looking down at a book can inadvertently trigger this response.</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-4">
                <Heart className="h-6 w-6" />
                The Learning State Solution
              </h3>
              <div className="text-green-700 space-y-3">
                <p>By propping the book up and engaging in grounding techniques, you activate the <strong>parasympathetic nervous system</strong>, or the "rest and digest" state.</p>
                <p>This allows the brain to be in a receptive state for learning, making the process of decoding and comprehending text significantly easier.</p>
                <p className="font-medium">It's about building a positive, calm association with the act of reading.</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
                <Volume2 className="h-6 w-6" />
                Real-World Connection
              </h3>
              <p className="text-blue-700 mb-3">
                Think about how you feel in a calm, quiet room versus a loud, chaotic environment. In the quiet room, you can focus on a task easily. The loud environment puts your senses on high alert, making it difficult to concentrate.
              </p>
              <p className="text-blue-700 mb-0">
                The same principle applies to your internal state. By actively calming your nervous system, you are creating a "quiet room" inside your mind, allowing your brain to focus on the task of reading without the distraction of internal stress signals.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-4">
                <Brain className="h-6 w-6" />
                Learning Moment
              </h3>
              <div className="text-purple-700 space-y-3">
                <p>The key takeaway here is that <strong>your state dictates your performance</strong>. You have the power to consciously shift your mental state to one that is optimal for learning.</p>
                <p>This isn't just a trick; it's a physiological hack that puts you in control. The act of reading becomes easier and more enjoyable when you approach it from a place of calm.</p>
                <p className="font-medium">Trust your ability to create the right conditions for your brain to succeed.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};