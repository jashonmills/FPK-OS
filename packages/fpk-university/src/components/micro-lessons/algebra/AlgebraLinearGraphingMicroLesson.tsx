import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const algebraLinearGraphingData: MicroLessonData = {
  id: 'algebra-linear-graphing',
  moduleTitle: 'Linear Equations and Graphing',
  totalScreens: 12,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Introduction to Graphing',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to the visual side of algebra! Graphing helps us see mathematical relationships and solve problems visually.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Understanding the coordinate plane</li>
              <li>Plotting points and reading coordinates</li>
              <li>Graphing linear equations</li>
              <li>Understanding slope and y-intercept</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'coordinate-plane',
      type: 'concept',
      title: 'The Coordinate Plane',
      content: (
        <div className="space-y-4">
          <p>The <strong>coordinate plane</strong> is like a map for mathematics. It has two number lines that cross at right angles.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📍 Parts of the Coordinate Plane:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Axes:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>x-axis:</strong> horizontal line</li>
                  <li>• <strong>y-axis:</strong> vertical line</li>
                  <li>• <strong>Origin:</strong> where axes meet (0,0)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quadrants:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>I:</strong> (+x, +y) top right</li>
                  <li>• <strong>II:</strong> (-x, +y) top left</li>
                  <li>• <strong>III:</strong> (-x, -y) bottom left</li>
                  <li>• <strong>IV:</strong> (+x, -y) bottom right</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'plotting-points',
      type: 'concept',
      title: 'Plotting Points',
      content: (
        <div className="space-y-4">
          <p>Every point on the coordinate plane has an address called <strong>coordinates</strong>, written as (x, y).</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📍 How to Plot Points:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 1: Start at the origin (0, 0)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 2: Move right (positive) or left (negative) along x-axis</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 3: Move up (positive) or down (negative) along y-axis</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Step 4: Mark the point</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example:</h4>
            <p className="text-sm">To plot (3, -2): Start at origin, move 3 right, then 2 down</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'coordinate-examples',
      type: 'example',
      title: 'Reading and Writing Coordinates',
      content: (
        <div className="space-y-4">
          <p>Let's practice reading and writing coordinates:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Example Points:</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>A(2, 3):</strong> 2 right, 3 up</li>
                <li><strong>B(-1, 4):</strong> 1 left, 4 up</li>
                <li><strong>C(-3, -2):</strong> 3 left, 2 down</li>
                <li><strong>D(4, -1):</strong> 4 right, 1 down</li>
                <li><strong>E(0, 5):</strong> on y-axis, 5 up</li>
                <li><strong>F(-2, 0):</strong> on x-axis, 2 left</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Memory Tips:</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>x first, y second</strong> - "x comes before y in alphabet"</li>
                <li>• <strong>x is horizontal</strong> - "x marks the spot left-right"</li>
                <li>• <strong>y is vertical</strong> - "y reaches up to the sky"</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'linear-equations-intro',
      type: 'concept',
      title: 'Introduction to Linear Equations',
      content: (
        <div className="space-y-4">
          <p>A <strong>linear equation</strong> creates a straight line when graphed. The most common form is y = mx + b.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📐 Linear Equation Form</h3>
            <div className="text-center font-mono text-2xl bg-white p-4 rounded">
              y = mx + b
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">m = slope</p>
                <p className="text-sm">How steep the line is</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">b = y-intercept</p>
                <p className="text-sm">Where line crosses y-axis</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'slope-concept',
      type: 'concept',
      title: 'Understanding Slope',
      content: (
        <div className="space-y-4">
          <p><strong>Slope</strong> measures how steep a line is. It's the ratio of rise over run.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">📈 Slope Formula</h3>
            <div className="text-center font-mono text-xl bg-white p-3 rounded mb-3">
              slope = rise/run = (y₂ - y₁)/(x₂ - x₁)
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded">
              <h4 className="font-semibold text-green-700">Positive Slope</h4>
              <ul className="text-sm space-y-1">
                <li>• Line goes up left to right</li>
                <li>• As x increases, y increases</li>
                <li>• Example: slope = 2</li>
              </ul>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <h4 className="font-semibold text-red-700">Negative Slope</h4>
              <ul className="text-sm space-y-1">
                <li>• Line goes down left to right</li>
                <li>• As x increases, y decreases</li>
                <li>• Example: slope = -3</li>
              </ul>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <h4 className="font-semibold text-gray-700">Zero Slope</h4>
              <ul className="text-sm space-y-1">
                <li>• Horizontal line</li>
                <li>• y stays the same</li>
                <li>• Example: slope = 0</li>
              </ul>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <h4 className="font-semibold text-yellow-700">Undefined Slope</h4>
              <ul className="text-sm space-y-1">
                <li>• Vertical line</li>
                <li>• x stays the same</li>
                <li>• Division by zero</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'y-intercept-concept',
      type: 'concept',
      title: 'Understanding Y-Intercept',
      content: (
        <div className="space-y-4">
          <p>The <strong>y-intercept</strong> is where the line crosses the y-axis. At this point, x = 0.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🎯 Finding Y-Intercept:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Method 1: From equation y = mx + b</p>
                <p className="text-sm">The y-intercept is b</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Method 2: From graph</p>
                <p className="text-sm">Look where line crosses y-axis</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Method 3: Substitute x = 0</p>
                <p className="text-sm">Replace x with 0 and solve for y</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Examples:</h4>
            <ul className="text-sm space-y-1">
              <li>• y = 2x + 3 → y-intercept is 3</li>
              <li>• y = -x + 5 → y-intercept is 5</li>
              <li>• y = 4x - 1 → y-intercept is -1</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'graphing-linear-equations',
      type: 'example',
      title: 'Graphing Linear Equations',
      content: (
        <div className="space-y-4">
          <p>Let's learn how to graph a linear equation step by step.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-center">Graph: y = 2x + 1</h3>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Identify slope and y-intercept</p>
                <p className="text-sm">Slope (m) = 2, Y-intercept (b) = 1</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 2: Plot y-intercept</p>
                <p className="text-sm">Start at point (0, 1) on y-axis</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 3: Use slope to find next point</p>
                <p className="text-sm">From (0, 1): rise 2, run 1 → go to (1, 3)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 4: Connect points with straight line</p>
                <p className="text-sm">Draw line through (0, 1) and (1, 3)</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'graphing-practice',
      type: 'practice',
      title: 'Practice: Graphing Linear Equations',
      content: (
        <div className="space-y-4">
          <p>Practice identifying slope and y-intercept for these equations:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Equation 1: y = 3x + 2</h4>
              <p className="text-sm mt-2">Slope = <strong>3</strong>, Y-intercept = <strong>2</strong></p>
              <p className="text-xs">Points: Start at (0, 2), then up 3, right 1 to (1, 5)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Equation 2: y = -x + 4</h4>
              <p className="text-sm mt-2">Slope = <strong>-1</strong>, Y-intercept = <strong>4</strong></p>
              <p className="text-xs">Points: Start at (0, 4), then down 1, right 1 to (1, 3)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Equation 3: y = (1/2)x - 1</h4>
              <p className="text-sm mt-2">Slope = <strong>1/2</strong>, Y-intercept = <strong>-1</strong></p>
              <p className="text-xs">Points: Start at (0, -1), then up 1, right 2 to (2, 0)</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'finding-equations',
      type: 'example',
      title: 'Finding Equations from Graphs',
      content: (
        <div className="space-y-4">
          <p>Sometimes we need to find the equation when we have the graph or two points.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🔍 Method: Two Points to Equation</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-medium">Given points: (1, 3) and (3, 7)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 1: Find slope</p>
                <p className="text-sm">m = (7-3)/(3-1) = 4/2 = 2</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 2: Use point-slope form</p>
                <p className="text-sm">y - y₁ = m(x - x₁)</p>
                <p className="text-sm">y - 3 = 2(x - 1)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-medium">Step 3: Solve for y</p>
                <p className="text-sm">y - 3 = 2x - 2</p>
                <p className="text-sm"><strong>y = 2x + 1</strong></p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'real-world-applications',
      type: 'example',
      title: 'Real-World Linear Applications',
      content: (
        <div className="space-y-4">
          <p>Linear equations appear everywhere in real life!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🚗 Distance vs Time</h3>
              <p className="text-sm mb-2">Car traveling at 60 mph:</p>
              <p className="font-mono text-center bg-white p-2 rounded">d = 60t</p>
              <p className="text-xs">Distance = 60 × time</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💰 Cost vs Items</h3>
              <p className="text-sm mb-2">Pizza costs $12 + $2 per topping:</p>
              <p className="font-mono text-center bg-white p-2 rounded">C = 2t + 12</p>
              <p className="text-xs">Cost = 2 × toppings + 12</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📱 Phone Plans</h3>
              <p className="text-sm mb-2">$30 base + $0.10 per minute:</p>
              <p className="font-mono text-center bg-white p-2 rounded">C = 0.1m + 30</p>
              <p className="text-xs">Cost = 0.1 × minutes + 30</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🌡️ Temperature</h3>
              <p className="text-sm mb-2">Fahrenheit to Celsius:</p>
              <p className="font-mono text-center bg-white p-2 rounded">C = (5/9)(F-32)</p>
              <p className="text-xs">Linear relationship</p>
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
          <h2 className="text-xl font-bold">Amazing! You've mastered linear equations and graphing!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Coordinate plane has x and y axes that cross at origin</li>
              <li>✅ Points are written as (x, y) coordinates</li>
              <li>✅ Linear equations form: y = mx + b</li>
              <li>✅ Slope (m) shows steepness; y-intercept (b) shows where line crosses y-axis</li>
              <li>✅ Linear equations model many real-world relationships</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Systems of Equations</h4>
            <p className="text-sm">In our next lesson, you'll learn how to solve problems involving two equations with two variables.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Practice Challenge</h4>
            <p className="text-sm">Find real-world situations around you that could be modeled with linear equations. Graph them!</p>
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

interface AlgebraLinearGraphingMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const AlgebraLinearGraphingMicroLesson: React.FC<AlgebraLinearGraphingMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={algebraLinearGraphingData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};