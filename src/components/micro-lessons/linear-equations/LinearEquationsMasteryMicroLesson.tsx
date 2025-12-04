import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const linearEquationsMasteryData: MicroLessonData = {
  id: 'linear-equations-mastery',
  moduleTitle: 'Linear Equations Mastery',
  totalScreens: 12,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Course Complete! 🎉',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Congratulations! You've mastered linear equations and are ready to tackle more advanced mathematical concepts!</p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">🏆 What You've Accomplished</h3>
            <p className="text-muted-foreground mb-4">
              You've completed the Linear Equations course! You now have the skills to solve various types of linear equations and apply them to real-world problems.
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🎓</div>
            <p className="text-sm text-muted-foreground">Ready for advanced mathematics</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'skills-mastered',
      type: 'summary',
      title: 'Skills You\'ve Mastered',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Skills Mastered Throughout This Course</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h4 className="font-medium mb-3">Core Mathematical Skills:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>✓ Understanding linear equation fundamentals and balance concept</li>
              <li>✓ Mastering the SOAP solving method for systematic solutions</li>
              <li>✓ Working with multi-step equations using distribution and combining like terms</li>
              <li>✓ Graphing linear equations and understanding slope and intercepts</li>
              <li>✓ Identifying special cases (no solution/infinite solutions)</li>
              <li>✓ Solving real-world word problems with linear equations</li>
              <li>✓ Building mathematical reasoning and problem-solving skills</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'comprehensive-review',
      type: 'concept',
      title: 'Comprehensive Review',
      content: (
        <div className="space-y-4">
          <p>Let's review the key concepts from each lesson:</p>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700">Lesson 1: Introduction</h4>
              <p className="text-sm">Linear equations, balance concept, properties of equality</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700">Lesson 2: SOAP Method</h4>
              <p className="text-sm">Systematic solving: Simplify, Opposite, Add/subtract, Product/quotient</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700">Lesson 3: Multi-Step Equations</h4>
              <p className="text-sm">Distribution, combining like terms, complex problem solving</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700">Lesson 4: Graphing</h4>
              <p className="text-sm">Slope, y-intercept, x and y intercepts, visual representation</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700">Lesson 5: Special Cases</h4>
              <p className="text-sm">No solution (inconsistent), infinite solutions (identity)</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700">Lesson 6: Word Problems</h4>
              <p className="text-sm">Real-world applications, problem-solving strategy</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'challenge-problem-1',
      type: 'practice',
      title: 'Master Challenge 1: Complex Multi-Step',
      content: (
        <div className="space-y-4">
          <p>Test your skills with this comprehensive problem:</p>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">3(2x - 4) + 5x = 2(4x + 1) - 3</h3>
            <div className="space-y-3 mt-4">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 1:</strong> Distribute both sides</p>
                <p className="font-mono ml-4">6x - 12 + 5x = 8x + 2 - 3</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 2:</strong> Combine like terms</p>
                <p className="font-mono ml-4">11x - 12 = 8x - 1</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 3:</strong> Move variables and constants</p>
                <p className="font-mono ml-4">11x - 8x = -1 + 12</p>
                <p className="font-mono ml-4">3x = 11</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Step 4:</strong> Solve for x</p>
                <p className="font-mono ml-4">x = 11/3</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p><strong>Check:</strong> Substitute x = 11/3 back into original equation ✓</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'challenge-problem-2',
      type: 'practice',
      title: 'Master Challenge 2: Word Problem',
      content: (
        <div className="space-y-4">
          <p>Apply all your skills to this real-world scenario:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Problem:</h3>
            <p className="bg-white p-3 rounded mb-4">
              "A school is planning a field trip. The bus rental costs $200 plus $15 per student. If the total cost cannot exceed $650, what is the maximum number of students who can go on the trip?"
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Define variable:</strong> Let x = number of students</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Set up inequality:</strong> 200 + 15x ≤ 650</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Solve:</strong></p>
                <p className="font-mono ml-4">15x ≤ 650 - 200</p>
                <p className="font-mono ml-4">15x ≤ 450</p>
                <p className="font-mono ml-4">x ≤ 30</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p><strong>Answer:</strong> Maximum 30 students can go on the trip</p>
                <p><strong>Check:</strong> 200 + 15(30) = 200 + 450 = $650 ✓</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Note:</strong> This introduces inequalities, a natural next step after linear equations!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'special-case-review',
      type: 'practice',
      title: 'Master Challenge 3: Special Cases',
      content: (
        <div className="space-y-4">
          <p>Identify the type of solution for each equation:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem A: 4(x - 1) + 2x = 6x - 4</h4>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Show Solution</summary>
                <div className="mt-2">
                  <p>4x - 4 + 2x = 6x - 4 → 6x - 4 = 6x - 4</p>
                  <p><strong>Answer:</strong> Infinite solutions (Identity)</p>
                </div>
              </details>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem B: 3x + 5 = 3x - 2</h4>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Show Solution</summary>
                <div className="mt-2">
                  <p>3x + 5 = 3x - 2 → 5 = -2</p>
                  <p><strong>Answer:</strong> No solution (Inconsistent)</p>
                </div>
              </details>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem C: 2(x + 3) = x + 9</h4>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Show Solution</summary>
                <div className="mt-2">
                  <p>2x + 6 = x + 9 → x = 3</p>
                  <p><strong>Answer:</strong> One solution: x = 3</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'graphing-mastery',
      type: 'concept',
      title: 'Graphing Mastery Check',
      content: (
        <div className="space-y-4">
          <p>Demonstrate your graphing skills with these equations:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">y = -2x + 6</h4>
              <ul className="text-sm space-y-1 mt-2">
                <li>• Slope: -2 (down 2, right 1)</li>
                <li>• Y-intercept: (0, 6)</li>
                <li>• X-intercept: (3, 0)</li>
                <li>• Line goes down from left to right</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">3x + 2y = 12</h4>
              <ul className="text-sm space-y-1 mt-2">
                <li>• X-intercept: (4, 0)</li>
                <li>• Y-intercept: (0, 6)</li>
                <li>• Slope: -3/2</li>
                <li>• Graph using intercepts</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Graphing Checklist</h4>
            <ul className="text-sm space-y-1">
              <li>✓ Can identify slope and y-intercept from slope-intercept form</li>
              <li>✓ Can find x and y intercepts from standard form</li>
              <li>✓ Can graph using multiple methods</li>
              <li>✓ Understand what negative slopes look like</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'next-steps',
      type: 'concept',
      title: 'Next Steps in Your Mathematical Journey',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
            <h4 className="font-medium text-purple-700 mb-3">🚀 Advanced Topics to Explore</h4>
            <p className="text-muted-foreground mb-3">
              With your solid foundation in linear equations, you're ready to explore more advanced topics:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Systems of Linear Equations</h5>
                <p className="text-sm">Solve multiple equations simultaneously</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Quadratic Equations</h5>
                <p className="text-sm">Equations with x² terms</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Polynomial Expressions</h5>
                <p className="text-sm">Working with higher degree terms</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Advanced Graphing</h5>
                <p className="text-sm">Parabolas, circles, and other curves</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Linear Inequalities</h5>
                <p className="text-sm">Solving and graphing inequalities</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-semibold">Functions</h5>
                <p className="text-sm">Understanding mathematical relationships</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'real-world-connections',
      type: 'concept',
      title: 'Real-World Connections',
      content: (
        <div className="space-y-4">
          <p>Your linear equation skills open doors to many fields:</p>
          <div className="grid gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">🔬 STEM Fields</h4>
              <ul className="text-sm space-y-1">
                <li>• Engineering: Load calculations, circuit analysis</li>
                <li>• Physics: Motion problems, force equations</li>
                <li>• Chemistry: Concentration and mixture problems</li>
                <li>• Computer Science: Algorithms and optimization</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">💼 Business & Finance</h4>
              <ul className="text-sm space-y-1">
                <li>• Break-even analysis and profit modeling</li>
                <li>• Investment and loan calculations</li>
                <li>• Supply chain optimization</li>
                <li>• Market research and trend analysis</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">🎨 Creative Fields</h4>
              <ul className="text-sm space-y-1">
                <li>• Graphic design: Proportions and scaling</li>
                <li>• Architecture: Structural calculations</li>
                <li>• Music: Mathematical relationships in harmony</li>
                <li>• Art: Perspective and geometric principles</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'study-tips',
      type: 'concept',
      title: 'Continued Learning Tips',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">📚 Tips for Continued Success</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Practice regularly - mathematics is a skill that improves with use</li>
              <li>Don't just memorize formulas - understand the reasoning behind them</li>
              <li>Work through problems step-by-step and show your work</li>
              <li>Check your answers and learn from mistakes</li>
              <li>Apply mathematics to real situations you encounter</li>
              <li>Help others learn - teaching reinforces your own understanding</li>
              <li>Stay curious and ask "why" when learning new concepts</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Growth Mindset</h4>
            <p className="text-sm">Remember: Every mathematician started where you are now. With practice and persistence, you can master any mathematical concept!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'final-celebration',
      type: 'summary',
      title: 'Congratulations! 🎉',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">You've Completed Linear Equations!</h2>
          </div>
          
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
            <h3 className="font-semibold mb-3 text-center">🌟 Achievement Unlocked 🌟</h3>
            <div className="text-center space-y-2">
              <p className="font-medium">Linear Equations Master</p>
              <p className="text-sm text-muted-foreground">You have successfully completed all 7 lessons and demonstrated mastery of:</p>
              <ul className="text-sm space-y-1 mt-3">
                <li>✨ Solving equations systematically with SOAP</li>
                <li>✨ Handling complex multi-step problems</li>
                <li>✨ Graphing and visual interpretation</li>
                <li>✨ Identifying special cases</li>
                <li>✨ Applying math to real-world problems</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🚀 You're Ready For</h4>
            <ul className="text-sm space-y-1">
              <li>• Advanced algebra courses</li>
              <li>• Systems of equations</li>
              <li>• Quadratic equations and beyond</li>
              <li>• Real-world problem solving</li>
            </ul>
          </div>

          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <p className="font-medium">Thank you for your dedication and hard work!</p>
            <p className="text-sm text-muted-foreground mt-2">Keep practicing, keep learning, and keep growing! 📈</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface LinearEquationsMasteryMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LinearEquationsMasteryMicroLesson: React.FC<LinearEquationsMasteryMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={linearEquationsMasteryData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};