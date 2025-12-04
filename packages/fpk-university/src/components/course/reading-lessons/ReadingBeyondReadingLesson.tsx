import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Infinity, Smartphone, Bath, Target } from 'lucide-react';

export const ReadingBeyondReadingLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Infinity className="h-6 w-6 text-primary" />
            Deep Dive: Beyond Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>The conclusion of our foundational course hints at the ultimate goal: using these principles to promote a love of reading and a calm mind. Reading, in this context, becomes a gateway to a relaxed and focused state, which is particularly useful for winding down before sleep.</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-4">
                <Target className="h-6 w-6" />
                Building Positive Associations
              </h3>
              <div className="text-green-700 space-y-3">
                <p>This is about building a positive association with books that will last a lifetime. The contrast between reading and "flashing games" isn't a judgment; it's a recognition of how different activities affect the nervous system.</p>
                <p>By consciously choosing to engage with a book, even for a few minutes, you are training your brain to seek calm and focus.</p>
                <p className="font-medium">This practice transforms reading from a potential source of stress into a powerful tool for mindfulness and personal well-being.</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
                <Smartphone className="h-6 w-6" />
                Real-World Connection
              </h3>
              <div className="text-blue-700 space-y-3">
                <p>Think about a phone or a tablet. The constant stream of notifications, bright lights, and fast-paced content keeps your brain in a state of high alert.</p>
                <p>Reading, by contrast, is a low-stimulus activity that allows the brain to process information at its own pace. It's the cognitive equivalent of a warm bath.</p>
                <p>By replacing a few minutes of screen time with a few minutes of reading, you are not just winding down; you are giving your nervous system a much-needed break and building a healthy habit that will benefit your sleep, concentration, and emotional well-being.</p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-4">
                <Bath className="h-6 w-6" />
                The Cognitive Warm Bath
              </h3>
              <p className="text-purple-700 mb-0">
                Reading provides a gentle, soothing experience for the mind—like a warm bath for your cognitive processes. It allows your brain to slow down, process information naturally, and find peace in the quiet rhythm of words and ideas.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="flex items-center gap-2 text-yellow-800 font-semibold mb-4">
                <Infinity className="h-6 w-6" />
                Learning Moment: The Ultimate Meta-Skill
              </h3>
              <div className="text-yellow-700 space-y-3">
                <p>The key takeaway here is that you are not just learning a skill; you are <strong>learning how to learn</strong>. This framework of mindset, state control, and deliberate practice is the ultimate meta-skill.</p>
                <p>You've completed a powerful course on reading, but you've also gained a universal tool that can be applied to any challenge, from academic subjects to creative pursuits and beyond.</p>
                <p className="font-medium">This is your personal blueprint for success. What new skill will you master next?</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};