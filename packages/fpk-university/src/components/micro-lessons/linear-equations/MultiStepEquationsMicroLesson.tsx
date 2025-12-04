import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const multiStepEquationsData: MicroLessonData = {
  id: 'multi-step-equations',
  moduleTitle: 'Multi-Step Equations and Distribution',
  totalScreens: 15,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Multi-Step Equations and Distribution',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Learn to solve complex equations involving the distributive property and combining like terms!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>The distributive property and how to apply it</li>
              <li>Combining like terms effectively</li>
              <li>Solving equations with parentheses</li>
              <li>Multi-step equations with distribution on both sides</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🧮</div>
            <p className="text-sm text-muted-foreground">Breaking down complex equations step by step</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'distributive-property',
      type: 'concept',
      title: 'The Distributive Property',
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-foreground leading-relaxed mb-3">
              The <strong>distributive property</strong> allows us to multiply a number by a sum or difference:
            </p>
            <div className="bg-white/60 p-3 rounded text-center space-y-2">
              <p className="font-mono text-lg">a(b + c) = ab + ac</p>
              <p className="font-mono text-lg">a(b - c) = ab - ac</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Examples:</h4>
              <ul className="space-y-1 text-sm">
                <li>3(x + 4) = 3x + 12</li>
                <li>5(2x - 1) = 10x - 5</li>
                <li>-2(x + 3) = -2x - 6</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Points:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Multiply the outside by each inside term</li>
                <li>• Keep track of positive/negative signs</li>
                <li>• Distribute before combining like terms</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example1-setup',
      type: 'example',
      title: 'Example 1 Setup: 3(x + 4) = 21',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's solve this equation with distribution:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="bg-white/60 p-3 rounded mb-4">
              <p className="text-center font-mono text-xl">3(x + 4) = 21</p>
            </div>
            <div className="space-y-3">
              <p><strong>Strategy:</strong> First, we need to distribute the 3 to both terms inside the parentheses.</p>
              <div className="bg-yellow-50 p-3 rounded">
                <p><strong>Step 1:</strong> Distribute 3 to (x + 4)</p>
                <p className="ml-4">3 × x + 3 × 4 = 3x + 12</p>
              </div>
              <p>Then we can use our SOAP method to solve the resulting equation.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'example1-solution',
      type: 'example',
      title: 'Example 1 Solution: 3(x + 4) = 21',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 3(x + 4) = 21</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Distribute the 3</p>
              <p className="font-mono ml-4">3x + 12 = 21</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Subtract 12 from both sides</p>
              <p className="font-mono ml-4">3x + 12 - 12 = 21 - 12</p>
              <p className="font-mono ml-4">3x = 9</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3:</strong> Divide by 3</p>
              <p className="font-mono ml-4">x = 3</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 3(3 + 4) = 3(7) = 21 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example2-complex',
      type: 'example',
      title: 'Example 2: 2(x - 3) + 5 = 11',
      content: (
        <div className="space-y-4">
          <p className="font-medium">More complex distribution with additional terms:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 2(x - 3) + 5 = 11</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Distribute the 2</p>
              <p className="font-mono ml-4">2x - 6 + 5 = 11</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Combine like terms (-6 + 5)</p>
              <p className="font-mono ml-4">2x - 1 = 11</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3:</strong> Add 1 to both sides</p>
              <p className="font-mono ml-4">2x = 12</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 4:</strong> Divide by 2</p>
              <p className="font-mono ml-4">x = 6</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 2(6 - 3) + 5 = 2(3) + 5 = 11 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'like-terms-concept',
      type: 'concept',
      title: 'Combining Like Terms',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">What are Like Terms?</h3>
            <p className="mb-3"><strong>Like terms</strong> have the same variable with the same power:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="bg-green-100 p-2 rounded">
                  <p className="text-sm"><strong>Like Terms:</strong></p>
                  <ul className="text-xs space-y-1">
                    <li>3x and 5x</li>
                    <li>7 and -2 (constants)</li>
                    <li>4y and -y</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-red-100 p-2 rounded">
                  <p className="text-sm"><strong>NOT Like Terms:</strong></p>
                  <ul className="text-xs space-y-1">
                    <li>4x and 4y</li>
                    <li>x² and x</li>
                    <li>3xy and 3x</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How to Combine:</h4>
            <ul className="text-sm space-y-1">
              <li>• Add or subtract the coefficients</li>
              <li>• Keep the variable part the same</li>
              <li>• Example: 3x + 5x = 8x</li>
              <li>• Example: 7 - 2 = 5 (for constants)</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'both-sides-distribution',
      type: 'example',
      title: 'Example 3: 3(x + 2) = 2(x + 5)',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Distribution on both sides of the equation:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 3(x + 2) = 2(x + 5)</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Distribute on both sides</p>
              <p className="font-mono ml-4">3x + 6 = 2x + 10</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Subtract 2x from both sides</p>
              <p className="font-mono ml-4">3x - 2x + 6 = 2x - 2x + 10</p>
              <p className="font-mono ml-4">x + 6 = 10</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3:</strong> Subtract 6 from both sides</p>
              <p className="font-mono ml-4">x = 4</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 3(4 + 2) = 18, and 2(4 + 5) = 18 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'negative-distribution',
      type: 'concept',
      title: 'Distributing Negative Numbers',
      content: (
        <div className="space-y-4">
          <p>Special care is needed when distributing negative numbers:</p>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-700 mb-2">Important Rule:</h4>
            <p className="mb-3">When distributing a negative number, it changes the sign of every term inside the parentheses.</p>
            <div className="space-y-2">
              <p className="font-mono">-2(x + 3) = -2x - 6</p>
              <p className="font-mono">-3(2x - 4) = -6x + 12</p>
              <p className="font-mono">-(x - 5) = -x + 5</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Memory Tip</h4>
            <p className="text-sm">"Negative times positive equals negative, negative times negative equals positive"</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practice-distribution',
      type: 'practice',
      title: 'Practice: Distribution Problems',
      content: (
        <div className="space-y-4">
          <p>Practice distributing and solving these equations:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 4(x - 2) = 12</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 5</p>
              <p className="text-xs text-gray-500">Steps: 4x - 8 = 12 → 4x = 20 → x = 5</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: -2(x + 3) = -10</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 2</p>
              <p className="text-xs text-gray-500">Steps: -2x - 6 = -10 → -2x = -4 → x = 2</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 3(x + 1) = 2(x - 4)</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = -11</p>
              <p className="text-xs text-gray-500">Steps: 3x + 3 = 2x - 8 → x = -11</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'complex-combining',
      type: 'concept',
      title: 'Complex Like Term Combining',
      content: (
        <div className="space-y-4">
          <p>Sometimes you'll need to combine multiple like terms on the same side:</p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Example: 2x + 3x - 5x + 7 = 22</h3>
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 1:</strong> Identify like terms</p>
                <p className="ml-4">x terms: 2x, 3x, -5x</p>
                <p className="ml-4">Constants: 7</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 2:</strong> Combine like terms</p>
                <p className="ml-4">2x + 3x - 5x = 0x = 0</p>
                <p className="ml-4">So: 0 + 7 = 22</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Result:</strong> 7 = 22 (This is impossible!)</p>
                <p className="text-sm text-red-600">This equation has no solution.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'solving-strategy',
      type: 'concept',
      title: 'Strategy for Multi-Step Equations',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🎯 Complete Strategy</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li><strong>Distribute</strong> any parentheses first</li>
              <li><strong>Combine like terms</strong> on each side separately</li>
              <li><strong>Move variables</strong> to one side using addition/subtraction</li>
              <li><strong>Move constants</strong> to the other side using addition/subtraction</li>
              <li><strong>Isolate the variable</strong> using multiplication/division</li>
              <li><strong>Check your answer</strong> in the original equation!</li>
            </ol>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">✅ Success Checklist</h4>
            <ul className="text-sm space-y-1">
              <li>□ Did I distribute correctly?</li>
              <li>□ Did I combine all like terms?</li>
              <li>□ Did I do the same operation to both sides?</li>
              <li>□ Does my check work?</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'challenge-problem',
      type: 'practice',
      title: 'Challenge Problem',
      content: (
        <div className="space-y-4">
          <p>Test your skills with this complex equation:</p>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">2(3x - 4) + 5x = 3(x + 2) - 1</h3>
            <div className="space-y-3 mt-4">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 1:</strong> Distribute both sides</p>
                <p className="font-mono ml-4">6x - 8 + 5x = 3x + 6 - 1</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 2:</strong> Combine like terms</p>
                <p className="font-mono ml-4">11x - 8 = 3x + 5</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 3:</strong> Move variables and constants</p>
                <p className="font-mono ml-4">11x - 3x = 5 + 8</p>
                <p className="font-mono ml-4">8x = 13</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 4:</strong> Solve for x</p>
                <p className="font-mono ml-4">x = 13/8 = 1.625</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'coming-up-next',
      type: 'concept',
      title: 'Coming Up Next',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: Graphing Linear Equations</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll explore how to graph linear equations and understand their geometric meaning!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Graphing linear equations on coordinate planes</li>
              <li>Understanding slope and y-intercept</li>
              <li>Finding x and y intercepts</li>
              <li>Visual representation of solutions</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Congratulations! You've mastered Multi-Step Equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Use distributive property: a(b + c) = ab + ac</li>
              <li>✅ Combine like terms that have the same variable and power</li>
              <li>✅ Distribute first, then combine, then solve</li>
              <li>✅ Be careful with negative signs when distributing</li>
              <li>✅ Follow the complete strategy for complex equations</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Graphing Linear Equations</h4>
            <p className="text-sm">You'll learn to visualize equations and understand their geometric meaning.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Master Challenge</h4>
            <p className="text-sm">Try solving: 4(2x - 1) - 3x = 2(x + 3) + 1. Use all your skills!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface MultiStepEquationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const MultiStepEquationsMicroLesson: React.FC<MultiStepEquationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={multiStepEquationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};