import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraSimpleEquationsData: MicroLessonData = {
  id: 'algebra-simple-equations',
  moduleTitle: 'Solving Simple Equations',
  totalScreens: 11,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Introduction to Solving Equations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Now we're ready to solve equations! This is where algebra becomes really powerful - finding unknown values.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What makes an equation different from an expression</li>
              <li>The balance method for solving equations</li>
              <li>How to solve one-step and two-step equations</li>
              <li>Checking your solutions</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'equations-vs-expressions',
      type: 'concept',
      title: 'Equations vs Expressions',
      content: (
        <div className="space-y-4">
          <p>Understanding the difference between equations and expressions is crucial for algebra success.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold mb-2 text-blue-700">📝 EXPRESSIONS</h3>
              <p className="text-sm mb-2">Mathematical phrases (no equals sign)</p>
              <ul className="text-sm space-y-1">
                <li>• 3x + 5</li>
                <li>• 2y - 7</li>
                <li>• 4(a + 3)</li>
                <li>• x² + 2x + 1</li>
              </ul>
              <p className="text-xs mt-2 text-blue-600">We simplify expressions</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold mb-2 text-green-700">⚖️ EQUATIONS</h3>
              <p className="text-sm mb-2">Mathematical sentences (has equals sign)</p>
              <ul className="text-sm space-y-1">
                <li>• 3x + 5 = 14</li>
                <li>• 2y - 7 = 1</li>
                <li>• 4(a + 3) = 20</li>
                <li>• x² + 2x + 1 = 0</li>
              </ul>
              <p className="text-xs mt-2 text-green-600">We solve equations</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'balance-method-intro',
      type: 'concept',
      title: 'The Balance Method',
      content: (
        <div className="space-y-4">
          <p>Think of an equation like a balance scale. Both sides must be equal. To keep it balanced, whatever you do to one side, you must do to the other side too.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">⚖️ The Balance Principle</h3>
            <div className="text-center space-y-2">
              <div className="font-mono text-lg bg-white p-3 rounded">
                Left Side = Right Side
              </div>
              <p className="text-sm">Whatever you do to the left, do to the right!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded">
              <h4 className="font-semibold text-green-700">✅ Allowed Operations:</h4>
              <ul className="text-sm space-y-1">
                <li>• Add same number to both sides</li>
                <li>• Subtract same number from both sides</li>
                <li>• Multiply both sides by same number</li>
                <li>• Divide both sides by same number</li>
              </ul>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <h4 className="font-semibold text-red-700">❌ Balance Breakers:</h4>
              <ul className="text-sm space-y-1">
                <li>• Adding to only one side</li>
                <li>• Multiplying only one side</li>
                <li>• Different operations on each side</li>
                <li>• Forgetting to do both sides</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'one-step-addition',
      type: 'example',
      title: 'One-Step Equations: Addition',
      content: (
        <div className="space-y-4">
          <p>Let's solve our first equation using the balance method!</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: x + 7 = 12</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Goal: Get x by itself</p>
                <p className="text-sm text-gray-600">We need to remove the +7 from the left side</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Subtract 7 from both sides</p>
                <div className="font-mono text-center mt-2">
                  <p>x + 7 - 7 = 12 - 7</p>
                  <p>x + 0 = 5</p>
                  <p><strong>x = 5</strong></p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium">Step 2: Check our answer</p>
                <div className="font-mono text-center mt-2">
                  <p>5 + 7 = 12 ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'one-step-subtraction',
      type: 'example',
      title: 'One-Step Equations: Subtraction',
      content: (
        <div className="space-y-4">
          <p>Now let's try an equation with subtraction.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: y - 4 = 9</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Goal: Get y by itself</p>
                <p className="text-sm text-gray-600">We need to remove the -4 from the left side</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Add 4 to both sides</p>
                <div className="font-mono text-center mt-2">
                  <p>y - 4 + 4 = 9 + 4</p>
                  <p>y + 0 = 13</p>
                  <p><strong>y = 13</strong></p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium">Step 2: Check our answer</p>
                <div className="font-mono text-center mt-2">
                  <p>13 - 4 = 9 ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'one-step-multiplication',
      type: 'example',
      title: 'One-Step Equations: Multiplication',
      content: (
        <div className="space-y-4">
          <p>Let's solve equations involving multiplication.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: 3x = 15</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Goal: Get x by itself</p>
                <p className="text-sm text-gray-600">We need to remove the 3 that's multiplying x</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Divide both sides by 3</p>
                <div className="font-mono text-center mt-2">
                  <p>3x ÷ 3 = 15 ÷ 3</p>
                  <p>1x = 5</p>
                  <p><strong>x = 5</strong></p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium">Step 2: Check our answer</p>
                <div className="font-mono text-center mt-2">
                  <p>3 × 5 = 15 ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'one-step-division',
      type: 'example',
      title: 'One-Step Equations: Division',
      content: (
        <div className="space-y-4">
          <p>Now let's try equations with division.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: z/4 = 6</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Goal: Get z by itself</p>
                <p className="text-sm text-gray-600">We need to remove the division by 4</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Multiply both sides by 4</p>
                <div className="font-mono text-center mt-2">
                  <p>(z/4) × 4 = 6 × 4</p>
                  <p>z = 24</p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium">Step 2: Check our answer</p>
                <div className="font-mono text-center mt-2">
                  <p>24 ÷ 4 = 6 ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'one-step-practice',
      type: 'practice',
      title: 'Practice: One-Step Equations',
      content: (
        <div className="space-y-4">
          <p>Try solving these one-step equations:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: x + 8 = 15</h4>
              <p className="text-sm mt-2">Subtract 8 from both sides: x = 15 - 8 = <strong>7</strong></p>
              <p className="text-xs">Check: 7 + 8 = 15 ✓</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 5y = 25</h4>
              <p className="text-sm mt-2">Divide both sides by 5: y = 25 ÷ 5 = <strong>5</strong></p>
              <p className="text-xs">Check: 5 × 5 = 25 ✓</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: a - 6 = 10</h4>
              <p className="text-sm mt-2">Add 6 to both sides: a = 10 + 6 = <strong>16</strong></p>
              <p className="text-xs">Check: 16 - 6 = 10 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'two-step-equations',
      type: 'example',
      title: 'Two-Step Equations',
      content: (
        <div className="space-y-4">
          <p>Some equations require two steps to solve. Let's work through the process systematically.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: 2x + 3 = 11</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Strategy: Undo operations in reverse order</p>
                <p className="text-sm text-gray-600">First undo addition/subtraction, then multiplication/division</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Subtract 3 from both sides</p>
                <div className="font-mono text-center mt-2">
                  <p>2x + 3 - 3 = 11 - 3</p>
                  <p>2x = 8</p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 2: Divide both sides by 2</p>
                <div className="font-mono text-center mt-2">
                  <p>2x ÷ 2 = 8 ÷ 2</p>
                  <p><strong>x = 4</strong></p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium">Step 3: Check our answer</p>
                <div className="font-mono text-center mt-2">
                  <p>2(4) + 3 = 8 + 3 = 11 ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'two-step-practice',
      type: 'practice',
      title: 'Practice: Two-Step Equations',
      content: (
        <div className="space-y-4">
          <p>Practice solving these two-step equations:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 3x + 5 = 14</h4>
              <div className="text-sm mt-2 space-y-1">
                <p>Step 1: 3x + 5 - 5 = 14 - 5 → 3x = 9</p>
                <p>Step 2: 3x ÷ 3 = 9 ÷ 3 → <strong>x = 3</strong></p>
                <p className="text-xs">Check: 3(3) + 5 = 9 + 5 = 14 ✓</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 4y - 7 = 5</h4>
              <div className="text-sm mt-2 space-y-1">
                <p>Step 1: 4y - 7 + 7 = 5 + 7 → 4y = 12</p>
                <p>Step 2: 4y ÷ 4 = 12 ÷ 4 → <strong>y = 3</strong></p>
                <p className="text-xs">Check: 4(3) - 7 = 12 - 7 = 5 ✓</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Remember:</strong> Always check your answer by substituting back into the original equation!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Excellent work! You can now solve simple equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Equations have equals signs; expressions don't</li>
              <li>✅ Use the balance method: do the same to both sides</li>
              <li>✅ For one-step equations: use one inverse operation</li>
              <li>✅ For two-step equations: undo operations in reverse order</li>
              <li>✅ Always check your answer by substituting back</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Linear Equations and Graphing</h4>
            <p className="text-sm">In our next lesson, you'll learn about linear equations in two variables and how to graph them on coordinate planes.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Create word problems that lead to simple equations and practice solving them step by step!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface InteractionDetails {
  lessonId?: string;
  action?: string;
  element?: string;
  value?: string | number;
  timestamp?: number;
  [key: string]: unknown;
}

interface AlgebraSimpleEquationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const AlgebraSimpleEquationsMicroLesson: React.FC<AlgebraSimpleEquationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraSimpleEquationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};