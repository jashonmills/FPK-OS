import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const soapMethodData: MicroLessonData = {
  id: 'soap-method',
  moduleTitle: 'SOAP Method: Systematic Solving',
  totalScreens: 14,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'The SOAP Method',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Master the systematic approach to solving linear equations with the SOAP method!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>The step-by-step SOAP solving process</li>
              <li>Handling equations with coefficients</li>
              <li>Solving equations with variables on both sides</li>
              <li>Working with fractions in equations</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🧮</div>
            <p className="text-sm text-muted-foreground">Systematic solving for success</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'soap-explained',
      type: 'concept',
      title: 'Understanding SOAP',
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-foreground leading-relaxed mb-3">
              Use <strong>SOAP</strong> to remember the order of operations when solving:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <span className="font-bold text-blue-600 text-2xl">S</span>
                <div>
                  <strong>Simplify</strong> both sides (combine like terms, distribute)
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-bold text-green-600 text-2xl">O</span>
                <div>
                  <strong>Opposite</strong> operations (addition/subtraction first)
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-bold text-purple-600 text-2xl">A</span>
                <div>
                  <strong>Add</strong> or subtract to isolate terms with variables
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-bold text-orange-600 text-2xl">P</span>
                <div>
                  <strong>Product/quotient</strong> operations (multiply/divide last)
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example1-setup',
      type: 'example',
      title: 'Example 1 Setup: 3x + 7 = 22',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's apply SOAP to solve this equation:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="bg-white/60 p-3 rounded mb-4">
              <p className="text-center font-mono text-xl">3x + 7 = 22</p>
            </div>
            <div className="grid gap-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>S - Simplify:</strong> Both sides are already simplified</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>O - Opposite:</strong> We have +7, so we'll subtract 7</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>A - Add/Subtract:</strong> Subtract 7 from both sides</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>P - Product/Quotient:</strong> Then divide by the coefficient of x</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'example1-solution',
      type: 'example',
      title: 'Example 1 Solution: 3x + 7 = 22',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 3x + 7 = 22</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1 (A):</strong> Subtract 7 from both sides</p>
              <p className="font-mono ml-4">3x + 7 - 7 = 22 - 7</p>
              <p className="font-mono ml-4">3x = 15</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2 (P):</strong> Divide both sides by 3</p>
              <p className="font-mono ml-4">3x ÷ 3 = 15 ÷ 3</p>
              <p className="font-mono ml-4">x = 5</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 3(5) + 7 = 15 + 7 = 22 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'variables-both-sides',
      type: 'concept',
      title: 'Variables on Both Sides',
      content: (
        <div className="space-y-4">
          <p>When variables appear on both sides, we need an extra step in our SOAP process:</p>
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Modified SOAP for Both Sides:</h3>
            <div className="space-y-2">
              <p><strong>S:</strong> Simplify both sides</p>
              <p><strong>O:</strong> Move variables to one side (usually the side with more variables)</p>
              <p><strong>A:</strong> Move constants to the other side</p>
              <p><strong>P:</strong> Divide by the coefficient</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Strategy Tip</h4>
            <p className="text-sm">Move variables to the side that will give you a positive coefficient to avoid working with negative numbers when possible.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example2-solution',
      type: 'example',
      title: 'Example 2: 2x + 3 = x + 8',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Variables on both sides - let's use SOAP:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> 2x + 3 = x + 8</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1 (O):</strong> Subtract x from both sides</p>
              <p className="font-mono ml-4">2x - x + 3 = x - x + 8</p>
              <p className="font-mono ml-4">x + 3 = 8</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2 (A):</strong> Subtract 3 from both sides</p>
              <p className="font-mono ml-4">x + 3 - 3 = 8 - 3</p>
              <p className="font-mono ml-4">x = 5</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 2(5) + 3 = 13, and 5 + 8 = 13 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'fractions-introduction',
      type: 'concept',
      title: 'Working with Fractions',
      content: (
        <div className="space-y-4">
          <p>Fractions in equations can look intimidating, but SOAP still works perfectly!</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Strategies for Fractions:</h3>
            <div className="space-y-2">
              <p><strong>Option 1:</strong> Work with the fraction as-is</p>
              <p><strong>Option 2:</strong> Multiply the entire equation by the denominator to clear fractions</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🔍 Which Method to Choose?</h4>
            <ul className="text-sm space-y-1">
              <li>• Simple fractions (like 1/2): Work directly</li>
              <li>• Complex fractions: Clear denominators first</li>
              <li>• Multiple fractions: Usually clear denominators</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'example3-solution',
      type: 'example',
      title: 'Example 3: x/2 + 3 = 7',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Working with fractions using SOAP:</p>
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Given:</strong> x/2 + 3 = 7</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1 (A):</strong> Subtract 3 from both sides</p>
              <p className="font-mono ml-4">x/2 + 3 - 3 = 7 - 3</p>
              <p className="font-mono ml-4">x/2 = 4</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2 (P):</strong> Multiply both sides by 2</p>
              <p className="font-mono ml-4">(x/2) × 2 = 4 × 2</p>
              <p className="font-mono ml-4">x = 8</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Check:</strong> 8/2 + 3 = 4 + 3 = 7 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practice-problems',
      type: 'practice',
      title: 'Practice Problems',
      content: (
        <div className="space-y-4">
          <p>Apply SOAP to solve these equations:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 4x - 5 = 15</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 5</p>
              <p className="text-xs text-gray-500">Steps: Add 5 to both sides → 4x = 20 → Divide by 4 → x = 5</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 3x + 2 = 2x + 9</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 7</p>
              <p className="text-xs text-gray-500">Steps: Subtract 2x → x + 2 = 9 → Subtract 2 → x = 7</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: x/3 - 1 = 2</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 9</p>
              <p className="text-xs text-gray-500">Steps: Add 1 → x/3 = 3 → Multiply by 3 → x = 9</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'common-mistakes',
      type: 'concept',
      title: 'Common Mistakes to Avoid',
      content: (
        <div className="space-y-4">
          <p>Learn from these common errors to improve your solving skills:</p>
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 1: Not doing the same to both sides</h4>
              <p className="text-sm">Wrong: 3x + 5 = 11 → 3x = 11 - 5 (forgot to subtract 5 from left side)</p>
              <p className="text-sm text-green-600">Right: 3x + 5 - 5 = 11 - 5 → 3x = 6</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 2: Arithmetic errors</h4>
              <p className="text-sm">Always double-check your arithmetic, especially with negative numbers</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700">❌ Mistake 3: Not checking the answer</h4>
              <p className="text-sm">Always substitute your solution back into the original equation!</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'soap-tips',
      type: 'concept',
      title: 'SOAP Success Tips',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">💡 Pro Tips for SOAP</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Always check your answer by substituting back into the original equation</li>
              <li>When dividing by a negative number, the equation balance stays the same</li>
              <li>Keep your work organized - write each step clearly</li>
              <li>If you get a decimal or fraction answer, double-check your arithmetic</li>
              <li>Practice mental math to speed up your solving</li>
              <li>Don't skip steps - even simple ones help prevent errors</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'coming-up-next',
      type: 'concept',
      title: 'Coming Up Next',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: Multi-Step Equations</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll tackle more complex equations involving distribution 
              and combining like terms!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Using the distributive property</li>
              <li>Combining like terms</li>
              <li>Complex multi-step equations</li>
              <li>Advanced SOAP applications</li>
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
          <h2 className="text-xl font-bold">Congratulations! You've mastered the SOAP Method!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ SOAP provides a systematic approach: Simplify, Opposite, Add/subtract, Product/quotient</li>
              <li>✅ Handle coefficients by dividing at the end</li>
              <li>✅ Move variables to one side, constants to the other</li>
              <li>✅ Fractions work the same way - multiply to clear denominators if needed</li>
              <li>✅ Always check your solution by substituting back</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Multi-Step Equations & Distribution</h4>
            <p className="text-sm">You'll learn to handle complex equations with parentheses and multiple terms.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Challenge Problem</h4>
            <p className="text-sm">Try solving: 5x - 3 = 2x + 12. Use SOAP and check your answer!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface SOAPMethodMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const SOAPMethodMicroLesson: React.FC<SOAPMethodMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={soapMethodData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};