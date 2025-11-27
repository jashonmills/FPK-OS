import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Triangle, Plus, Minus, X, Divide, Target } from 'lucide-react';

export function NumeracyTechniqueLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The Number Triangle Technique
            </h1>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Triangle className="mr-3 h-8 w-8 text-blue-600" />
              Module 4: The Technique
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Okay, before you dive into this, you need to have done the Empowering Learning Spelling programme. It's very quick. It's very short so if you haven't please go back and do that because that gives you the foundation that your gonna use to do the mathematics and numeracy. If you remember, we all went through picturing the nouns in our heads, the dogs, the cats, the tigers and then we moved onto the swan and we got the swan to swim away and leave the words on your brand-new whiteboard. So we're gonna use that whiteboard again.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2 h-6 w-6 text-green-600" />
              Step-by-Step Instructions
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>For Parents/Teachers:</strong> Draw a triangle and put some numbers in it, with the largest number at the top and then the numbers that add up to it that you want to focus on in the other two corners.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Plus className="mr-2 h-4 w-4 text-blue-600" />
                    Addition & Subtraction
                  </h4>
                  <p className="text-sm">
                    Add the two minus (-) signs on the sides and the plus (+) at the bottom. Hold it up to where their visual field is and ask them to place the number triangle on the whiteboard.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <X className="mr-2 h-4 w-4 text-purple-600" />
                    Multiplication & Division
                  </h4>
                  <p className="text-sm">
                    We can do the exact same thing for multiplication and division. Just replace the minus (-) and plus (+) signs with divide (÷) and multiply (x) signs and the correct numbers in place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                When they have the triangle visualized, you take the post-it note down and you ask them, <strong>"What does x+x make?"</strong> and they will be able to picture it and see that the two numbers at the bottom plus each other equals the number on the top.
              </p>
              <p>
                Then you can check subtraction: <strong>"What does x-x equal?"</strong> and they will know that the number on the top minus one of the numbers on the bottom gives you the answer of the number in the other corner.
              </p>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Important Reminders</h3>
            <div className="space-y-2 text-gray-700">
              <p>• <strong>Don't rush through this really fast</strong> - take the time and try to work with where your child is at in terms of school.</p>
              <p>• <strong>Remember it's okay for all of us to make mistakes.</strong></p>
              <p>• <strong>Practice for five minutes a day.</strong></p>
            </div>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium">
              This technique builds on the visual whiteboard method from the spelling program, creating a powerful foundation for mathematical understanding through visualization.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}