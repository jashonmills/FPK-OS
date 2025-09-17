import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraSystemsEquationsData: MicroLessonData = {
  id: 'algebra-systems-equations',
  moduleTitle: 'Systems of Equations',
  totalScreens: 10,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Introduction to Systems of Equations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">A system of equations is when we have two or more equations that we need to solve together to find values that satisfy all equations.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What systems of equations are and why they're useful</li>
              <li>The substitution method for solving systems</li>
              <li>The elimination method for solving systems</li>
              <li>Real-world applications of systems</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-are-systems',
      type: 'concept',
      title: 'What Are Systems of Equations?',
      content: (
        <div className="space-y-4">
          <p>A <strong>system of equations</strong> is a set of two or more equations with the same variables. We need to find values that make ALL equations true simultaneously.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📐 Example System</h3>
            <div className="font-mono text-lg bg-white p-4 rounded text-center space-y-1">
              <p>x + y = 7</p>
              <p>2x - y = 5</p>
            </div>
            <p className="text-sm text-center mt-2">We need to find x and y that satisfy BOTH equations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded">
              <h4 className="font-semibold text-green-700">Solution Methods:</h4>
              <ul className="text-sm space-y-1">
                <li>• Graphing (visual)</li>
                <li>• Substitution (algebraic)</li>
                <li>• Elimination (algebraic)</li>
              </ul>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <h4 className="font-semibold text-blue-700">Types of Solutions:</h4>
              <ul className="text-sm space-y-1">
                <li>• One solution (lines intersect)</li>
                <li>• No solution (parallel lines)</li>
                <li>• Infinite solutions (same line)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'substitution-method-intro',
      type: 'concept',
      title: 'The Substitution Method',
      content: (
        <div className="space-y-4">
          <p>The <strong>substitution method</strong> involves solving one equation for one variable, then substituting that expression into the other equation.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🔄 Substitution Steps:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 1: Solve one equation for one variable</p>
                <p className="text-sm text-gray-600">Choose the easiest equation and variable</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 2: Substitute into the other equation</p>
                <p className="text-sm text-gray-600">Replace the variable with your expression</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 3: Solve for the remaining variable</p>
                <p className="text-sm text-gray-600">You now have one equation with one variable</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 4: Find the other variable</p>
                <p className="text-sm text-gray-600">Substitute back to find the second value</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'substitution-example',
      type: 'example',
      title: 'Substitution Method Example',
      content: (
        <div className="space-y-4">
          <p>Let's solve this system using substitution:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-mono text-lg bg-white p-3 rounded text-center mb-4 space-y-1">
              <p>x + y = 7</p>
              <p>2x - y = 5</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Solve first equation for y</p>
                <p className="text-sm">x + y = 7 → y = 7 - x</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 2: Substitute into second equation</p>
                <p className="text-sm">2x - (7 - x) = 5</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 3: Solve for x</p>
                <div className="text-sm space-y-1">
                  <p>2x - 7 + x = 5</p>
                  <p>3x - 7 = 5</p>
                  <p>3x = 12</p>
                  <p><strong>x = 4</strong></p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 4: Find y</p>
                <p className="text-sm">y = 7 - x = 7 - 4 = <strong>3</strong></p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">✅ Solution: (4, 3)</h4>
            <p className="text-sm">Check: 4 + 3 = 7 ✓ and 2(4) - 3 = 8 - 3 = 5 ✓</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'elimination-method-intro',
      type: 'concept',
      title: 'The Elimination Method',
      content: (
        <div className="space-y-4">
          <p>The <strong>elimination method</strong> involves adding or subtracting equations to eliminate one variable.</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">➖➕ Elimination Steps:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 1: Align equations vertically</p>
                <p className="text-sm text-gray-600">Make sure like variables line up</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 2: Make coefficients opposites</p>
                <p className="text-sm text-gray-600">Multiply equations if needed</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 3: Add equations to eliminate</p>
                <p className="text-sm text-gray-600">One variable should cancel out</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 4: Solve for remaining variable</p>
                <p className="text-sm text-gray-600">Then substitute back to find the other</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'elimination-example',
      type: 'example',
      title: 'Elimination Method Example',
      content: (
        <div className="space-y-4">
          <p>Let's solve the same system using elimination:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-mono text-lg bg-white p-3 rounded text-center mb-4 space-y-1">
              <p>x + y = 7</p>
              <p>2x - y = 5</p>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 1: Notice y coefficients are opposites</p>
                <p className="text-sm">+y and -y will cancel when added</p>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 2: Add the equations</p>
                <div className="text-sm font-mono space-y-1 bg-white p-2 rounded">
                  <p>  x + y = 7</p>
                  <p>+ 2x - y = 5</p>
                  <p>____________</p>
                  <p>  3x + 0 = 12</p>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 3: Solve for x</p>
                <p className="text-sm">3x = 12 → <strong>x = 4</strong></p>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 4: Substitute to find y</p>
                <p className="text-sm">4 + y = 7 → <strong>y = 3</strong></p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">✅ Solution: (4, 3)</h4>
            <p className="text-sm">Same answer as substitution method!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'elimination-with-multiplication',
      type: 'example',
      title: 'Elimination with Multiplication',
      content: (
        <div className="space-y-4">
          <p>Sometimes we need to multiply equations to make coefficients opposites:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-mono text-lg bg-white p-3 rounded text-center mb-4 space-y-1">
              <p>3x + 2y = 16</p>
              <p>x + y = 6</p>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-100 p-3 rounded">
                <p className="font-medium">Step 1: Multiply second equation by -2</p>
                <div className="text-sm">
                  <p>-2(x + y = 6) → -2x - 2y = -12</p>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded">
                <p className="font-medium">Step 2: Add the equations</p>
                <div className="text-sm font-mono space-y-1 bg-white p-2 rounded">
                  <p>  3x + 2y = 16</p>
                  <p>+ -2x - 2y = -12</p>
                  <p>________________</p>
                  <p>  x + 0 = 4</p>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded">
                <p className="font-medium">Step 3: Solve</p>
                <p className="text-sm">x = 4, and substituting: y = 2</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">✅ Solution: (4, 2)</h4>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'systems-practice',
      type: 'practice',
      title: 'Practice: Solving Systems',
      content: (
        <div className="space-y-4">
          <p>Practice solving these systems using either method:</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">System 1: x + y = 5, x - y = 1</h4>
              <div className="text-sm space-y-1">
                <p><strong>Elimination:</strong> Add equations → 2x = 6 → x = 3</p>
                <p>Substitute: 3 + y = 5 → y = 2</p>
                <p><strong>Solution: (3, 2)</strong></p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">System 2: y = x + 2, 2x + y = 8</h4>
              <div className="text-sm space-y-1">
                <p><strong>Substitution:</strong> 2x + (x + 2) = 8 → 3x = 6 → x = 2</p>
                <p>y = 2 + 2 = 4</p>
                <p><strong>Solution: (2, 4)</strong></p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Tip:</strong> Use substitution when one equation is already solved for a variable. Use elimination when coefficients are easy to make opposites.</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'real-world-systems',
      type: 'example',
      title: 'Real-World Applications',
      content: (
        <div className="space-y-4">
          <p>Systems of equations help solve many real-world problems:</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🍎 Example: School Fundraiser</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Problem:</strong> The school sells apples for $1 and oranges for $2. They sold 50 pieces of fruit for $70 total. How many of each fruit did they sell?</p>
              <div className="bg-white p-3 rounded mt-2">
                <p><strong>Let:</strong> a = apples, o = oranges</p>
                <p><strong>Equations:</strong></p>
                <p>a + o = 50 (total fruit)</p>
                <p>1a + 2o = 70 (total money)</p>
                <p><strong>Solution:</strong> 30 apples, 20 oranges</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🚗 Speed Problems</h4>
              <p className="text-sm">Two cars traveling toward each other, when do they meet?</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💰 Investment Problems</h4>
              <p className="text-sm">Money invested at different interest rates, total return?</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Fantastic! You've mastered systems of equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Systems have multiple equations with same variables</li>
              <li>✅ Substitution method: solve for one variable, substitute into other equation</li>
              <li>✅ Elimination method: add/subtract equations to eliminate a variable</li>
              <li>✅ Both methods give the same solution</li>
              <li>✅ Systems solve many real-world problems involving multiple constraints</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Quadratic Equations</h4>
            <p className="text-sm">In our next lesson, you'll learn about equations with variables raised to the second power and how to solve them.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Look for real-world situations involving two unknowns that could be modeled with a system of equations!</p>
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

interface AlgebraSystemsEquationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const AlgebraSystemsEquationsMicroLesson: React.FC<AlgebraSystemsEquationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraSystemsEquationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};