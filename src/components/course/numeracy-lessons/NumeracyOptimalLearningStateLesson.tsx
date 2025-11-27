import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TreePine, Wind } from 'lucide-react';

export function NumeracyOptimalLearningStateLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The Optimal Learning State
            </h1>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Module 2: The Optimal Learning State
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Okay before we get started, first things first, if you've done the Empowering Learning Spelling programme, you'll know that we need to get into the optimal learning state. For me personally I prefer the Big Strong Tree and the Box Breathing. They worked really really for me, but for you, you may have found a different way to do it. So if you haven't done it yet, jump into the Optimal Learning State course and you will learn a few different techniques that will help you to get yourself into the best position to be able to learn. Right, go give it a go and when you're ready let's jump into the next module. That's so simple!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-green-400 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <TreePine className="mr-2 h-6 w-6 text-green-600" />
                  Big Strong Tree Technique
                </h3>
                <p className="text-gray-700">
                  Visualize yourself as a strong, rooted tree. Feel your feet grounded and your mind clear. This technique helps establish stability and focus before learning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Wind className="mr-2 h-6 w-6 text-purple-600" />
                  Box Breathing
                </h3>
                <p className="text-gray-700">
                  Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat this pattern to calm your nervous system and prepare your mind for learning.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Important Note</h3>
            <p className="text-gray-700 leading-relaxed">
              If you haven't completed the Optimal Learning State course yet, it's highly recommended to do so first. These foundational techniques will significantly improve your ability to absorb and retain the numeracy concepts in this course.
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium">
              Take your time to find the optimal learning state technique that works best for you. Once you're ready and feeling calm and focused, proceed to the next module.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}