import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Circle, Target, Compass, RotateCcw, Navigation, Award } from 'lucide-react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';

export const trigonometryUnitCircleLessonData = {
  id: 'trigonometry-unit-circle',
  moduleTitle: 'Trigonometric Functions on the Unit Circle', 
  totalScreens: 8,
  screens: [
    {
      id: 'welcome',
      type: 'concept' as const,
      title: 'The Unit Circle: Your Trigonometry GPS',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Circle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Trigonometric Functions on the Unit Circle</h2>
            <p className="text-lg text-muted-foreground">
              Discover how the unit circle transforms trigonometry from triangles to coordinates!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-indigo-800">🎯 What You'll Master</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Unit circle coordinates and angles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">How sine and cosine become coordinates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Reference angles and symmetry</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Angles beyond 90° (quadrants)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Special angle values and patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Connecting circles to triangles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <Target className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              <strong>Game Changer Ahead!</strong> The unit circle is where trigonometry becomes truly powerful. 
              You'll see how everything connects and why trig functions work for any angle!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'unit-circle-setup',
      type: 'concept',
      title: 'Setting Up the Unit Circle',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Setting Up the Unit Circle</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">⭕ The Perfect Circle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  The unit circle is a circle with radius 1, centered at the origin (0,0). 
                  Every point on this circle is exactly 1 unit away from the center.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-medium text-blue-700">Key Properties:</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Center: (0, 0)</li>
                      <li>• Radius: 1 unit</li>
                      <li>• Equation: x² + y² = 1</li>
                      <li>• Circumference: 2π ≈ 6.28</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white p-4 rounded-lg">
                <div className="text-8xl mb-2">⭕</div>
                <p className="text-xs text-gray-600 mb-3">The Unit Circle</p>
                <div className="text-xs space-y-1">
                  <p><strong>Any point (x,y) on the circle:</strong></p>
                  <p>Distance from center = √(x² + y²) = 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">📍 Coordinate Connection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Starting Point: (1, 0)</h4>
                <p className="text-sm">
                  We start at the rightmost point of the circle: (1, 0). This corresponds to 0° or 0 radians.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Moving Counterclockwise</h4>
                <p className="text-sm">
                  As we rotate counterclockwise, we create angles and trace out points on the circle.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🎯 The Magic Connection</h3>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-lg font-semibold mb-2">For any angle θ on the unit circle:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="font-semibold text-red-700">x-coordinate = cos(θ)</p>
                  <p className="text-xs text-red-600">Horizontal position</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="font-semibold text-blue-700">y-coordinate = sin(θ)</p>
                  <p className="text-xs text-blue-600">Vertical position</p>
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-3">
                This is the fundamental connection that makes everything work!
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Why This Matters</h4>
            <p className="text-sm">
              Now trigonometry isn't limited to right triangles! We can find sine and cosine values for ANY angle - 
              even angles larger than 90° or negative angles. The unit circle is our universal tool.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'coordinates-and-angles',
      type: 'example',
      title: 'Coordinates and Angles',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Coordinates and Angles</h2>
          
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="font-semibold mb-4 text-indigo-800">📐 Key Angle Positions</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-red-200 text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-700">0° (0)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs font-mono">(1, 0)</p>
                  <p className="text-xs text-gray-600">Start/East</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-blue-200 text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-700">90° (π/2)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs font-mono">(0, 1)</p>
                  <p className="text-xs text-gray-600">Top/North</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200 text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-700">180° (π)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs font-mono">(-1, 0)</p>
                  <p className="text-xs text-gray-600">Left/West</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-purple-200 text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-700">270° (3π/2)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs font-mono">(0, -1)</p>
                  <p className="text-xs text-gray-600">Bottom/South</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🎯 Reading Coordinates</h4>
              <div className="space-y-2 text-sm">
                <p><strong>At 0°:</strong> cos(0°) = 1, sin(0°) = 0 → Point (1, 0)</p>
                <p><strong>At 90°:</strong> cos(90°) = 0, sin(90°) = 1 → Point (0, 1)</p>
                <p><strong>At 180°:</strong> cos(180°) = -1, sin(180°) = 0 → Point (-1, 0)</p>
                <p><strong>At 270°:</strong> cos(270°) = 0, sin(270°) = -1 → Point (0, -1)</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">🔄 Special Angles in All Quadrants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">30° Family</h4>
                <div className="space-y-1 text-xs">
                  <p><strong>30°:</strong> (√3/2, 1/2)</p>
                  <p><strong>150°:</strong> (-√3/2, 1/2)</p>
                  <p><strong>210°:</strong> (-√3/2, -1/2)</p>
                  <p><strong>330°:</strong> (√3/2, -1/2)</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">45° Family</h4>
                <div className="space-y-1 text-xs">
                  <p><strong>45°:</strong> (√2/2, √2/2)</p>
                  <p><strong>135°:</strong> (-√2/2, √2/2)</p>
                  <p><strong>225°:</strong> (-√2/2, -√2/2)</p>
                  <p><strong>315°:</strong> (√2/2, -√2/2)</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg mt-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Pattern Recognition:</strong> Notice how the same values appear in different quadrants, 
                just with different signs! This symmetry makes the unit circle predictable.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🧭 Navigation Tip</h4>
            <p className="text-sm">
              Think of the unit circle like a compass: East is 0°, North is 90°, West is 180°, South is 270°. 
              The coordinates tell you exactly where you are on your circular journey!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'quadrants-and-signs',
      type: 'concept',
      title: 'Quadrants and Sign Patterns',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Quadrants and Sign Patterns</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-800">🗺️ The Four Quadrants</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-blue-700">Quadrant I</CardTitle>
                  <p className="text-center text-xs text-blue-600">0° to 90°</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-2">Both x and y positive</p>
                  <p className="text-xs font-mono">cos(θ) {'>'}; 0, sin(θ) {'>'}; 0</p>
                  <p className="text-xs text-green-600 mt-2">✅ All trig functions positive</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-red-700">Quadrant II</CardTitle>
                  <p className="text-center text-xs text-red-600">90° to 180°</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-2">x negative, y positive</p>
                  <p className="text-xs font-mono">cos(θ) {'<'} 0, sin(θ) {'>'}; 0</p>
                  <p className="text-xs text-blue-600 mt-2">✅ Only sine positive</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-orange-700">Quadrant III</CardTitle>
                  <p className="text-center text-xs text-orange-600">180° to 270°</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-2">Both x and y negative</p>
                  <p className="text-xs font-mono">cos(θ) {'<'} 0, sin(θ) {'<'} 0</p>
                  <p className="text-xs text-green-600 mt-2">✅ Only tangent positive</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-green-700">Quadrant IV</CardTitle>
                  <p className="text-center text-xs text-green-600">270° to 360°</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-2">x positive, y negative</p>
                  <p className="text-xs font-mono">cos(θ) {'>'}; 0, sin(θ) {'<'} 0</p>
                  <p className="text-xs text-blue-600 mt-2">✅ Only cosine positive</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🎯 ASTC Memory Device</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
              <div className="bg-white p-2 rounded border border-green-200">
                <p className="font-bold text-green-600">A</p>
                <p className="text-xs">All positive</p>
                <p className="text-xs">(Quadrant I)</p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <p className="font-bold text-blue-600">S</p>
                <p className="text-xs">Sine positive</p>
                <p className="text-xs">(Quadrant II)</p>
              </div>
              <div className="bg-white p-2 rounded border border-orange-200">
                <p className="font-bold text-orange-600">T</p>
                <p className="text-xs">Tangent positive</p>
                <p className="text-xs">(Quadrant III)</p>
              </div>
              <div className="bg-white p-2 rounded border border-red-200">
                <p className="font-bold text-red-600">C</p>
                <p className="text-xs">Cosine positive</p>
                <p className="text-xs">(Quadrant IV)</p>
              </div>
            </div>
            <p className="text-sm text-yellow-700 mt-4 text-center">
              <strong>Memory phrase:</strong> "All Students Take Calculus" or "All Smart Teachers Care"
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">📝 Examples in Each Quadrant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <p className="text-sm font-medium">120° (Quadrant II)</p>
                  <p className="text-xs">sin(120°) = √3/2 (positive)</p>
                  <p className="text-xs">cos(120°) = -1/2 (negative)</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                  <p className="text-sm font-medium">240° (Quadrant III)</p>
                  <p className="text-xs">sin(240°) = -√3/2 (negative)</p>
                  <p className="text-xs">cos(240°) = -1/2 (negative)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="text-sm font-medium">300° (Quadrant IV)</p>
                  <p className="text-xs">sin(300°) = -√3/2 (negative)</p>
                  <p className="text-xs">cos(300°) = 1/2 (positive)</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <p className="text-sm font-medium">60° (Quadrant I)</p>
                  <p className="text-xs">sin(60°) = √3/2 (positive)</p>
                  <p className="text-xs">cos(60°) = 1/2 (positive)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">💡 Quick Sign Check</h4>
            <p className="text-sm">
              Before calculating any trig value, determine which quadrant your angle is in. 
              This tells you immediately whether your answer should be positive or negative!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'reference-angles',
      type: 'concept',
      title: 'Reference Angles and Symmetry',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Reference Angles and Symmetry</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">🔄 What Are Reference Angles?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm mb-3">
                    A <strong>reference angle</strong> is the acute angle (0° to 90°) that an angle makes with the x-axis. 
                    It's always positive and always between 0° and 90°.
                  </p>
                  <div className="text-xs space-y-1">
                    <p><strong>Purpose:</strong> Find trig values using symmetry</p>
                    <p><strong>Rule:</strong> |sin θ| = sin(reference angle)</p>
                    <p><strong>Rule:</strong> |cos θ| = cos(reference angle)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Finding Reference Angles</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Quadrant I:</strong> θ itself</p>
                  <p><strong>Quadrant II:</strong> 180° - θ</p>
                  <p><strong>Quadrant III:</strong> θ - 180°</p>
                  <p><strong>Quadrant IV:</strong> 360° - θ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">📐 Reference Angle Examples</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">150° (Quadrant II)</p>
                    <p className="text-xs">Reference angle = 180° - 150° = 30°</p>
                    <p className="text-xs text-blue-600">So sin(150°) = sin(30°) = 1/2</p>
                    <p className="text-xs text-blue-600">But cos(150°) = -cos(30°) = -√3/2</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">225° (Quadrant III)</p>
                    <p className="text-xs">Reference angle = 225° - 180° = 45°</p>
                    <p className="text-xs text-blue-600">So |sin(225°)| = sin(45°) = √2/2</p>
                    <p className="text-xs text-blue-600">But sin(225°) = -√2/2 (negative in Q III)</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">315° (Quadrant IV)</p>
                    <p className="text-xs">Reference angle = 360° - 315° = 45°</p>
                    <p className="text-xs text-blue-600">So cos(315°) = cos(45°) = √2/2</p>
                    <p className="text-xs text-blue-600">But sin(315°) = -sin(45°) = -√2/2</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">120° (Quadrant II)</p>
                    <p className="text-xs">Reference angle = 180° - 120° = 60°</p>
                    <p className="text-xs text-blue-600">So sin(120°) = sin(60°) = √3/2</p>
                    <p className="text-xs text-blue-600">But cos(120°) = -cos(60°) = -1/2</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🎯 The Reference Angle Method</h3>
            <div className="bg-white p-4 rounded-lg">
              <ol className="text-sm space-y-2">
                <li><strong>Step 1:</strong> Determine which quadrant your angle is in</li>
                <li><strong>Step 2:</strong> Find the reference angle using the quadrant rules</li>
                <li><strong>Step 3:</strong> Find the trig value of the reference angle</li>
                <li><strong>Step 4:</strong> Apply the correct sign based on the quadrant (ASTC)</li>
              </ol>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-3 text-orange-800">🔍 Symmetry Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Even/Odd Functions</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Cosine is even:</strong> cos(-θ) = cos(θ)</p>
                  <p><strong>Sine is odd:</strong> sin(-θ) = -sin(θ)</p>
                  <p><strong>Tangent is odd:</strong> tan(-θ) = -tan(θ)</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Complementary Angles</h4>
                <div className="text-xs space-y-1">
                  <p><strong>sin(90° - θ) = cos(θ)</strong></p>
                  <p><strong>cos(90° - θ) = sin(θ)</strong></p>
                  <p>This is why 30° and 60° have "swapped" values!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚡ Power Move</h4>
            <p className="text-sm">
              With reference angles, you only need to memorize the trig values for 30°, 45°, and 60°. 
              Every other special angle can be found using symmetry!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'beyond-90-degrees',
      type: 'example',
      title: 'Angles Beyond 90°',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Angles Beyond 90°</h2>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold mb-4 text-red-800">🚀 Breaking the 90° Barrier</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  With the unit circle, we're no longer limited to right triangles! We can find trigonometric 
                  values for any angle - even negative angles or angles greater than 360°.
                </p>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">Types of Angles:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Acute:</strong> 0° to 90°</li>
                    <li>• <strong>Obtuse:</strong> 90° to 180°</li>
                    <li>• <strong>Reflex:</strong> 180° to 360°</li>
                    <li>• <strong>Negative:</strong> Clockwise rotation</li>
                    <li>• <strong>Coterminal:</strong> Differ by 360°</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-white border-red-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">450° Example</p>
                    <p className="text-xs">450° = 360° + 90°</p>
                    <p className="text-xs">So 450° and 90° are coterminal</p>
                    <p className="text-xs text-red-600">sin(450°) = sin(90°) = 1</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-red-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">-30° Example</p>
                    <p className="text-xs">-30° = 360° - 30° = 330°</p>
                    <p className="text-xs">Clockwise 30° = Counterclockwise 330°</p>
                    <p className="text-xs text-red-600">cos(-30°) = cos(330°) = √3/2</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">🔄 Coterminal Angles</h3>
            
            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-sm mb-3">
                <strong>Coterminal angles</strong> end at the same position on the unit circle. 
                They have identical trig values.
              </p>
              <p className="text-xs">
                <strong>Rule:</strong> Add or subtract 360° (or 2π radians) to find coterminal angles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm font-medium">45°</p>
                <p className="text-xs">405°, 765°, -315°</p>
                <p className="text-xs text-blue-600">All have same trig values</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm font-medium">60°</p>
                <p className="text-xs">420°, 780°, -300°</p>
                <p className="text-xs text-blue-600">All have same trig values</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-sm font-medium">30°</p>
                <p className="text-xs">390°, 750°, -330°</p>
                <p className="text-xs text-blue-600">All have same trig values</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">📝 Extended Angle Examples</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                <p className="text-sm font-medium">Find sin(210°)</p>
                <p className="text-xs">210° is in Quadrant III (180° to 270°)</p>
                <p className="text-xs">Reference angle = 210° - 180° = 30°</p>
                <p className="text-xs">sin(210°) = -sin(30°) = -1/2 (negative in Q III)</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                <p className="text-sm font-medium">Find cos(300°)</p>
                <p className="text-xs">300° is in Quadrant IV (270° to 360°)</p>
                <p className="text-xs">Reference angle = 360° - 300° = 60°</p>
                <p className="text-xs">cos(300°) = cos(60°) = 1/2 (positive in Q IV)</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                <p className="text-sm font-medium">Find tan(135°)</p>
                <p className="text-xs">135° is in Quadrant II (90° to 180°)</p>
                <p className="text-xs">Reference angle = 180° - 135° = 45°</p>
                <p className="text-xs">tan(135°) = -tan(45°) = -1 (negative in Q II)</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎯 The Big Picture</h4>
            <p className="text-sm">
              The unit circle extends trigonometry from simple right triangles to all rotational motion. 
              This foundation enables us to model waves, oscillations, and periodic phenomena in science and engineering!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: "Unit Circle Mastery: You are Ready for Advanced Applications!",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 Phenomenal! You've Unlocked the Power of the Unit Circle</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🏆 What You've Mastered:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ Unit circle setup and coordinate system</li>
                <li>✅ How sine and cosine become coordinates</li>
                <li>✅ The four quadrants and their properties</li>
                <li>✅ ASTC sign pattern for all functions</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Reference angles and symmetry principles</li>
                <li>✅ Working with angles beyond 90°</li>
                <li>✅ Coterminal angles and periodicity</li>
                <li>✅ Special angle values in all quadrants</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🎯 Your New Superpowers:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-blue-200 text-center">
                <Circle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">Any Angle</p>
                <p className="text-xs">Find trig values for any angle, positive or negative</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200 text-center">
                <Compass className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-semibold">Quadrant Navigation</p>
                <p className="text-xs">Instantly know which functions are positive/negative</p>
              </div>
              <div className="bg-white p-3 rounded border border-purple-200 text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold">Reference Angles</p>
                <p className="text-xs">Use symmetry to find any special angle value</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🚀 Coming Up Next:</h3>
            <p className="text-sm mb-3">
              Now that you understand how trigonometric functions work on the unit circle, 
              you're ready to see them come alive as graphs:
            </p>
            <ul className="text-xs space-y-1">
              <li>• Graphing sine, cosine, and tangent functions</li>
              <li>• Understanding amplitude, period, and phase shifts</li>
              <li>• Seeing the wave patterns that connect to real-world phenomena</li>
              <li>• Discovering why trigonometry is the language of oscillations</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-2 text-yellow-800">💡 The Connection Revolution</h3>
            <p className="text-sm">
              You've just experienced one of mathematics' most beautiful connections: how circular motion creates 
              wave patterns. This insight connects geometry, algebra, and physics - and it's the foundation for 
              understanding everything from sound waves to quantum mechanics!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface TrigonometryUnitCircleMicroLessonProps {
  onComplete?: () => void;
}

const TrigonometryUnitCircleMicroLesson: React.FC<TrigonometryUnitCircleMicroLessonProps> = ({ onComplete }) => {
  return (
    <MicroLessonContainer
      lessonData={trigonometryUnitCircleLessonData as any}
      onComplete={onComplete}
    />
  );
};

export default TrigonometryUnitCircleMicroLesson;