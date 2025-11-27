import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const linearEquationsIntroductionData: MicroLessonData = {
  id: 'linear-equations-introduction',
  moduleTitle: 'Introduction to Linear Equations',
  totalScreens: 12,
  screens: [
    {
      id: 'welcome',
      type: 'concept',
      title: 'Welcome to Linear Equations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to the world of linear equations! Today we'll explore the fundamental concepts and discover how to solve equations with one variable.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What linear equations are and why they matter</li>
              <li>Different forms of linear equations</li>
              <li>The balance concept for solving equations</li>
              <li>Step-by-step solving techniques</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">⚖️</div>
            <p className="text-sm text-muted-foreground">Think of equations as balanced scales</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-is-linear-equation',
      type: 'concept',
      title: 'What is a Linear Equation?',
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-foreground leading-relaxed">
              <strong>A linear equation</strong> is an equation where the highest power of the variable is 1. 
              It creates a straight line when graphed on a coordinate plane.
            </p>
          </div>
          <p className="text-muted-foreground">Linear equations help us solve problems involving:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Finding unknown values in real-world situations</li>
            <li>Calculating costs, distances, and time</li>
            <li>Balancing equations in chemistry and physics</li>
            <li>Business and financial calculations</li>
            <li>Engineering and construction problems</li>
          </ul>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'forms-of-equations',
      type: 'concept',
      title: 'Forms of Linear Equations',
      content: (
        <div className="space-y-4">
          <p>Linear equations can appear in different forms:</p>
          <div className="grid gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">Simple Form</h4>
              <p className="font-mono text-lg">x + 5 = 12</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">With Coefficients</h4>
              <p className="font-mono text-lg">3x - 7 = 11</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">Variables on Both Sides</h4>
              <p className="font-mono text-lg">2x + 3 = x + 8</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-700">With Fractions</h4>
              <p className="font-mono text-lg">x/2 + 3 = 7</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'balance-concept',
      type: 'concept',
      title: 'The Balance Concept',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Equations as Balanced Scales</h4>
                <p className="text-sm text-muted-foreground">
                  Think of an equation as a balanced scale. Whatever you do to one side, 
                  you must do to the other side to keep it balanced.
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Key Principle:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Add the same number to both sides</li>
                    <li>Subtract the same number from both sides</li>
                    <li>Multiply both sides by the same number</li>
                    <li>Divide both sides by the same number</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg text-center">
                <div className="text-8xl mb-2">⚖️</div>
                <p className="text-sm text-muted-foreground">Keep the balance!</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'simple-example-setup',
      type: 'example',
      title: 'Example Setup: x + 5 = 12',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's solve this step by step:</p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <div className="bg-white/60 p-3 rounded mb-4">
              <p className="text-center font-mono text-xl">x + 5 = 12</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Our goal is to isolate x (get x by itself on one side of the equation).
              We need to "undo" the +5 to isolate x.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Strategy:</h4>
              <p className="text-sm">Since we have +5, we need to subtract 5 from both sides to maintain balance.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'simple-example-solution',
      type: 'example',
      title: 'Solving: x + 5 = 12',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Start with the equation</p>
              <p className="font-mono ml-4">x + 5 = 12</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Subtract 5 from both sides</p>
              <p className="font-mono ml-4">x + 5 - 5 = 12 - 5</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3:</strong> Simplify</p>
              <p className="font-mono ml-4">x = 7</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Step 4:</strong> Check your answer</p>
              <p className="font-mono ml-4">7 + 5 = 12 ✓</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practice-simple',
      type: 'practice',
      title: 'Practice: Simple Equations',
      content: (
        <div className="space-y-4">
          <p>Try these on your own, then check the solutions:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: x + 3 = 10</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 7</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: x - 4 = 6</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 10</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: 2x = 14</h4>
              <p className="text-sm text-gray-600 mt-2">Solution: x = 7</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Remember:</strong> Always check your answer by substituting back into the original equation!</p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'real-world-applications',
      type: 'concept',
      title: 'Real-World Applications',
      content: (
        <div className="space-y-4">
          <p>Linear equations appear everywhere in real life:</p>
          <div className="grid gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">📐 Construction & Engineering</h4>
              <p className="text-sm">Calculating materials needed, load distributions, measurements</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">💰 Business & Finance</h4>
              <p className="text-sm">Profit calculations, break-even analysis, budgeting</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">🧪 Science</h4>
              <p className="text-sm">Chemical equations, physics formulas, data analysis</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-700">🏠 Daily Life</h4>
              <p className="text-sm">Recipe scaling, travel time, cost comparisons</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'equation-properties',
      type: 'concept',
      title: 'Properties of Equality',
      content: (
        <div className="space-y-4">
          <p>These fundamental properties allow us to solve equations:</p>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">Addition Property</h4>
              <p className="text-sm">If a = b, then a + c = b + c</p>
              <p className="text-xs text-muted-foreground">Add the same number to both sides</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">Subtraction Property</h4>
              <p className="text-sm">If a = b, then a - c = b - c</p>
              <p className="text-xs text-muted-foreground">Subtract the same number from both sides</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">Multiplication Property</h4>
              <p className="text-sm">If a = b, then a × c = b × c</p>
              <p className="text-xs text-muted-foreground">Multiply both sides by the same number</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-700">Division Property</h4>
              <p className="text-sm">If a = b, then a ÷ c = b ÷ c (c ≠ 0)</p>
              <p className="text-xs text-muted-foreground">Divide both sides by the same non-zero number</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'checking-solutions',
      type: 'practice',
      title: 'Checking Your Solutions',
      content: (
        <div className="space-y-4">
          <p>Always verify your answer by substituting back into the original equation:</p>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Example: Check x = 7 for x + 5 = 12</h3>
            <div className="space-y-2">
              <p><strong>Step 1:</strong> Substitute x = 7 into the original equation</p>
              <p className="font-mono ml-4">7 + 5 = 12</p>
              <p><strong>Step 2:</strong> Simplify the left side</p>
              <p className="font-mono ml-4">12 = 12 ✓</p>
              <p><strong>Step 3:</strong> Check if both sides are equal</p>
              <p className="ml-4 text-green-600">Since 12 = 12 is true, x = 7 is correct!</p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2">⚠️ What if your check doesn't work?</h4>
            <p className="text-sm">If substituting your answer doesn't make the equation true, go back and check your work for arithmetic errors.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'coming-up-next',
      type: 'concept',
      title: 'Coming Up Next',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: The SOAP Method</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll learn the systematic approach to solving linear equations 
              and practice with more complex examples!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Step-by-step solving process using SOAP</li>
              <li>Handling equations with coefficients</li>
              <li>Working with negative numbers</li>
              <li>Interactive practice problems</li>
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
          <h2 className="text-xl font-bold">Congratulations! You've completed Introduction to Linear Equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Linear equations have variables with power 1 and graph as straight lines</li>
              <li>✅ Equations work like balanced scales - what you do to one side, do to the other</li>
              <li>✅ Use properties of equality to isolate the variable</li>
              <li>✅ Always check your solution by substituting back</li>
              <li>✅ Linear equations solve real-world problems in many fields</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: SOAP Solving Method</h4>
            <p className="text-sm">You'll master a systematic approach to solve any linear equation step-by-step.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Try solving: 4x - 3 = 17. Can you find x and check your answer?</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface LinearEquationsIntroductionMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LinearEquationsIntroductionMicroLesson: React.FC<LinearEquationsIntroductionMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={linearEquationsIntroductionData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};