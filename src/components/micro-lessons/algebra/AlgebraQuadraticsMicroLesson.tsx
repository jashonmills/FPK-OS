import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraQuadraticsData: MicroLessonData = {
  id: 'algebra-quadratics',
  moduleTitle: 'Quadratic Equations',
  totalScreens: 11,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Introduction to Quadratic Equations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to quadratic equations! These are equations where the highest power of the variable is 2.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What makes an equation quadratic</li>
              <li>Standard form of quadratic equations</li>
              <li>Solving by factoring</li>
              <li>Using the quadratic formula</li>
              <li>Graphing parabolas</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'quadratic-definition',
      type: 'concept',
      title: 'What Are Quadratic Equations?',
      content: (
        <div className="space-y-4">
          <p>A <strong>quadratic equation</strong> is an equation where the highest power of the variable is 2 (squared).</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📐 Standard Form</h3>
            <div className="font-mono text-2xl bg-white p-4 rounded text-center">
              ax² + bx + c = 0
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium">a ≠ 0</p>
                <p className="text-sm">Coefficient of x²</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium">b</p>
                <p className="text-sm">Coefficient of x</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium">c</p>
                <p className="text-sm">Constant term</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded">
              <h4 className="font-semibold text-green-700">✅ Quadratic Examples:</h4>
              <ul className="text-sm space-y-1">
                <li>• x² + 5x + 6 = 0</li>
                <li>• 2x² - 3x - 1 = 0</li>
                <li>• x² - 9 = 0</li>
                <li>• 3x² + x = 0</li>
              </ul>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <h4 className="font-semibold text-red-700">❌ Not Quadratic:</h4>
              <ul className="text-sm space-y-1">
                <li>• 3x + 5 = 0 (degree 1)</li>
                <li>• x³ + 2x = 0 (degree 3)</li>
                <li>• 5 = 0 (degree 0)</li>
                <li>• √x + 1 = 0 (not polynomial)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'factoring-introduction',
      type: 'concept',
      title: 'Solving by Factoring',
      content: (
        <div className="space-y-4">
          <p>One way to solve quadratic equations is by <strong>factoring</strong> - breaking the expression into simpler parts.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🧩 Zero Product Property</h3>
            <div className="bg-white p-3 rounded text-center mb-3">
              <p className="font-mono text-lg">If A × B = 0, then A = 0 or B = 0</p>
            </div>
            <p className="text-sm text-center">If the product of two factors equals zero, at least one factor must be zero</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📝 Factoring Steps:</h3>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 1: Set equation = 0</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 2: Factor the quadratic</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 3: Set each factor = 0</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-medium">Step 4: Solve for x</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'factoring-example',
      type: 'example',
      title: 'Factoring Example',
      content: (
        <div className="space-y-4">
          <p>Let's solve a quadratic equation by factoring:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: x² + 5x + 6 = 0</h3>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Find two numbers that multiply to 6 and add to 5</p>
                <p className="text-sm">Think: ? × ? = 6 and ? + ? = 5</p>
                <p className="text-sm">Answer: 2 and 3 (because 2 × 3 = 6 and 2 + 3 = 5)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 2: Factor the quadratic</p>
                <p className="text-sm">x² + 5x + 6 = (x + 2)(x + 3)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 3: Set each factor equal to 0</p>
                <div className="text-sm space-y-1">
                  <p>x + 2 = 0  or  x + 3 = 0</p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 4: Solve for x</p>
                <div className="text-sm space-y-1">
                  <p>x = -2  or  x = -3</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">✅ Solutions: x = -2 or x = -3</h4>
            <p className="text-sm">Check: (-2)² + 5(-2) + 6 = 4 - 10 + 6 = 0 ✓</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'factoring-patterns',
      type: 'concept',
      title: 'Common Factoring Patterns',
      content: (
        <div className="space-y-4">
          <p>Learn these common patterns to factor quadratics more easily:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">🔺 Perfect Square Trinomials</h3>
              <div className="space-y-2 text-sm">
                <p className="font-mono">x² + 2ax + a² = (x + a)²</p>
                <p className="font-mono">x² - 2ax + a² = (x - a)²</p>
                <p><strong>Example:</strong> x² + 6x + 9 = (x + 3)²</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">➖ Difference of Squares</h3>
              <div className="space-y-2 text-sm">
                <p className="font-mono">x² - a² = (x + a)(x - a)</p>
                <p><strong>Example:</strong> x² - 16 = (x + 4)(x - 4)</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🔢 General Trinomial: ax² + bx + c</h3>
            <p className="text-sm mb-2">Find two numbers that:</p>
            <ul className="text-sm space-y-1">
              <li>• Multiply to give <strong>a × c</strong></li>
              <li>• Add to give <strong>b</strong></li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'quadratic-formula',
      type: 'concept',
      title: 'The Quadratic Formula',
      content: (
        <div className="space-y-4">
          <p>When factoring is difficult or impossible, we can use the <strong>quadratic formula</strong> to solve any quadratic equation.</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">🧮 The Quadratic Formula</h3>
            <div className="font-mono text-xl bg-white p-4 rounded text-center">
              x = (-b ± √(b² - 4ac)) / (2a)
            </div>
            <p className="text-sm text-center mt-2">For equations in the form ax² + bx + c = 0</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📊 The Discriminant: b² - 4ac</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium text-green-700">b² - 4ac &gt; 0</p>
                <p className="text-xs">Two real solutions</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium text-blue-700">b² - 4ac = 0</p>
                <p className="text-xs">One real solution</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium text-red-700">b² - 4ac &lt; 0</p>
                <p className="text-xs">No real solutions</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'quadratic-formula-example',
      type: 'example',
      title: 'Using the Quadratic Formula',
      content: (
        <div className="space-y-4">
          <p>Let's use the quadratic formula to solve an equation:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Solve: 2x² + 3x - 1 = 0</h3>
            <div className="space-y-3">
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 1: Identify a, b, and c</p>
                <p className="text-sm">a = 2, b = 3, c = -1</p>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 2: Calculate the discriminant</p>
                <p className="text-sm">b² - 4ac = 3² - 4(2)(-1) = 9 + 8 = 17</p>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 3: Apply the quadratic formula</p>
                <div className="text-sm space-y-1">
                  <p>x = (-3 ± √17) / (2×2)</p>
                  <p>x = (-3 ± √17) / 4</p>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="font-medium">Step 4: Find both solutions</p>
                <div className="text-sm space-y-1">
                  <p>x₁ = (-3 + √17) / 4 ≈ 0.28</p>
                  <p>x₂ = (-3 - √17) / 4 ≈ -1.78</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'parabolas-intro',
      type: 'concept',
      title: 'Graphing Quadratics: Parabolas',
      content: (
        <div className="space-y-4">
          <p>The graph of a quadratic equation is called a <strong>parabola</strong> - a U-shaped curve.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">📈 Parabola Features</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Vertex:</strong> Highest or lowest point</li>
                <li>• <strong>Axis of symmetry:</strong> Vertical line through vertex</li>
                <li>• <strong>Y-intercept:</strong> Where parabola crosses y-axis</li>
                <li>• <strong>X-intercepts:</strong> Where parabola crosses x-axis (solutions!)</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">🔄 Parabola Direction</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <p><strong>a &gt; 0:</strong> Opens upward (smiles)</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p><strong>a &lt; 0:</strong> Opens downward (frowns)</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p><strong>|a| large:</strong> Narrow parabola</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p><strong>|a| small:</strong> Wide parabola</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'vertex-form',
      type: 'concept',
      title: 'Vertex Form of Quadratics',
      content: (
        <div className="space-y-4">
          <p>The <strong>vertex form</strong> makes it easy to identify the vertex of a parabola.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📍 Vertex Form</h3>
            <div className="font-mono text-xl bg-white p-4 rounded text-center mb-3">
              y = a(x - h)² + k
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium">Vertex: (h, k)</p>
                <p className="text-sm">The turning point</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="font-medium">a determines shape</p>
                <p className="text-sm">Direction and width</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Example:</h3>
            <p className="text-sm">y = 2(x - 3)² + 1 has vertex at (3, 1)</p>
            <p className="text-sm">Opens upward because a = 2 > 0</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'quadratics-practice',
      type: 'practice',
      title: 'Practice: Solving Quadratics',
      content: (
        <div className="space-y-4">
          <p>Practice solving these quadratic equations:</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Problem 1: x² - 4 = 0 (Difference of squares)</h4>
              <div className="text-sm space-y-1">
                <p>Factor: (x + 2)(x - 2) = 0</p>
                <p><strong>Solutions: x = 2 or x = -2</strong></p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Problem 2: x² + 7x + 12 = 0 (Factoring)</h4>
              <div className="text-sm space-y-1">
                <p>Find numbers that multiply to 12 and add to 7: 3 and 4</p>
                <p>Factor: (x + 3)(x + 4) = 0</p>
                <p><strong>Solutions: x = -3 or x = -4</strong></p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Problem 3: x² + 2x - 2 = 0 (Quadratic formula)</h4>
              <div className="text-sm space-y-1">
                <p>a = 1, b = 2, c = -2</p>
                <p>x = (-2 ± √(4 + 8))/2 = (-2 ± √12)/2</p>
                <p><strong>Solutions: x = -1 ± √3</strong></p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Excellent! You've conquered quadratic equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Quadratics have the form ax² + bx + c = 0 (highest power is 2)</li>
              <li>✅ Solve by factoring using the zero product property</li>
              <li>✅ Use the quadratic formula when factoring is difficult</li>
              <li>✅ Graphs of quadratics are parabolas (U-shaped curves)</li>
              <li>✅ Vertex form y = a(x - h)² + k shows the vertex clearly</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Advanced Applications</h4>
            <p className="text-sm">In our final lesson, you'll apply all your algebra skills to solve complex real-world problems and advanced applications.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Look for parabolic shapes in real life - projectile motion, satellite dishes, bridge arches. They're everywhere!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface AlgebraQuadraticsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraQuadraticsMicroLesson: React.FC<AlgebraQuadraticsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraQuadraticsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};