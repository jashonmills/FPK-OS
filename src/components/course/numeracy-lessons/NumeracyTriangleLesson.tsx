import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Triangle, Network, ChefHat, Puzzle } from 'lucide-react';

export function NumeracyTriangleLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              The Number Triangle Technique
            </h1>
            <p className="text-xl text-gray-600">Deep Dive Module 4</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Triangle className="mr-3 h-8 w-8 text-blue-600" />
              Module 4 Deep Dive: The Number Triangle Technique
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                The Number Triangle is a powerful visual tool that connects the four basic operations of arithmetic. It's a prime example of relational learning, where you learn by understanding the relationships between concepts, not just the concepts in isolation. By seeing that $5+3=8$ is directly linked to $8-3=5$, you're building a mental model of how addition and subtraction are inverses. The same applies to multiplication and division. This method bypasses rote memorization of multiplication tables and instead builds a robust, interconnected web of number facts in your brain. This makes it easier to solve problems on the fly because you're not just recalling a fact; you're navigating a network of related concepts. It's about building a deeper, more flexible understanding of numbers.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ChefHat className="mr-2 h-6 w-6 text-green-600" />
              Real-World Connection: The Recipe Analogy
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Think of a recipe. You don't just memorize the steps; you understand how the ingredients relate to each other. You know that if you have flour and water, you can make dough. You also know that if you have dough, you can break it back down into flour and water. The number triangle is the same thing. You're learning the "recipe" for numbers, understanding how they combine and break apart. This relational understanding is far more useful than simply memorizing the facts in isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Network className="mr-2 h-6 w-6 text-purple-600" />
                  Relational Learning
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p>• Understands relationships between concepts</p>
                  <p>• Builds interconnected knowledge web</p>
                  <p>• Shows inverse operations clearly</p>
                  <p>• Creates flexible thinking patterns</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-400 bg-orange-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Puzzle className="mr-2 h-6 w-6 text-orange-600" />
                  Mental Model Building
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p>• 5 + 3 = 8 connects to 8 - 3 = 5</p>
                  <p>• Addition and subtraction as inverses</p>
                  <p>• Multiplication and division relationships</p>
                  <p>• Robust number fact network</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Moment</h3>
            <p className="text-gray-700 leading-relaxed">
              The key takeaway here is that understanding relationships makes you a more flexible thinker. By using the number triangle, you're not just memorizing math facts; you're building a robust mental model of how numbers work. This skill will serve you not just in math class but in any situation that requires logical, relational thinking. Trust in your ability to see the connections, and you'll become a more capable problem-solver.
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Beyond Mathematics</h3>
            <p className="text-gray-700 font-medium">
              The relational thinking skills developed through the number triangle technique transfer to all areas of life, making you a more flexible and capable problem-solver in any situation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}