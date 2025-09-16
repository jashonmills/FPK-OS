import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraVariablesData: MicroLessonData = {
  id: 'algebra-variables',
  moduleTitle: 'Working with Variables',
  totalScreens: 10,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Mastering Variables and Expressions',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Now that you know what variables are, let's learn how to work with them more effectively!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>How to identify and combine like terms</li>
              <li>The distributive property and how to use it</li>
              <li>Simplifying algebraic expressions</li>
              <li>Working with coefficients and terms</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'like-terms-concept',
      type: 'concept',
      title: 'Understanding Like Terms',
      content: (
        <div className="space-y-4">
          <p><strong>Like terms</strong> are terms that have the same variable raised to the same power. They can be combined together.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold mb-2 text-green-700">✅ LIKE TERMS</h3>
              <p className="text-sm mb-2">Same variable, same power</p>
              <ul className="text-sm space-y-1">
                <li>• 3x and 7x (both have x¹)</li>
                <li>• 5y² and -2y² (both have y²)</li>
                <li>• 4 and 9 (both constants)</li>
                <li>• -2z and 8z (both have z¹)</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold mb-2 text-red-700">❌ UNLIKE TERMS</h3>
              <p className="text-sm mb-2">Different variables or powers</p>
              <ul className="text-sm space-y-1">
                <li>• 3x and 7y (different variables)</li>
                <li>• 5x and 2x² (different powers)</li>
                <li>• 4a and 9 (variable vs constant)</li>
                <li>• 2xy and 3x (different variables)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'combining-like-terms',
      type: 'concept',
      title: 'Combining Like Terms',
      content: (
        <div className="space-y-4">
          <p>To combine like terms, we add or subtract their <strong>coefficients</strong> (the numbers in front of the variables).</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📝 Step-by-Step Process:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 1: Identify like terms</p>
                <p className="text-sm text-gray-600">Look for terms with the same variable and power</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 2: Add/subtract coefficients</p>
                <p className="text-sm text-gray-600">Keep the variable part the same</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 3: Write the simplified result</p>
                <p className="text-sm text-gray-600">Combine all like terms together</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'like-terms-examples',
      type: 'example',
      title: 'Examples: Combining Like Terms',
      content: (
        <div className="space-y-4">
          <p>Let's work through some examples of combining like terms:</p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 1: 3x + 5x</h4>
              <p className="text-sm">Both terms have the variable x</p>
              <p className="text-sm">3x + 5x = (3 + 5)x = <strong>8x</strong></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 2: 7y - 2y + 4</h4>
              <p className="text-sm">7y and -2y are like terms, 4 is separate</p>
              <p className="text-sm">7y - 2y + 4 = (7 - 2)y + 4 = <strong>5y + 4</strong></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 3: 2a + 3b + 5a - b</h4>
              <p className="text-sm">Group like terms: (2a + 5a) + (3b - b)</p>
              <p className="text-sm">= 7a + 2b = <strong>7a + 2b</strong></p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'like-terms-practice',
      type: 'practice',
      title: 'Practice: Combining Like Terms',
      content: (
        <div className="space-y-4">
          <p>Try combining like terms in these expressions:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 4x + 9x</h4>
              <p className="text-sm mt-2">Both terms have x, so: 4x + 9x = <strong>13x</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 6y + 2 + 3y - 5</h4>
              <p className="text-sm mt-2">Group like terms: (6y + 3y) + (2 - 5) = <strong>9y - 3</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 5a + 2b + 7a + 4b</h4>
              <p className="text-sm mt-2">Group: (5a + 7a) + (2b + 4b) = <strong>12a + 6b</strong></p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Tip:</strong> Always look for terms with the exact same variable part!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'distributive-property-intro',
      type: 'concept',
      title: 'The Distributive Property',
      content: (
        <div className="space-y-4">
          <p>The <strong>distributive property</strong> allows us to multiply a number by a sum or difference by distributing the multiplication to each term.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📐 Distributive Property Formula</h3>
            <div className="text-center font-mono text-lg bg-white p-3 rounded">
              a(b + c) = ab + ac
            </div>
            <p className="text-sm text-center mt-2">Multiply the outside number by each term inside the parentheses</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Visual Example:</h4>
            <p className="font-mono">3(x + 4) = 3·x + 3·4 = 3x + 12</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'distributive-examples',
      type: 'example',
      title: 'Distributive Property Examples',
      content: (
        <div className="space-y-4">
          <p>Let's work through several distributive property examples:</p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 1: 5(x + 3)</h4>
              <p className="text-sm">Distribute 5 to both x and 3:</p>
              <p className="text-sm">5(x + 3) = 5·x + 5·3 = <strong>5x + 15</strong></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 2: -2(y - 4)</h4>
              <p className="text-sm">Distribute -2 to both y and -4:</p>
              <p className="text-sm">-2(y - 4) = -2·y + (-2)·(-4) = <strong>-2y + 8</strong></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example 3: 6(2a + 3b - 1)</h4>
              <p className="text-sm">Distribute 6 to all three terms:</p>
              <p className="text-sm">6(2a + 3b - 1) = 12a + 18b - 6</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'distributive-practice',
      type: 'practice',
      title: 'Practice: Distributive Property',
      content: (
        <div className="space-y-4">
          <p>Apply the distributive property to these expressions:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 4(x + 7)</h4>
              <p className="text-sm mt-2">4·x + 4·7 = <strong>4x + 28</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 3(2y - 5)</h4>
              <p className="text-sm mt-2">3·2y + 3·(-5) = <strong>6y - 15</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: -1(a + b - 2)</h4>
              <p className="text-sm mt-2">-1·a + (-1)·b + (-1)·(-2) = <strong>-a - b + 2</strong></p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Remember:</strong> Don't forget to distribute to ALL terms inside the parentheses!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'simplifying-expressions',
      type: 'example',
      title: 'Simplifying Complex Expressions',
      content: (
        <div className="space-y-4">
          <p>Now let's combine both skills: distributive property and combining like terms.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Example: 3(x + 2) + 5x - 1</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Step 1:</strong> Apply distributive property</p>
              <p>3(x + 2) + 5x - 1 = 3x + 6 + 5x - 1</p>
              <p><strong>Step 2:</strong> Group like terms</p>
              <p>= (3x + 5x) + (6 - 1)</p>
              <p><strong>Step 3:</strong> Combine like terms</p>
              <p>= 8x + 5</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">✅ Final Answer: 8x + 5</h4>
            <p className="text-sm">This expression is now in its simplest form!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Great job! You've mastered working with variables!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Like terms have the same variable raised to the same power</li>
              <li>✅ Combine like terms by adding/subtracting their coefficients</li>
              <li>✅ The distributive property: a(b + c) = ab + ac</li>
              <li>✅ Simplify expressions by using both distributive property and combining like terms</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Solving Simple Equations</h4>
            <p className="text-sm">In our next lesson, you'll learn how to solve equations by finding the value of variables using balance methods.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Create your own algebraic expressions and practice simplifying them using the skills you've learned!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface AlgebraVariablesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraVariablesMicroLesson: React.FC<AlgebraVariablesMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraVariablesData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};