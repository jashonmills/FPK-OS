import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Heart, Shield, Music } from 'lucide-react';

export function NumeracyScienceLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The Science of Learning
            </h1>
            <p className="text-xl text-gray-600">Deep Dive Module 2</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Module 2 Deep Dive: The Science of Learning
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                The core principle of this module is to get into an optimal learning state by calming the nervous system. The science behind this is understanding the fight-or-flight response. When we are stressed or anxious, our sympathetic nervous system is activated, releasing hormones like adrenaline and cortisol. This state is designed for survival, not for learning. By engaging in grounding techniques, you activate the parasympathetic nervous system, or the "rest and digest" state. This allows the brain to be in a receptive state for learning, making the process of decoding and comprehending numbers significantly easier. It's about building a positive, calm association with the act of numeracy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-red-400 bg-red-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="mr-2 h-6 w-6 text-red-600" />
                  Fight-or-Flight State
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Sympathetic Nervous System Activated</strong></p>
                  <p>• Releases adrenaline and cortisol</p>
                  <p>• Designed for survival</p>
                  <p>• Poor state for learning</p>
                  <p>• Impairs memory and comprehension</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-400 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Heart className="mr-2 h-6 w-6 text-green-600" />
                  Rest and Digest State
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Parasympathetic Nervous System Activated</strong></p>
                  <p>• Promotes calm and relaxation</p>
                  <p>• Optimal state for learning</p>
                  <p>• Enhances memory formation</p>
                  <p>• Improves comprehension</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Music className="mr-2 h-6 w-6 text-purple-600" />
              Real-World Connection
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Think about how you feel when you're trying to solve a tough problem while listening to loud, distracting music. The music splits your attention, making it harder to concentrate. Our nervous system works in a similar way. Stress is like loud music in your brain; it takes up valuable cognitive space. By actively calming your nervous system with techniques like box breathing, you're turning down the "volume" of stress, allowing your brain to fully focus on the task of solving a numeracy problem without the distraction of internal stress signals.
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Moment</h3>
            <p className="text-gray-700 leading-relaxed">
              The key takeaway here is that your state dictates your performance. You have the power to consciously shift your mental state to one that is optimal for learning. This isn't just a trick; it's a physiological hack that puts you in control. The act of numeracy becomes easier and more enjoyable when you approach it from a place of calm. Trust your ability to create the right conditions for your brain to succeed.
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Takeaway</h3>
            <p className="text-gray-700 font-medium">
              Calming your nervous system before learning activates the optimal brain state for numeracy, making the process easier, more enjoyable, and significantly more effective.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}