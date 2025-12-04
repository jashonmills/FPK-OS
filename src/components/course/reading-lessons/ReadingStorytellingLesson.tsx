import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Building2, Heart, Lightbulb } from 'lucide-react';

export const ReadingStorytellingLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            Deep Dive: The Power of Storytelling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>The technique of letting children create their own stories and pictures is more than just a creative exercise; it's a form of <strong>cognitive scaffolding</strong>.</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
                <Building2 className="h-6 w-6" />
                Understanding Cognitive Scaffolding
              </h3>
              <div className="text-blue-700 space-y-3">
                <p><strong>Scaffolding</strong> is a process where a more knowledgeable person helps a learner with a task that is just beyond their current ability.</p>
                <p>In this case, you are using the child's own imagination to build a positive association with the book. The brain remembers stories and emotions far better than abstract facts.</p>
                <p>By associating reading with positive emotions and their own creativity, you are bypassing the negative emotional state and building a powerful memory anchor for the material.</p>
              </div>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-400">
              <h3 className="flex items-center gap-2 text-pink-800 font-semibold mb-4">
                <Heart className="h-6 w-6" />
                The Pink Elephants Principle
              </h3>
              <p className="text-pink-700 mb-3">
                The pink elephants are a sign that the child's brain is engaged and connecting with the content in a personal, meaningful way.
              </p>
              <p className="text-pink-700 mb-0 font-medium">
                You are nurturing their love for reading, not their ability to decode text.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-4">
                <Palette className="h-6 w-6" />
                Real-World Connection
              </h3>
              <div className="text-green-700 space-y-3">
                <p>Consider how movies and video games teach complex information. They don't just present facts; they embed those facts within a compelling story. That narrative context makes the information memorable and enjoyable.</p>
                <p>By encouraging your child to create their own stories and pictures from a book, you are using this same powerful narrative technique.</p>
                <p className="font-medium">You're transforming a potentially difficult chore into an exciting, creative process that they own.</p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-4">
                <Lightbulb className="h-6 w-6" />
                Learning Moment
              </h3>
              <div className="text-purple-700 space-y-3">
                <p>The key takeaway here is that <strong>storytelling is a fundamental tool for learning</strong>. Your ability to create a story around a difficult task can turn it from a chore into a joy.</p>
                <p>Don't be afraid to embrace your creativity and your child's imagination. By doing so, you are building a bridge between their emotional state and the learning process, making every reading session a step toward a lifelong love of books.</p>
                <p className="font-medium">What new story will you create today?</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};