import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraIntroductionData: MicroLessonData = {
  id: 'algebra-introduction',
  moduleTitle: 'Introduction to Algebra',
  totalScreens: 12,
  screens: [
    {
      id: 'welcome',
      type: 'concept',
      title: 'Welcome to Algebra',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to the amazing world of algebra! Today we'll discover what algebra is and why it's such a powerful tool for solving problems.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What algebra is and why it matters</li>
              <li>The difference between variables and constants</li>
              <li>How to read and write algebraic expressions</li>
              <li>The order of operations (PEMDAS)</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-is-algebra',
      type: 'concept',
      title: 'What Is Algebra?',
      content: (
        <div className="space-y-4">
          <p>Algebra is the branch of mathematics that uses letters and symbols to represent unknown numbers and relationships between quantities.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔢 Arithmetic vs Algebra</h3>
              <p className="text-sm mb-2"><strong>Arithmetic:</strong> 3 + 5 = 8</p>
              <p className="text-sm"><strong>Algebra:</strong> x + 5 = 8, find x</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 Why Learn Algebra?</h3>
              <ul className="text-sm space-y-1">
                <li>• Solve real-world problems</li>
                <li>• Understand patterns and relationships</li>
                <li>• Prepare for advanced math</li>
                <li>• Develop logical thinking</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'variables-introduction',
      type: 'concept',
      title: 'Understanding Variables',
      content: (
        <div className="space-y-4">
          <p>A <strong>variable</strong> is a letter or symbol that represents an unknown number. Think of it as a container that can hold different values.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📦 Variable Examples:</h3>
            <div className="space-y-2">
              <p><strong>x = 5</strong> (x represents the number 5)</p>
              <p><strong>y = 12</strong> (y represents the number 12)</p>
              <p><strong>n = ?</strong> (n represents an unknown number)</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🌟 Common Variables:</h3>
            <p className="text-sm">We often use letters like x, y, z, n, a, b, c to represent unknown values. You can use almost any letter!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'constants-introduction',
      type: 'concept',
      title: 'Understanding Constants',
      content: (
        <div className="space-y-4">
          <p>A <strong>constant</strong> is a number that doesn't change. It always has the same value.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold mb-2 text-green-700">🔢 CONSTANTS</h3>
              <p className="text-sm mb-2">Numbers that stay the same</p>
              <ul className="text-sm space-y-1">
                <li>• 5 (always equals 5)</li>
                <li>• 12 (always equals 12)</li>
                <li>• -3 (always equals -3)</li>
                <li>• π ≈ 3.14159... (always the same)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold mb-2 text-blue-700">📦 VARIABLES</h3>
              <p className="text-sm mb-2">Letters that can represent different numbers</p>
              <ul className="text-sm space-y-1">
                <li>• x (could be 1, 5, 100, etc.)</li>
                <li>• y (could be any number)</li>
                <li>• n (represents unknown value)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'variable-practice',
      type: 'practice',
      title: 'Practice: Identifying Variables and Constants',
      content: (
        <div className="space-y-4">
          <p>Let's practice identifying variables and constants in these expressions:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Expression: 3x + 7</h4>
              <p className="text-sm mt-2">Variables: <span className="bg-blue-200 px-2 rounded">x</span></p>
              <p className="text-sm">Constants: <span className="bg-green-200 px-2 rounded">3</span>, <span className="bg-green-200 px-2 rounded">7</span></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Expression: 5y - 2 + z</h4>
              <p className="text-sm mt-2">Variables: <span className="bg-blue-200 px-2 rounded">y</span>, <span className="bg-blue-200 px-2 rounded">z</span></p>
              <p className="text-sm">Constants: <span className="bg-green-200 px-2 rounded">5</span>, <span className="bg-green-200 px-2 rounded">2</span></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Expression: 8 + 4 - 1</h4>
              <p className="text-sm mt-2">Variables: <span className="text-gray-500">None</span></p>
              <p className="text-sm">Constants: <span className="bg-green-200 px-2 rounded">8</span>, <span className="bg-green-200 px-2 rounded">4</span>, <span className="bg-green-200 px-2 rounded">1</span></p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'algebraic-expressions',
      type: 'concept',
      title: 'Algebraic Expressions',
      content: (
        <div className="space-y-4">
          <p>An <strong>algebraic expression</strong> is a mathematical phrase that contains numbers, variables, and operation symbols (+, -, ×, ÷).</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🧩 Expression Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Simple Expressions:</h4>
                <ul className="text-sm space-y-1">
                  <li>• x + 3</li>
                  <li>• 2y</li>
                  <li>• 5 - z</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Complex Expressions:</h4>
                <ul className="text-sm space-y-1">
                  <li>• 3x + 2y - 5</li>
                  <li>• 4a² + 7b</li>
                  <li>• (x + 2)(y - 1)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Key Point</h4>
            <p className="text-sm">Expressions don't have equal signs (=). When they do, they become equations!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'reading-expressions',
      type: 'example',
      title: 'Reading Algebraic Expressions',
      content: (
        <div className="space-y-4">
          <p>Let's learn how to read algebraic expressions aloud:</p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">📖 How to Read Expressions:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg bg-white px-2 py-1 rounded">3x</span>
                  <span className="text-sm">→ "three x" or "three times x"</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg bg-white px-2 py-1 rounded">x + 5</span>
                  <span className="text-sm">→ "x plus five"</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg bg-white px-2 py-1 rounded">2y - 7</span>
                  <span className="text-sm">→ "two y minus seven"</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg bg-white px-2 py-1 rounded">x²</span>
                  <span className="text-sm">→ "x squared"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'pemdas-introduction',
      type: 'concept',
      title: 'Order of Operations (PEMDAS)',
      content: (
        <div className="space-y-4">
          <p>When solving algebraic expressions, we must follow a specific order called <strong>PEMDAS</strong>.</p>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-red-700">🎯 PEMDAS Order:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-600 text-xl">P</span>
                <span><strong>Parentheses</strong> - Do operations inside () first</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-orange-600 text-xl">E</span>
                <span><strong>Exponents</strong> - Handle powers and roots</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-yellow-600 text-xl">M</span>
                <span><strong>Multiplication</strong> - × and • operations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600 text-xl">D</span>
                <span><strong>Division</strong> - ÷ and / operations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-xl">A</span>
                <span><strong>Addition</strong> - + operations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-purple-600 text-xl">S</span>
                <span><strong>Subtraction</strong> - - operations</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'pemdas-example',
      type: 'example',
      title: 'PEMDAS in Action',
      content: (
        <div className="space-y-4">
          <p>Let's work through an example using PEMDAS:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Problem: 2 + 3 × (4 + 1)²</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="bg-red-200 px-2 py-1 rounded text-xs font-medium">Step 1: Parentheses</span>
                <span>2 + 3 × (5)²</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-orange-200 px-2 py-1 rounded text-xs font-medium">Step 2: Exponents</span>
                <span>2 + 3 × 25</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-yellow-200 px-2 py-1 rounded text-xs font-medium">Step 3: Multiplication</span>
                <span>2 + 75</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-blue-200 px-2 py-1 rounded text-xs font-medium">Step 4: Addition</span>
                <span>77</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">✅ Answer: 77</h4>
            <p className="text-sm mt-2">Remember: Always follow PEMDAS order to get the correct answer!</p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'pemdas-practice',
      type: 'practice',
      title: 'Practice: PEMDAS Problems',
      content: (
        <div className="space-y-4">
          <p>Try these PEMDAS problems. Follow the order carefully!</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: 8 + 2 × 3</h4>
              <p className="text-sm mt-2">Step 1: Multiplication first → 8 + 6</p>
              <p className="text-sm">Step 2: Addition → <strong>14</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: (5 + 3) × 2</h4>
              <p className="text-sm mt-2">Step 1: Parentheses first → 8 × 2</p>
              <p className="text-sm">Step 2: Multiplication → <strong>16</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 12 ÷ 3 + 2²</h4>
              <p className="text-sm mt-2">Step 1: Exponent first → 12 ÷ 3 + 4</p>
              <p className="text-sm">Step 2: Division → 4 + 4</p>
              <p className="text-sm">Step 3: Addition → <strong>8</strong></p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'real-world-algebra',
      type: 'example',
      title: 'Algebra in Real Life',
      content: (
        <div className="space-y-4">
          <p>Algebra isn't just abstract math - it's everywhere in real life!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🏪 Shopping</h3>
              <p className="text-sm mb-2">If shirts cost $x each and you buy 3:</p>
              <p className="font-mono bg-white p-2 rounded text-center">Total = 3x</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🚗 Distance</h3>
              <p className="text-sm mb-2">Traveling at speed s for time t:</p>
              <p className="font-mono bg-white p-2 rounded text-center">Distance = s × t</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💰 Savings</h3>
              <p className="text-sm mb-2">If you save $y per month for 12 months:</p>
              <p className="font-mono bg-white p-2 rounded text-center">Total = 12y</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📐 Area</h3>
              <p className="text-sm mb-2">Rectangle with length l and width w:</p>
              <p className="font-mono bg-white p-2 rounded text-center">Area = l × w</p>
            </div>
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
          <h2 className="text-xl font-bold">Congratulations! You've completed Introduction to Algebra!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Algebra uses letters (variables) to represent unknown numbers</li>
              <li>✅ Constants are numbers that don't change, variables can represent any number</li>
              <li>✅ Algebraic expressions combine numbers, variables, and operations</li>
              <li>✅ PEMDAS tells us the correct order for solving problems</li>
              <li>✅ Algebra helps us solve real-world problems</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Working with Variables</h4>
            <p className="text-sm">In our next lesson, you'll learn about like terms, the distributive property, and how to simplify algebraic expressions.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Look around your daily life and try to find situations where algebra could be useful. Write down at least 3 examples!</p>
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

interface AlgebraIntroductionMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const AlgebraIntroductionMicroLesson: React.FC<AlgebraIntroductionMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraIntroductionData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};