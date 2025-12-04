import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { History, Eye, Lightbulb, Apple } from 'lucide-react';

export function NumeracyHistoryLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The History of Numbers
            </h1>
            <p className="text-xl text-gray-600">Deep Dive Module 3</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <History className="mr-3 h-8 w-8 text-blue-600" />
              Module 3 Deep Dive: The History of Numbers
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                The fascinating fact about numbers and angles isn't just a quirky detail; it's a powerful tool for visual memorization. The human brain is incredibly good at remembering patterns and visual information. By associating the shape of a number with a concrete visual (its angles), you are creating a strong mental anchor that makes the number and its value more memorable. This technique bypasses rote memorization and taps directly into the brain's natural ability to form visual associations. This is a form of mnemonic device, a learning strategy that helps organize and retain information. By understanding this historical context, you're not just learning a fact; you're gaining a deeper appreciation for the logic and structure behind the numbers we use every day.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Apple className="mr-2 h-6 w-6 text-green-600" />
              Real-World Connection
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Think about why logos are so effective. The Nike swoosh or the Apple logo are simple, visual cues that instantly trigger a complex set of associations in your mind. The same principle applies here. By associating the shape of a number with the number of its angles, you're giving your brain a simple, powerful "logo" for that number's value. This makes recalling the number and its properties easier and faster, turning a simple fact into a deeply embedded visual memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="mr-2 h-6 w-6 text-purple-600" />
                  Visual Memory Power
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p>• Brain excels at pattern recognition</p>
                  <p>• Visual associations create strong anchors</p>
                  <p>• Bypasses rote memorization</p>
                  <p>• Uses natural memory abilities</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-400 bg-orange-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Lightbulb className="mr-2 h-6 w-6 text-orange-600" />
                  Mnemonic Strategy
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p>• Learning strategy for organization</p>
                  <p>• Helps retain information</p>
                  <p>• Creates mental structure</p>
                  <p>• Builds logical understanding</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Moment</h3>
            <p className="text-gray-700 leading-relaxed">
              The key takeaway here is that visuals are a shortcut to memory. You've completed a powerful course on numeracy, but you've also gained a universal tool that can be applied to any challenge, from academic subjects to creative pursuits and beyond. This is your personal blueprint for success. What new skill will you master next?
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Application</h3>
            <p className="text-gray-700 font-medium">
              The visual memorization technique you've learned extends far beyond numbers - it's a powerful learning tool that can be applied to any subject or skill you want to master.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}