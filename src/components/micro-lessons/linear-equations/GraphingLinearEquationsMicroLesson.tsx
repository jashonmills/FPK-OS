import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const graphingLinearEquationsData: MicroLessonData = {
  id: 'graphing-linear-equations',
  moduleTitle: 'Graphing Linear Equations',
  totalScreens: 16,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'From Equations to Graphs',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Discover the geometric meaning of linear equations and learn to create their visual representations!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>How equations become straight lines on graphs</li>
              <li>Understanding slope and y-intercept</li>
              <li>Finding x and y intercepts</li>
              <li>Different forms of linear equations for graphing</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">📈</div>
            <p className="text-sm text-muted-foreground">Every equation tells a visual story</p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'equation-to-graph',
      type: 'concept',
      title: 'From Equation to Graph',
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-foreground leading-relaxed mb-3">
              Every linear equation creates a <strong>straight line</strong> when graphed on a coordinate plane. 
              This line represents all the solutions to the equation.
            </p>
            <div className="bg-white/60 p-3 rounded text-center">
              <p className="font-mono text-lg">Standard Form: y = mx + b</p>
              <p className="text-sm text-muted-foreground mt-1">
                where m = slope, b = y-intercept
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Why Graph Equations?</h4>
            <ul className="text-sm space-y-1">
              <li>• Visualize relationships between variables</li>
              <li>• Predict values and trends</li>
              <li>• Compare different equations</li>
              <li>• Solve problems graphically</li>
            </ul>
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
          <p><strong>Slope (m)</strong> measures how steep a line is and which direction it goes.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">Definition</h4>
                <p className="text-sm mb-2">Slope = Rise over Run</p>
                <p className="font-mono text-center">m = (y₂ - y₁)/(x₂ - x₁)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700">Positive Slope</h4>
                <p className="text-sm">Line goes up from left to right ↗</p>
                <p className="text-xs">Example: m = 2</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700">Negative Slope</h4>
                <p className="text-sm">Line goes down from left to right ↘</p>
                <p className="text-xs">Example: m = -3</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-700">Zero Slope</h4>
                <p className="text-sm">Horizontal line →</p>
                <p className="text-xs">Example: m = 0</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'y-intercept-concept',
      type: 'concept',
      title: 'Understanding Y-Intercept',
      content: (
        <div className="space-y-4">
          <p><strong>Y-intercept (b)</strong> is where the line crosses the y-axis.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Facts about Y-Intercept:</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Location:</strong> Always at point (0, b)</li>
              <li><strong>To find:</strong> Set x = 0 in the equation and solve for y</li>
              <li><strong>Starting point:</strong> Begin graphing here</li>
              <li><strong>In y = mx + b:</strong> The b value is the y-intercept</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Examples:</h4>
            <div className="space-y-1 text-sm">
              <p>• y = 2x + 3 → y-intercept is 3 (point: (0, 3))</p>
              <p>• y = -x + 5 → y-intercept is 5 (point: (0, 5))</p>
              <p>• y = 4x → y-intercept is 0 (point: (0, 0))</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'graphing-example1-setup',
      type: 'example',
      title: 'Example 1 Setup: y = 2x + 3',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's graph this equation step by step:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="bg-white/60 p-3 rounded mb-4">
              <p className="text-center font-mono text-xl">y = 2x + 3</p>
            </div>
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p><strong>Identify the parts:</strong></p>
                <p className="ml-4">Slope (m) = 2</p>
                <p className="ml-4">Y-intercept (b) = 3</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p><strong>What this means:</strong></p>
                <p className="text-sm ml-4">• Start at point (0, 3)</p>
                <p className="text-sm ml-4">• For every 1 unit right, go up 2 units</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'graphing-example1-solution',
      type: 'example',
      title: 'Example 1 Solution: Graphing y = 2x + 3',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 1:</strong> Plot the y-intercept</p>
              <p className="ml-4">Point: (0, 3)</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 2:</strong> Use the slope to find another point</p>
              <p className="ml-4">From (0, 3): go right 1, up 2 → (1, 5)</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 3:</strong> Find a third point for accuracy</p>
              <p className="ml-4">From (1, 5): go right 1, up 2 → (2, 7)</p>
            </div>
            <div className="bg-white/60 p-3 rounded">
              <p><strong>Step 4:</strong> Draw a line through the points</p>
              <p className="ml-4">The line extends infinitely in both directions</p>
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg text-center">
            <div className="text-8xl mb-2">📈</div>
            <p className="text-sm text-muted-foreground">Line with positive slope going up</p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'intercepts-concept',
      type: 'concept',
      title: 'Finding X and Y Intercepts',
      content: (
        <div className="space-y-4">
          <p>Intercepts are where the line crosses the axes - they're very useful for graphing!</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-700">X-Intercept</h4>
              <p className="text-sm text-muted-foreground mb-2">Where the line crosses the x-axis</p>
              <ul className="text-sm space-y-1">
                <li><strong>Method:</strong> Set y = 0 and solve for x</li>
                <li><strong>Form:</strong> (x, 0)</li>
                <li><strong>Meaning:</strong> y-value is zero</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-700">Y-Intercept</h4>
              <p className="text-sm text-muted-foreground mb-2">Where the line crosses the y-axis</p>
              <ul className="text-sm space-y-1">
                <li><strong>Method:</strong> Set x = 0 and solve for y</li>
                <li><strong>Form:</strong> (0, y)</li>
                <li><strong>Meaning:</strong> x-value is zero</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Graphing Tip</h4>
            <p className="text-sm">Finding both intercepts gives you two points to draw your line!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'intercepts-example',
      type: 'example',
      title: 'Example 2: Find intercepts of 3x + 2y = 12',
      content: (
        <div className="space-y-4">
          <p className="font-medium">Let's find both intercepts to graph this equation:</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700">Finding X-Intercept:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Set y = 0:</strong></p>
                <p>3x + 2(0) = 12</p>
                <p>3x = 12</p>
                <p>x = 4</p>
                <p className="font-medium">X-intercept: (4, 0)</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700">Finding Y-Intercept:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Set x = 0:</strong></p>
                <p>3(0) + 2y = 12</p>
                <p>2y = 12</p>
                <p>y = 6</p>
                <p className="font-medium">Y-intercept: (0, 6)</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 p-3 rounded">
            <p><strong>To Graph:</strong> Plot points (4, 0) and (0, 6), then draw a line through them</p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'equation-forms',
      type: 'concept',
      title: 'Forms of Linear Equations',
      content: (
        <div className="space-y-4">
          <p>Different forms of linear equations are useful for different purposes:</p>
          <div className="grid gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">Slope-Intercept Form</h4>
              <p className="font-mono text-lg">y = mx + b</p>
              <p className="text-sm text-muted-foreground">✅ Easy to identify slope and y-intercept</p>
              <p className="text-sm text-muted-foreground">✅ Best for graphing with slope</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">Standard Form</h4>
              <p className="font-mono text-lg">Ax + By = C</p>
              <p className="text-sm text-muted-foreground">✅ Easy to find x and y intercepts</p>
              <p className="text-sm text-muted-foreground">✅ Good for integer solutions</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">Point-Slope Form</h4>
              <p className="font-mono text-lg">y - y₁ = m(x - x₁)</p>
              <p className="text-sm text-muted-foreground">✅ Useful when you know slope and one point</p>
              <p className="text-sm text-muted-foreground">✅ Great for writing equations</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practice-graphing',
      type: 'practice',
      title: 'Practice: Graphing Equations',
      content: (
        <div className="space-y-4">
          <p>Practice identifying key information for graphing:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 1: y = -x + 4</h4>
              <p className="text-sm text-gray-600 mt-2">Slope: -1, Y-intercept: 4</p>
              <p className="text-xs text-gray-500">Start at (0, 4), go right 1 and down 1</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 2: 2x + y = 6</h4>
              <p className="text-sm text-gray-600 mt-2">X-intercept: (3, 0), Y-intercept: (0, 6)</p>
              <p className="text-xs text-gray-500">Plot both intercepts and draw line</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Problem 3: y = 3x</h4>
              <p className="text-sm text-gray-600 mt-2">Slope: 3, Y-intercept: 0</p>
              <p className="text-xs text-gray-500">Line passes through origin (0, 0)</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'negative-slopes',
      type: 'concept',
      title: 'Working with Negative Slopes',
      content: (
        <div className="space-y-4">
          <p>Negative slopes create lines that go down from left to right:</p>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-red-700">Example: y = -2x + 5</h3>
            <div className="space-y-2">
              <p><strong>Slope:</strong> -2 (down 2, right 1)</p>
              <p><strong>Y-intercept:</strong> 5 (start at (0, 5))</p>
              <p><strong>Next point:</strong> From (0, 5) → right 1, down 2 → (1, 3)</p>
              <p><strong>Third point:</strong> From (1, 3) → right 1, down 2 → (2, 1)</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Alternative Method</h4>
            <p className="text-sm">You can also think of -2 as "up 2, left 1" if that's easier to visualize!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'horizontal-vertical-lines',
      type: 'concept',
      title: 'Special Cases: Horizontal and Vertical Lines',
      content: (
        <div className="space-y-4">
          <p>Some linear equations create horizontal or vertical lines:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">Horizontal Lines</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Form:</strong> y = b (constant)</li>
                <li><strong>Slope:</strong> 0</li>
                <li><strong>Example:</strong> y = 3</li>
                <li><strong>Graph:</strong> Horizontal line through (0, 3)</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700">Vertical Lines</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Form:</strong> x = a (constant)</li>
                <li><strong>Slope:</strong> Undefined</li>
                <li><strong>Example:</strong> x = -2</li>
                <li><strong>Graph:</strong> Vertical line through (-2, 0)</li>
              </ul>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🔍 Remember</h4>
            <p className="text-sm">Horizontal lines have equations with only y, vertical lines have equations with only x!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'graphing-tips',
      type: 'concept',
      title: 'Graphing Success Tips',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">📊 Pro Graphing Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Always label your axes and use consistent scale</li>
              <li>Plot at least three points to ensure accuracy</li>
              <li>Use a ruler or straight edge for neat, straight lines</li>
              <li>Check your work by verifying points satisfy the equation</li>
              <li>Extend lines beyond your plotted points with arrows</li>
              <li>When in doubt, find the intercepts first</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">✅ Quality Check</h4>
            <ul className="text-sm space-y-1">
              <li>□ Are my axes labeled?</li>
              <li>□ Did I plot at least 2-3 points?</li>
              <li>□ Is my line straight?</li>
              <li>□ Do my points satisfy the equation?</li>
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
            <h3 className="text-xl font-semibold text-green-700 mb-3">Next: Special Cases</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll explore special cases and learn about equations with no solution or infinite solutions!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Equations with no solution (inconsistent)</li>
              <li>Equations with infinite solutions (identity)</li>
              <li>How to identify these special cases</li>
              <li>Understanding what they mean graphically</li>
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
          <h2 className="text-xl font-bold">Congratulations! You've mastered Graphing Linear Equations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Linear equations graph as straight lines</li>
              <li>✅ Slope (m) shows steepness and direction</li>
              <li>✅ Y-intercept (b) is where line crosses y-axis</li>
              <li>✅ Find intercepts by setting x=0 or y=0</li>
              <li>✅ Different equation forms serve different purposes</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Special Cases</h4>
            <p className="text-sm">You'll learn about equations that behave differently - no solutions or infinite solutions.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Graphing Challenge</h4>
            <p className="text-sm">Try graphing: y = -½x + 2. Find the slope, y-intercept, and x-intercept!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface GraphingLinearEquationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const GraphingLinearEquationsMicroLesson: React.FC<GraphingLinearEquationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={graphingLinearEquationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};