import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraApplicationsData: MicroLessonData = {
  id: 'algebra-applications',
  moduleTitle: 'Advanced Applications',
  totalScreens: 12,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Real-World Algebra Applications',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Congratulations on making it to the final lesson! Now let's see how all your algebra skills work together to solve real-world problems.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Master:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Translating word problems into algebraic equations</li>
              <li>Solving complex multi-step problems</li>
              <li>Working with formulas and rearranging them</li>
              <li>Applying algebra to science, business, and everyday life</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'word-problems-strategy',
      type: 'concept',
      title: 'Word Problem Strategy',
      content: (
        <div className="space-y-4">
          <p>Word problems can seem intimidating, but with a systematic approach, they become manageable puzzles to solve.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🎯 SOLVE Strategy</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600 text-xl">S</span>
                <div>
                  <strong>Study</strong> the problem - Read carefully and identify what you're looking for
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-xl">O</span>
                <div>
                  <strong>Organize</strong> the information - What do you know? What do you need to find?
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-purple-600 text-xl">L</span>
                <div>
                  <strong>Let</strong> variables represent unknowns - Choose letters for what you're finding
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-orange-600 text-xl">V</span>
                <div>
                  <strong>Verify</strong> by writing equations - Translate words into math
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-600 text-xl">E</span>
                <div>
                  <strong>Evaluate</strong> and check - Solve the equation and verify your answer
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'age-problem-example',
      type: 'example',
      title: 'Age Problems',
      content: (
        <div className="space-y-4">
          <p>Age problems are classic algebra applications. Let's solve one step by step:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-blue-100 p-3 rounded mb-3">
              <p className="font-medium">Problem:</p>
              <p className="text-sm">Sarah is 3 years older than her brother Tom. In 5 years, Sarah will be twice as old as Tom is now. How old are they currently?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 1: Define variables</p>
                <p className="text-sm">Let t = Tom's current age</p>
                <p className="text-sm">Then Sarah's current age = t + 3</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 2: Set up the equation</p>
                <p className="text-sm">Sarah's age in 5 years = 2 × Tom's current age</p>
                <p className="text-sm">(t + 3) + 5 = 2t</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 3: Solve</p>
                <div className="text-sm space-y-1">
                  <p>t + 8 = 2t</p>
                  <p>8 = t</p>
                  <p><strong>Tom is 8, Sarah is 11</strong></p>
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 4: Check</p>
                <p className="text-sm">In 5 years: Sarah will be 16, Tom is currently 8. 16 = 2 × 8 ✓</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'distance-rate-time',
      type: 'example',
      title: 'Distance, Rate, and Time Problems',
      content: (
        <div className="space-y-4">
          <p>Motion problems use the fundamental relationship: Distance = Rate × Time</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">🚗 Motion Formula</h3>
            <div className="font-mono text-xl bg-white p-3 rounded text-center">
              d = rt
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-orange-100 p-3 rounded mb-3">
              <p className="font-medium">Problem:</p>
              <p className="text-sm">Two cars start from the same point and drive in opposite directions. Car A travels at 60 mph and Car B at 80 mph. After how many hours will they be 350 miles apart?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Analysis</p>
                <p className="text-sm">Let t = time in hours</p>
                <p className="text-sm">Car A travels: 60t miles</p>
                <p className="text-sm">Car B travels: 80t miles</p>
                <p className="text-sm">Total distance apart: 60t + 80t = 140t</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Equation and Solution</p>
                <div className="text-sm space-y-1">
                  <p>140t = 350</p>
                  <p>t = 350 ÷ 140 = 2.5 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'mixture-problems',
      type: 'example',
      title: 'Mixture Problems',
      content: (
        <div className="space-y-4">
          <p>Mixture problems involve combining different concentrations or values.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-green-100 p-3 rounded mb-3">
              <p className="font-medium">Problem:</p>
              <p className="text-sm">A coffee shop mixes premium coffee ($12/lb) with regular coffee ($8/lb) to create 20 pounds of blend selling for $10/lb. How many pounds of each type are needed?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Set up variables and equations</p>
                <p className="text-sm">Let p = pounds of premium coffee</p>
                <p className="text-sm">Then (20 - p) = pounds of regular coffee</p>
                <p className="text-sm">Value equation: 12p + 8(20 - p) = 10(20)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Solve</p>
                <div className="text-sm space-y-1">
                  <p>12p + 160 - 8p = 200</p>
                  <p>4p = 40</p>
                  <p>p = 10</p>
                  <p><strong>10 lbs premium, 10 lbs regular</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'geometry-applications',
      type: 'example',
      title: 'Geometry Applications',
      content: (
        <div className="space-y-4">
          <p>Algebra helps solve geometric problems involving area, perimeter, and relationships between shapes.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-blue-100 p-3 rounded mb-3">
              <p className="font-medium">Problem:</p>
              <p className="text-sm">A rectangular garden has a length that is 4 feet more than twice its width. If the perimeter is 44 feet, what are the dimensions?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Define variables and relationships</p>
                <p className="text-sm">Let w = width</p>
                <p className="text-sm">Then length = 2w + 4</p>
                <p className="text-sm">Perimeter = 2(length + width)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Set up and solve equation</p>
                <div className="text-sm space-y-1">
                  <p>2(w + (2w + 4)) = 44</p>
                  <p>2(3w + 4) = 44</p>
                  <p>6w + 8 = 44</p>
                  <p>6w = 36</p>
                  <p>w = 6 feet</p>
                  <p><strong>Width: 6 feet, Length: 16 feet</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'business-applications',
      type: 'example',
      title: 'Business and Finance Applications',
      content: (
        <div className="space-y-4">
          <p>Algebra is essential in business for profit calculations, break-even analysis, and financial planning.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-purple-100 p-3 rounded mb-3">
              <p className="font-medium">Problem:</p>
              <p className="text-sm">A company's profit P (in dollars) from selling x items is given by P = 15x - 200. How many items must be sold to make a $1000 profit?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Substitute and solve</p>
                <div className="text-sm space-y-1">
                  <p>1000 = 15x - 200</p>
                  <p>1200 = 15x</p>
                  <p>x = 80</p>
                  <p><strong>Must sell 80 items</strong></p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💰 Other Business Applications</h4>
              <ul className="text-sm space-y-1">
                <li>• Break-even analysis</li>
                <li>• Interest calculations</li>
                <li>• Supply and demand</li>
                <li>• Cost optimization</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📊 Financial Formulas</h4>
              <ul className="text-sm space-y-1">
                <li>• Simple Interest: I = Prt</li>
                <li>• Compound Interest: A = P(1+r)ᵗ</li>
                <li>• Profit = Revenue - Cost</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'science-applications',
      type: 'example',
      title: 'Science and Engineering Applications',
      content: (
        <div className="space-y-4">
          <p>Algebra is fundamental to all sciences, from physics formulas to chemistry equations.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">⚡ Physics Examples</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Ohm's Law:</strong> V = IR</li>
                <li><strong>Kinetic Energy:</strong> KE = ½mv²</li>
                <li><strong>Force:</strong> F = ma</li>
                <li><strong>Projectile Motion:</strong> h = -16t² + v₀t + h₀</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">🧪 Chemistry Examples</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Ideal Gas Law:</strong> PV = nRT</li>
                <li><strong>Molarity:</strong> M = n/V</li>
                <li><strong>Rate Laws:</strong> Rate = k[A]ⁿ</li>
                <li><strong>pH:</strong> pH = -log[H⁺]</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-yellow-100 p-3 rounded mb-3">
              <p className="font-medium">Example Problem:</p>
              <p className="text-sm">An object is thrown upward with initial velocity 48 ft/s from a height of 6 feet. The height h after t seconds is h = -16t² + 48t + 6. When will the object hit the ground?</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-medium">Solution:</p>
              <div className="text-sm space-y-1">
                <p>Set h = 0: -16t² + 48t + 6 = 0</p>
                <p>Using quadratic formula: t ≈ 3.12 seconds</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'formula-manipulation',
      type: 'concept',
      title: 'Working with Formulas',
      content: (
        <div className="space-y-4">
          <p>Often you need to rearrange formulas to solve for different variables. This is called <strong>solving for a specified variable</strong>.</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🔄 Formula Rearrangement Steps</h3>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 1: Treat the desired variable as the unknown</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 2: Treat all other variables as constants</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 3: Use inverse operations to isolate the variable</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example: Solve A = πr² for r</h4>
            <div className="text-sm space-y-1">
              <p>A = πr²</p>
              <p>A/π = r²  (divide both sides by π)</p>
              <p>√(A/π) = r  (take square root of both sides)</p>
              <p><strong>r = √(A/π)</strong></p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'complex-problem-solving',
      type: 'practice',
      title: 'Complex Problem Solving',
      content: (
        <div className="space-y-4">
          <p>Let's tackle a multi-step problem that combines several concepts:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-red-100 p-3 rounded mb-3">
              <p className="font-medium">Challenge Problem:</p>
              <p className="text-sm">A rectangular swimming pool is surrounded by a concrete walkway of uniform width. The pool itself is 20 feet by 30 feet. If the total area (pool + walkway) is 1000 square feet, what is the width of the walkway?</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Setup</p>
                <p className="text-sm">Let w = width of walkway</p>
                <p className="text-sm">Total dimensions: (20 + 2w) by (30 + 2w)</p>
                <p className="text-sm">Total area: (20 + 2w)(30 + 2w) = 1000</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Solve</p>
                <div className="text-sm space-y-1">
                  <p>600 + 40w + 60w + 4w² = 1000</p>
                  <p>4w² + 100w + 600 = 1000</p>
                  <p>4w² + 100w - 400 = 0</p>
                  <p>w² + 25w - 100 = 0</p>
                  <p>Using quadratic formula: w = 3.66 feet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'technology-applications',
      type: 'concept',
      title: 'Algebra in Technology',
      content: (
        <div className="space-y-4">
          <p>Modern technology relies heavily on algebraic concepts and mathematical modeling.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">💻 Computer Science</h3>
              <ul className="text-sm space-y-2">
              <li>• Algorithm complexity: O(n²)</li>
                <li>• Computer graphics transformations</li>
                <li>• Data analysis and machine learning</li>
                <li>• Encryption and security</li>
              </ul>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">📱 Engineering Applications</h3>
              <ul className="text-sm space-y-2">
                <li>• Signal processing</li>
                <li>• Control systems</li>
                <li>• Network optimization</li>
                <li>• 3D modeling and CAD</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🌍 Real-World Impact</h4>
            <p className="text-sm">Algebra powers GPS navigation, search engines, social media algorithms, financial modeling, climate prediction, medical imaging, and countless other technologies we use daily.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: "Course Completion: You're an Algebra Master!",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 CONGRATULATIONS! You've completed the Interactive Algebra Course!</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🏆 You've Mastered:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ Variables, constants, and algebraic expressions</li>
                <li>✅ Combining like terms and distributive property</li>
                <li>✅ Solving linear and quadratic equations</li>
                <li>✅ Graphing linear equations and understanding parabolas</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Systems of equations with multiple methods</li>
                <li>✅ Real-world problem-solving strategies</li>
                <li>✅ Applications in science, business, and technology</li>
                <li>✅ Mathematical modeling and formula manipulation</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🚀 Where to Go Next</h4>
            <p className="text-sm">You're now ready for advanced mathematics like trigonometry, statistics, calculus, or specialized applications in your field of interest. The problem-solving skills you've developed will serve you throughout your academic and professional journey.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Keep Practicing!</h4>
            <p className="text-sm">Mathematics is like a language - the more you use it, the more fluent you become. Look for algebraic relationships in your daily life and keep challenging yourself with new problems.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">🌟 You're Now an Algebra Expert!</h4>
            <p className="text-sm">Share your knowledge, help others learn, and remember: every expert was once a beginner. You've come incredibly far!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};

interface AlgebraApplicationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraApplicationsMicroLesson: React.FC<AlgebraApplicationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraApplicationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};