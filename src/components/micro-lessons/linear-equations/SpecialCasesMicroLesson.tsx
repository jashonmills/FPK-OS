import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const specialCasesData: MicroLessonData = {
  id: 'special-cases',
  moduleTitle: 'Special Cases: No Solution and Infinite Solutions',
  totalScreens: 13,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Special Cases in Linear Equations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Explore equations that have no solution or infinitely many solutions - they're more common than you think!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Three types of solution sets for linear equations</li>
              <li>How to identify equations with no solution</li>
              <li>When equations have infinitely many solutions</li>
              <li>What these cases mean graphically</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🤔</div>
            <p className="text-sm text-muted-foreground">Not all equations behave the same way</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'types-of-solutions',
      type: 'concept',
      title: 'Three Types of Solutions',
      content: (
        <div className="space-y-4">
          <p>Linear equations can have three different types of solution sets:</p>
          <div className="grid gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-700">✅ One Solution (Most Common)</h4>
              <p className="text-sm mb-2">The equation has exactly one value of x that makes it true</p>
              <p className="font-mono text-sm">Example: 2x + 3 = 7 → x = 2</p>
              <p className="text-xs text-gray-600">Graphically: Two different lines intersect at one point</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-medium text-red-700">❌ No Solution (Inconsistent)</h4>
              <p className="text-sm mb-2">No value of x can make the equation true</p>
              <p className="font-mono text-sm">Example: 2x + 3 = 2x + 5 → 3 = 5 (False!)</p>
              <p className="text-xs text-gray-600">Graphically: Parallel lines that never meet</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-700">∞ Infinite Solutions (Identity)</h4>
              <p className="text-sm mb-2">Every value of x makes the equation true</p>
              <p className="font-mono text-sm">Example: 2x + 3 = 2x + 3 → 3 = 3 (Always true!)</p>
              <p className="text-xs text-gray-600">Graphically: Same line (one line on top of the other)</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'no-solution-example',
      type: 'example',
      title: 'No Solution Example: 3x + 4 = 3x + 7',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's solve this equation and see what happens:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 3x + 4 = 3x + 7</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Subtract 3x from both sides</p>
              <p className="font-mono ml-4">3x - 3x + 4 = 3x - 3x + 7</p>
              <p className="font-mono ml-4">4 = 7</p>
            </div>
            <div className="bg-red-100 p-3 rounded border-l-4 border-red-400">
              <p><strong>Result:</strong> 4 = 7 is FALSE!</p>
              <p className="text-sm text-red-600 mt-2">Since this statement is never true, the equation has <strong>no solution</strong>.</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p><strong>What this means:</strong> No matter what value we substitute for x, the equation will never be true.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'infinite-solution-example',
      type: 'example',
      title: 'Infinite Solutions Example: 2(x + 3) = 2x + 6',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's solve this equation and see what happens:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 2(x + 3) = 2x + 6</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Distribute the 2</p>
              <p className="font-mono ml-4">2x + 6 = 2x + 6</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Subtract 2x from both sides</p>
              <p className="font-mono ml-4">2x - 2x + 6 = 2x - 2x + 6</p>
              <p className="font-mono ml-4">6 = 6</p>
            </div>
            <div className="bg-green-100 p-3 rounded border-l-4 border-green-400">
              <p><strong>Result:</strong> 6 = 6 is TRUE!</p>
              <p className="text-sm text-green-600 mt-2">Since this statement is always true, the equation has <strong>infinite solutions</strong>.</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p><strong>What this means:</strong> Any value we substitute for x will make both sides equal.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'recognizing-patterns',
      type: 'concept',
      title: 'Recognizing the Patterns',
      content: (
        <div className="space-y-4">
          <p>Learn to spot these special cases early in your solving process:</p>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">🚫 No Solution Pattern</h4>
              <ul className="text-sm space-y-1">
                <li>• Same variable terms on both sides with different constants</li>
                <li>• After simplifying: you get something like "5 = 8" (false statement)</li>
                <li>• The variables "cancel out" leaving false equation</li>
              </ul>
              <p className="font-mono text-sm mt-2 bg-white p-2 rounded">Example: 4x + 1 = 4x + 9</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">∞ Infinite Solutions Pattern</h4>
              <ul className="text-sm space-y-1">
                <li>• Both sides are identical after simplification</li>
                <li>• After simplifying: you get something like "7 = 7" (true statement)</li>
                <li>• The equation is an identity (always true)</li>
              </ul>
              <p className="font-mono text-sm mt-2 bg-white p-2 rounded">Example: 3(x - 2) = 3x - 6</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'graphical-meaning',
      type: 'concept',
      title: 'What Special Cases Look Like Graphically',
      content: (
        <div className="space-y-4">
          <p>Understanding what these algebraic results mean when we graph the equations:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">No Solution</h4>
              <div className="text-center mb-2">
                <div className="text-4xl">∥</div>
                <p className="text-xs">Parallel Lines</p>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Two parallel lines</li>
                <li>• Same slope, different y-intercepts</li>
                <li>• Never intersect</li>
                <li>• No common point (solution)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Infinite Solutions</h4>
              <div className="text-center mb-2">
                <div className="text-4xl">━</div>
                <p className="text-xs">Same Line</p>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Same line graphed twice</li>
                <li>• Identical slope and y-intercept</li>
                <li>• Lines coincide (overlap completely)</li>
                <li>• Every point is a solution</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2">One Solution (Normal Case)</h4>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl">✕</div>
                <p className="text-xs">Intersecting Lines</p>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Two different lines that intersect</li>
                <li>• Different slopes and/or y-intercepts</li>
                <li>• Meet at exactly one point</li>
                <li>• That point is the solution</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'practice-problems',
      type: 'practice',
      title: 'Practice: Identifying Special Cases',
      content: (
        <div className="space-y-4">
          <p>Solve these equations and identify the type of solution:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 5x - 2 = 5x + 4</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> No solution</p>
              <p className="text-xs text-gray-500">Simplifies to: -2 = 4 (False)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 3(x + 1) = 3x + 3</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> Infinite solutions</p>
              <p className="text-xs text-gray-500">Simplifies to: 3x + 3 = 3x + 3 (Identity)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 2x + 5 = x + 8</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> One solution: x = 3</p>
              <p className="text-xs text-gray-500">Normal case with unique solution</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'real-world-meaning',
      type: 'concept',
      title: 'Real-World Meaning of Special Cases',
      content: (
        <div className="space-y-4">
          <p>What do these mathematical concepts mean in real-world problems?</p>
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700">No Solution Examples:</h4>
              <ul className="text-sm space-y-1">
                <li>• Trying to find when two parallel roads intersect</li>
                <li>• Looking for a price where profit = loss + 10 (impossible if costs are fixed)</li>
                <li>• Finding when two objects moving at the same speed will meet if starting apart</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700">Infinite Solutions Examples:</h4>
              <ul className="text-sm space-y-1">
                <li>• Two different expressions that describe the same relationship</li>
                <li>• Equivalent formulas (like temperature conversion written two ways)</li>
                <li>• When all values satisfy a condition (like "any positive number")</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Problem-Solving Insight</h4>
            <p className="text-sm">Recognizing these cases helps you understand when a problem has no answer or when any answer works!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'checking-your-work',
      type: 'concept',
      title: 'How to Check Your Conclusions',
      content: (
        <div className="space-y-4">
          <p>Always verify your conclusions about special cases:</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">✅ Verification Methods:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <h4 className="font-medium">For No Solution:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Try substituting any number for x</li>
                  <li>• Both sides should give different values</li>
                  <li>• The false statement should remain false</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded">
                <h4 className="font-medium">For Infinite Solutions:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Try substituting several different numbers for x</li>
                  <li>• Both sides should always give the same value</li>
                  <li>• The true statement should remain true</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Writing Your Answer</h4>
            <ul className="text-sm space-y-1">
              <li>• No solution: "No solution" or "∅" (empty set)</li>
              <li>• Infinite solutions: "All real numbers" or "Infinite solutions"</li>
              <li>• One solution: "x = [specific number]"</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'common-mistakes',
      type: 'concept',
      title: 'Common Mistakes to Avoid',
      content: (
        <div className="space-y-4">
          <p>Learn from these frequent errors when dealing with special cases:</p>
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 1: Continuing to solve after getting 0 = 5</h4>
              <p className="text-sm">Wrong: Trying to "fix" the false statement</p>
              <p className="text-sm text-green-600">Right: Recognize it as "no solution" and stop</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 2: Thinking 3 = 3 means x = 3</h4>
              <p className="text-sm">Wrong: The true statement doesn't give a specific x value</p>
              <p className="text-sm text-green-600">Right: It means infinite solutions (any x works)</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 3: Not double-checking the algebra</h4>
              <p className="text-sm">Wrong: Making an error and missing the special case</p>
              <p className="text-sm text-green-600">Right: Carefully check each step of simplification</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'advanced-practice',
      type: 'practice',
      title: 'Advanced Practice Problems',
      content: (
        <div className="space-y-4">
          <p>Challenge yourself with these more complex special case problems:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 4(x - 2) + 3x = 7x - 8</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> Infinite solutions</p>
              <p className="text-xs text-gray-500">Simplifies to: 7x - 8 = 7x - 8 (Identity)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 2(3x + 1) = 6x + 5</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> No solution</p>
              <p className="text-xs text-gray-500">Simplifies to: 2 = 5 (False statement)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 5x - 3(x - 1) = 2x + 3</h4>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> Infinite solutions</p>
              <p className="text-xs text-gray-500">Simplifies to: 2x + 3 = 2x + 3 (Identity)</p>
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
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: Word Problems</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll apply your linear equation skills to solve real-world problems using a systematic approach!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Problem-solving strategy for word problems</li>
              <li>Translating words into mathematical equations</li>
              <li>Real-world applications and scenarios</li>
              <li>Checking answers in context</li>
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
          <h2 className="text-xl font-bold">Congratulations! You've mastered Special Cases!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Linear equations can have one solution, no solution, or infinite solutions</li>
              <li>✅ No solution: Variables cancel out, leaving false statement (like 3 = 7)</li>
              <li>✅ Infinite solutions: Equation simplifies to identity (like 5 = 5)</li>
              <li>✅ Graphically: parallel lines (no solution), same line (infinite solutions)</li>
              <li>✅ Always verify your conclusion by checking with substitution</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Word Problems</h4>
            <p className="text-sm">You'll learn to translate real-world situations into linear equations and solve them.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Challenge Question</h4>
            <p className="text-sm">What type of solution does 3(x + 2) - 1 = 3x + 5 have? Try it!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface SpecialCasesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const SpecialCasesMicroLesson: React.FC<SpecialCasesMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={specialCasesData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};