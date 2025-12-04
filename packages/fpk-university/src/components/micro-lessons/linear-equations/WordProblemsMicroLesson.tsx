import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const wordProblemsData: MicroLessonData = {
  id: 'word-problems',
  moduleTitle: 'Word Problems with Linear Equations',
  totalScreens: 14,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Real-World Problem Solving',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Apply your linear equation skills to solve real-world problems using a systematic approach!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Systematic problem-solving strategy</li>
              <li>Translating words into mathematical equations</li>
              <li>Common word problem patterns</li>
              <li>Checking answers in real-world context</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🌍</div>
            <p className="text-sm text-muted-foreground">Mathematics meets the real world</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'problem-solving-strategy',
      type: 'concept',
      title: 'The Problem-Solving Strategy',
      content: (
        <div className="space-y-4">
          <p>Follow this systematic approach for any word problem:</p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">5-Step Problem-Solving Method</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="font-bold text-green-600 text-xl">1</span>
                <div>
                  <strong>Read</strong> the problem carefully - understand what's happening
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold text-blue-600 text-xl">2</span>
                <div>
                  <strong>Identify</strong> what you're looking for (define the variable)
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold text-purple-600 text-xl">3</span>
                <div>
                  <strong>Set up</strong> the equation using the given information
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold text-orange-600 text-xl">4</span>
                <div>
                  <strong>Solve</strong> the equation using your algebra skills
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold text-red-600 text-xl">5</span>
                <div>
                  <strong>Check</strong> your answer in the original problem context
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
      title: 'Example 1 Setup: Age Problem',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Problem:</h3>
            <p className="bg-white p-3 rounded mb-4">
              "Sarah is 3 years older than twice her brother's age. If Sarah is 17 years old, how old is her brother?"
            </p>
            
            <h4 className="font-semibold mb-2">Step 1: Read and Understand</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• Sarah's age is related to her brother's age</li>
              <li>• Sarah is 17 years old (given)</li>
              <li>• We need to find her brother's age</li>
            </ul>
            
            <h4 className="font-semibold mb-2">Step 2: Define the Variable</h4>
            <p className="text-sm bg-white p-2 rounded">Let x = brother's age (what we're looking for)</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'example1-solution',
      type: 'example',
      title: 'Example 1 Solution: Age Problem',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3: Set up the equation</strong></p>
              <p className="ml-4">"Sarah is 3 years older than twice her brother's age"</p>
              <p className="font-mono ml-4">Sarah's age = 2 × (brother's age) + 3</p>
              <p className="font-mono ml-4">17 = 2x + 3</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 4: Solve the equation</strong></p>
              <p className="font-mono ml-4">17 = 2x + 3</p>
              <p className="font-mono ml-4">17 - 3 = 2x</p>
              <p className="font-mono ml-4">14 = 2x</p>
              <p className="font-mono ml-4">x = 7</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Step 5: Check the answer</strong></p>
              <p className="ml-4">Brother's age: 7 years old</p>
              <p className="ml-4">Check: 2(7) + 3 = 14 + 3 = 17 ✓</p>
              <p className="text-sm text-green-600">Sarah is indeed 17, so our answer is correct!</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'common-word-problem-types',
      type: 'concept',
      title: 'Common Word Problem Types',
      content: (
        <div className="space-y-4">
          <p>Recognize these common patterns to solve problems more efficiently:</p>
          <div className="grid gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">📏 Geometry Problems</h4>
              <p className="text-sm">Perimeter, area, angles</p>
              <p className="text-xs text-muted-foreground">Example: "A rectangle's length is 3 more than twice its width..."</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">💰 Money Problems</h4>
              <p className="text-sm">Cost, profit, budget calculations</p>
              <p className="text-xs text-muted-foreground">Example: "Tickets cost $5 for adults and $3 for children..."</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">🎂 Age Problems</h4>
              <p className="text-sm">Comparing ages, age differences</p>
              <p className="text-xs text-muted-foreground">Example: "In 5 years, John will be twice as old as..."</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-700">🏃 Motion Problems</h4>
              <p className="text-sm">Distance, speed, time relationships</p>
              <p className="text-xs text-muted-foreground">Example: "Two trains leave stations 200 miles apart..."</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example2-money-problem',
      type: 'example',
      title: 'Example 2: Money Problem',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Problem:</h3>
            <p className="bg-white p-3 rounded mb-4">
              "Movie tickets cost $12 for adults and $8 for children. If a family paid $64 for 6 tickets total, how many adult tickets did they buy?"
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Define variables:</strong></p>
                <p className="ml-4">Let x = number of adult tickets</p>
                <p className="ml-4">Then (6 - x) = number of child tickets</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Set up equation:</strong></p>
                <p className="ml-4">12x + 8(6 - x) = 64</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Solve:</strong></p>
                <p className="font-mono ml-4">12x + 48 - 8x = 64</p>
                <p className="font-mono ml-4">4x + 48 = 64</p>
                <p className="font-mono ml-4">4x = 16</p>
                <p className="font-mono ml-4">x = 4</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p><strong>Answer:</strong> 4 adult tickets, 2 child tickets</p>
                <p><strong>Check:</strong> 4($12) + 2($8) = $48 + $16 = $64 ✓</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'translation-tips',
      type: 'concept',
      title: 'Translating Words to Math',
      content: (
        <div className="space-y-4">
          <p>Learn to recognize mathematical relationships in word problems:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-700">Addition Phrases</h4>
                <ul className="text-sm space-y-1">
                  <li>• "more than" → +</li>
                  <li>• "increased by" → +</li>
                  <li>• "sum of" → +</li>
                  <li>• "total of" → +</li>
                </ul>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-semibold text-red-700">Subtraction Phrases</h4>
                <ul className="text-sm space-y-1">
                  <li>• "less than" → -</li>
                  <li>• "decreased by" → -</li>
                  <li>• "difference" → -</li>
                  <li>• "reduced by" → -</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-700">Multiplication Phrases</h4>
                <ul className="text-sm space-y-1">
                  <li>• "times" → ×</li>
                  <li>• "product of" → ×</li>
                  <li>• "twice" → 2×</li>
                  <li>• "double" → 2×</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-700">Equality Phrases</h4>
                <ul className="text-sm space-y-1">
                  <li>• "is" → =</li>
                  <li>• "equals" → =</li>
                  <li>• "is the same as" → =</li>
                  <li>• "results in" → =</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'example3-geometry',
      type: 'example',
      title: 'Example 3: Geometry Problem',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Problem:</h3>
            <p className="bg-white p-3 rounded mb-4">
              "The length of a rectangle is 5 cm more than twice its width. If the perimeter is 46 cm, find the width."
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Define variable:</strong></p>
                <p className="ml-4">Let w = width of rectangle</p>
                <p className="ml-4">Then length = 2w + 5</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Use perimeter formula:</strong></p>
                <p className="ml-4">Perimeter = 2(length + width)</p>
                <p className="ml-4">46 = 2(2w + 5 + w)</p>
                <p className="ml-4">46 = 2(3w + 5)</p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Solve:</strong></p>
                <p className="font-mono ml-4">46 = 6w + 10</p>
                <p className="font-mono ml-4">36 = 6w</p>
                <p className="font-mono ml-4">w = 6</p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p><strong>Answer:</strong> Width = 6 cm, Length = 17 cm</p>
                <p><strong>Check:</strong> Perimeter = 2(6 + 17) = 2(23) = 46 cm ✓</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'practice-problems',
      type: 'practice',
      title: 'Practice Word Problems',
      content: (
        <div className="space-y-4">
          <p>Practice with these step-by-step problems:</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: Consecutive Numbers</h4>
              <p className="text-sm mb-2">"Three consecutive integers have a sum of 48. Find the integers."</p>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Show Solution</summary>
                <div className="mt-2 space-y-1">
                  <p>Let x = first integer</p>
                  <p>Then x+1 = second, x+2 = third</p>
                  <p>x + (x+1) + (x+2) = 48</p>
                  <p>3x + 3 = 48 → x = 15</p>
                  <p><strong>Answer:</strong> 15, 16, 17</p>
                </div>
              </details>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: Mixture Problem</h4>
              <p className="text-sm mb-2">"A store sells nuts for $6/lb and trail mix for $4/lb. How many pounds of each are needed to make 10 lbs of mix worth $5/lb?"</p>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Show Solution</summary>
                <div className="mt-2 space-y-1">
                  <p>Let x = pounds of nuts</p>
                  <p>Then (10-x) = pounds of trail mix</p>
                  <p>6x + 4(10-x) = 5(10)</p>
                  <p>6x + 40 - 4x = 50 → x = 5</p>
                  <p><strong>Answer:</strong> 5 lbs nuts, 5 lbs trail mix</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'checking-answers',
      type: 'concept',
      title: 'Checking Your Answers',
      content: (
        <div className="space-y-4">
          <p>Always verify your solution makes sense in the original problem:</p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">✅ Three-Part Check</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <h4 className="font-medium">1. Mathematical Check</h4>
                <p className="text-sm">Substitute your answer back into the equation to verify it's correct</p>
              </div>
              <div className="bg-white p-3 rounded">
                <h4 className="font-medium">2. Units Check</h4>
                <p className="text-sm">Make sure your answer has the right units (age in years, length in cm, etc.)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <h4 className="font-medium">3. Reality Check</h4>
                <p className="text-sm">Does the answer make sense in the real-world context? (No negative ages, reasonable values, etc.)</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2">🚫 Common Sense Checks</h4>
            <ul className="text-sm space-y-1">
              <li>• Ages should be positive numbers</li>
              <li>• Distances should be positive</li>
              <li>• Counts of objects should be whole numbers</li>
              <li>• Percentages should be between 0% and 100% (unless specified otherwise)</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'problem-solving-tips',
      type: 'concept',
      title: 'Problem-Solving Tips',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🎯 Success Strategies</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              <li>Read the problem at least twice before starting</li>
              <li>Underline or highlight key information</li>
              <li>Draw a picture or diagram when helpful</li>
              <li>Choose a variable that represents what you're looking for</li>
              <li>Write down what your variable represents</li>
              <li>Look for relationships between quantities</li>
              <li>Don't rush - take time to understand the problem</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 When You're Stuck</h4>
            <ul className="text-sm space-y-1">
              <li>• Try working backwards from the answer choices (if given)</li>
              <li>• Make up simpler numbers to understand the pattern</li>
              <li>• Ask yourself: "What do I know?" and "What do I need to find?"</li>
              <li>• Break complex problems into smaller parts</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'real-world-applications',
      type: 'concept',
      title: 'Real-World Applications',
      content: (
        <div className="space-y-4">
          <p>Linear equations help solve problems in many fields:</p>
          <div className="grid gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">💼 Business & Economics</h4>
              <ul className="text-sm space-y-1">
                <li>• Break-even analysis</li>
                <li>• Profit and loss calculations</li>
                <li>• Supply and demand modeling</li>
                <li>• Budget planning</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">🔬 Science & Engineering</h4>
              <ul className="text-sm space-y-1">
                <li>• Converting units and measurements</li>
                <li>• Calculating rates and speeds</li>
                <li>• Mixing solutions and concentrations</li>
                <li>• Linear relationships in data</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">🏠 Everyday Life</h4>
              <ul className="text-sm space-y-1">
                <li>• Planning trips and calculating costs</li>
                <li>• Comparing phone plans or subscriptions</li>
                <li>• Recipe scaling and proportions</li>
                <li>• Home improvement calculations</li>
              </ul>
            </div>
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
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: Course Mastery</h3>
            <p className="text-muted-foreground mb-4">
              In the final lesson, we'll review everything you've learned and celebrate your mastery of linear equations!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Comprehensive review of all concepts</li>
              <li>Advanced challenge problems</li>
              <li>Skills assessment and next steps</li>
              <li>Celebration of your achievements</li>
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
          <h2 className="text-xl font-bold">Congratulations! You've mastered Word Problems!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Use the 5-step method: Read, Identify, Set up, Solve, Check</li>
              <li>✅ Define your variable clearly - what are you looking for?</li>
              <li>✅ Translate word phrases into mathematical expressions</li>
              <li>✅ Always check your answer in the original problem context</li>
              <li>✅ Linear equations solve real problems in many fields</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Linear Equations Mastery</h4>
            <p className="text-sm">You'll review all concepts and tackle advanced problems to complete your mastery.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Real-World Challenge</h4>
            <p className="text-sm">Find a real problem in your life that you can solve using linear equations!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface WordProblemsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const WordProblemsMicroLesson: React.FC<WordProblemsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={wordProblemsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};