import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shapes, Eye, History, Lightbulb } from 'lucide-react';

export function NumeracyNumberShapesLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Why Numbers Are Shaped The Way They Are
            </h1>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shapes className="mr-3 h-8 w-8 text-blue-600" />
              Module 3: Why Numbers Are Shaped The Way They Are
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Okay, before we delve into the actual technique, it is interesting to know why numbers are the way they are? Why is a one like a one? Why is a five like a five? Well it goes right back to ancient times where it's to do with the amount of angles that there are in the number. So on number one we had one angle. In two we had two. In number three, 1, 2, 3 and so on and so on. As you can see, I'm very good at art, but then when they got to nine, there was no more, so they had to come up with one with no angles that could be added to any number to create infinity and that's why we have infinity numbers. It's a really interesting little fact but it's a simple thing to help us try and remember that amount of angles are related to the number. So there you go, go and practise your angles, try and remember them and then we'll move onto the next module where we'll use the Empowering Learning technique to help you add, subtract, multiply and divide much easier.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-green-400 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <History className="mr-2 h-6 w-6 text-green-600" />
                  Ancient Origins
                </h3>
                <p className="text-gray-700">
                  The shapes of numbers date back to ancient times and are based on the number of angles each numeral contains. This historical connection helps us understand the logic behind numerical symbols.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="mr-2 h-6 w-6 text-purple-600" />
                  Visual Memory Aid
                </h3>
                <p className="text-gray-700">
                  Understanding the angle-to-number relationship creates a powerful visual memory aid. This helps reinforce number recognition and value association.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-yellow-600" />
              The Pattern Breakdown
            </h3>
            <div className="text-gray-700 space-y-2">
              <p><strong>1:</strong> One angle</p>
              <p><strong>2:</strong> Two angles</p>
              <p><strong>3:</strong> Three angles (1, 2, 3)</p>
              <p><strong>4-8:</strong> Continue the pattern...</p>
              <p><strong>9:</strong> No more angles available</p>
              <p><strong>0:</strong> Zero angles - can be added to any number to create infinity</p>
            </div>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Activity</h3>
            <p className="text-gray-700 leading-relaxed">
              Take some time to practice counting the angles in each number from 1-9. Try to visualize and remember this pattern - it will help reinforce your understanding of number values and make the upcoming technique even more effective.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}