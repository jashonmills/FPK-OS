import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Waves, BarChart3, Activity, Zap, Target } from 'lucide-react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';

export const trigonometryGraphingLessonData = {
  id: 'trigonometry-graphing', 
  moduleTitle: 'Graphing Trigonometric Functions',
  totalScreens: 8,
  screens: [
    {
      id: 'welcome',
      type: 'concept' as const,
      title: 'From Circle to Waves: Graphing Trig Functions',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Waves className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Graphing Trigonometric Functions</h2>
            <p className="text-lg text-muted-foreground">
              Transform the unit circle into beautiful wave patterns that model the world around us!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-800">🎯 What You'll Discover</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">How circular motion creates waves</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Graphing sine and cosine functions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Understanding amplitude and period</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Tangent function and its unique properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Phase shifts and transformations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-world wave applications</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <Activity className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              <strong>Visual Revolution!</strong> You're about to see how the unit circle unfolds into the wave patterns 
              that describe music, light, electricity, and so much more in our universe!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'sine-wave-basics',
      type: 'concept',
      title: 'The Sine Wave: From Circle to Wave',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">The Sine Wave: From Circle to Wave</h2>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold mb-4 text-red-800">🌊 Creating the Sine Wave</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  Imagine tracing a point as it moves around the unit circle. If you plot the y-coordinate 
                  (sine value) against the angle, you create the sine wave!
                </p>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">Key Properties of y = sin(x):</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Domain:</strong> All real numbers</li>
                    <li>• <strong>Range:</strong> [-1, 1]</li>
                    <li>• <strong>Period:</strong> 2π (360°)</li>
                    <li>• <strong>Amplitude:</strong> 1</li>
                    <li>• <strong>Starts at:</strong> (0, 0)</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center bg-white p-4 rounded-lg">
                <div className="text-6xl mb-2">〰️</div>
                <p className="text-xs text-gray-600 mb-3">The Classic Sine Wave</p>
                <div className="text-xs space-y-1">
                  <p><strong>Pattern:</strong> 0 → 1 → 0 → -1 → 0</p>
                  <p><strong>Smooth and continuous</strong></p>
                  <p><strong>Repeats every 2π units</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">📍 Key Points on the Sine Wave</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-white border-blue-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = 0</p>
                  <p className="text-xs">sin(0) = 0</p>
                  <p className="text-xs text-gray-600">Starting point</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-blue-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = π/2</p>
                  <p className="text-xs">sin(π/2) = 1</p>
                  <p className="text-xs text-gray-600">Maximum</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-blue-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = π</p>
                  <p className="text-xs">sin(π) = 0</p>
                  <p className="text-xs text-gray-600">Crosses axis</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-blue-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = 3π/2</p>
                  <p className="text-xs">sin(3π/2) = -1</p>
                  <p className="text-xs text-gray-600">Minimum</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🔄 The Repeating Pattern</h3>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm mb-3">
                The sine function is <strong>periodic</strong> with period 2π. This means:
              </p>
              <div className="text-xs space-y-1">
                <p>sin(x + 2π) = sin(x) for any value of x</p>
                <p>sin(0) = sin(2π) = sin(4π) = sin(-2π) = 0</p>
                <p>sin(π/2) = sin(π/2 + 2π) = sin(π/2 + 4π) = 1</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎵 Real-World Connection</h4>
            <p className="text-sm">
              The sine wave is everywhere! It describes sound waves (musical notes), alternating current electricity, 
              ocean waves, and even the motion of a swing. Nature loves sine waves because they represent 
              the simplest form of oscillation.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'cosine-wave-basics',
      type: 'concept',
      title: "The Cosine Wave: Sine's Twin",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">The Cosine Wave: Sine's Twin</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">🌊 Creating the Cosine Wave</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  The cosine wave comes from plotting the x-coordinate (cosine value) of a point moving 
                  around the unit circle. It's almost identical to sine, but shifted!
                </p>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Key Properties of y = cos(x):</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Domain:</strong> All real numbers</li>
                    <li>• <strong>Range:</strong> [-1, 1]</li>
                    <li>• <strong>Period:</strong> 2π (360°)</li>
                    <li>• <strong>Amplitude:</strong> 1</li>
                    <li>• <strong>Starts at:</strong> (0, 1) - Maximum!</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center bg-white p-4 rounded-lg">
                <div className="text-6xl mb-2">〰️</div>
                <p className="text-xs text-gray-600 mb-3">The Cosine Wave (starts high!)</p>
                <div className="text-xs space-y-1">
                  <p><strong>Pattern:</strong> 1 → 0 → -1 → 0 → 1</p>
                  <p><strong>Same shape as sine</strong></p>
                  <p><strong>But shifted left by π/2</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">📍 Key Points on the Cosine Wave</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-white border-green-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = 0</p>
                  <p className="text-xs">cos(0) = 1</p>
                  <p className="text-xs text-gray-600">Maximum start!</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = π/2</p>
                  <p className="text-xs">cos(π/2) = 0</p>
                  <p className="text-xs text-gray-600">Crosses axis</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = π</p>
                  <p className="text-xs">cos(π) = -1</p>
                  <p className="text-xs text-gray-600">Minimum</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200 text-center">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">x = 3π/2</p>
                  <p className="text-xs">cos(3π/2) = 0</p>
                  <p className="text-xs text-gray-600">Back to axis</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🔄 Sine vs. Cosine Relationship</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Key Relationship</h4>
                <p className="text-sm mb-2">cos(x) = sin(x + π/2)</p>
                <p className="text-xs">
                  Cosine is just sine shifted π/2 units to the left. They're the same wave, 
                  just starting at different points!
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Phase Difference</h4>
                <p className="text-sm mb-2">90° (or π/2 radians) apart</p>
                <p className="text-xs">
                  When sine is at maximum, cosine is at zero. When sine is at zero, 
                  cosine is at maximum or minimum.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🎯 Comparison Table</h3>
            <div className="bg-white p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="font-semibold">Angle</div>
                <div className="font-semibold">sin(x)</div>
                <div className="font-semibold">cos(x)</div>
                
                <div>0°</div><div>0</div><div>1</div>
                <div>30°</div><div>1/2</div><div>√3/2</div>
                <div>45°</div><div>√2/2</div><div>√2/2</div>
                <div>60°</div><div>√3/2</div><div>1/2</div>
                <div>90°</div><div>1</div><div>0</div>
                <div>180°</div><div>0</div><div>-1</div>
                <div>270°</div><div>-1</div><div>0</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">⚡ Quick Recognition</h4>
            <p className="text-sm">
              Remember: Sine starts at 0 and goes up, Cosine starts at 1 and goes down. 
              If you see a wave starting at its maximum, it's probably cosine!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'tangent-function',
      type: 'concept',
      title: 'The Tangent Function: A Different Beast',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">The Tangent Function: A Different Beast</h2>
          
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-4 text-orange-800">📈 Understanding Tangent</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  The tangent function is different! It's not bounded like sine and cosine. 
                  Since tan(x) = sin(x)/cos(x), it goes to infinity when cosine equals zero.
                </p>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-orange-700 mb-2">Key Properties of y = tan(x):</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Domain:</strong> All reals except π/2 + nπ</li>
                    <li>• <strong>Range:</strong> All real numbers</li>
                    <li>• <strong>Period:</strong> π (180°) - Half of sine/cosine!</li>
                    <li>• <strong>Vertical asymptotes</strong> at x = π/2, 3π/2, etc.</li>
                    <li>• <strong>Starts at:</strong> (0, 0)</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center bg-white p-4 rounded-lg">
                <div className="text-6xl mb-2">📈</div>
                <p className="text-xs text-gray-600 mb-3">Tangent: Curves that go to infinity!</p>
                <div className="text-xs space-y-1">
                  <p><strong>Pattern:</strong> 0 → ∞ then -∞ → 0</p>
                  <p><strong>Repeats every π units</strong></p>
                  <p><strong>Has vertical asymptotes</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold mb-4 text-red-800">🚫 Vertical Asymptotes</h3>
            
            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-sm mb-3">
                Tangent has vertical asymptotes (undefined points) where cosine equals zero:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium">x = π/2</p>
                  <p>cos(π/2) = 0</p>
                  <p>tan(π/2) = undefined</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium">x = 3π/2</p>
                  <p>cos(3π/2) = 0</p>
                  <p>tan(3π/2) = undefined</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium">x = -π/2</p>
                  <p>cos(-π/2) = 0</p>
                  <p>tan(-π/2) = undefined</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium">x = 5π/2</p>
                  <p>cos(5π/2) = 0</p>
                  <p>tan(5π/2) = undefined</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Visual Tip:</strong> Near these asymptotes, the tangent curve shoots up to +∞ 
                on one side and down to -∞ on the other side, creating a dramatic vertical line!
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">📍 Key Points on Tangent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="bg-white border-green-200">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-medium">Zero Points</p>
                  <p className="text-xs">tan(0) = 0</p>
                  <p className="text-xs">tan(π) = 0</p>
                  <p className="text-xs">tan(2π) = 0</p>
                  <p className="text-xs text-gray-600">Crosses x-axis</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-medium">Special Values</p>
                  <p className="text-xs">tan(π/4) = 1</p>
                  <p className="text-xs">tan(π/3) = √3</p>
                  <p className="text-xs">tan(π/6) = 1/√3</p>
                  <p className="text-xs text-gray-600">Memorable points</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-medium">Asymptotes</p>
                  <p className="text-xs">x = π/2 + nπ</p>
                  <p className="text-xs">where n is any integer</p>
                  <p className="text-xs text-gray-600">Undefined points</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Why Tangent is Special</h4>
            <p className="text-sm">
              Tangent represents slope! At any point on the unit circle, tan(θ) gives the slope of the line 
              from the origin to that point. This makes tangent perfect for describing steepness, 
              rates of change, and angular relationships in engineering and physics.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'amplitude-period',
      type: 'concept',
      title: 'Amplitude and Period: Controlling the Waves',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Amplitude and Period: Controlling the Waves</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-800">📏 Amplitude: How High the Wave Goes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm mb-3">
                    <strong>Amplitude</strong> controls the height of the wave. For y = A·sin(x) or y = A·cos(x):
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• |A| = amplitude (always positive)</li>
                    <li>• If A {'>'} 0: normal orientation</li>
                    <li>• If A {'<'} 0: flipped upside down</li>
                    <li>• Range becomes [-|A|, |A|]</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Real-world:</strong> Amplitude represents volume (sound), brightness (light), 
                    or intensity (radio waves).
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Card className="bg-white border-purple-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = 2sin(x)</p>
                    <p className="text-xs">Amplitude = 2</p>
                    <p className="text-xs">Range: [-2, 2]</p>
                    <p className="text-xs text-purple-600">Twice as tall!</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-purple-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = 0.5cos(x)</p>
                    <p className="text-xs">Amplitude = 0.5</p>
                    <p className="text-xs">Range: [-0.5, 0.5]</p>
                    <p className="text-xs text-purple-600">Half as tall!</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-purple-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = -3sin(x)</p>
                    <p className="text-xs">Amplitude = 3</p>
                    <p className="text-xs">Range: [-3, 3]</p>
                    <p className="text-xs text-purple-600">Flipped and tall!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">🔄 Period: How Often the Wave Repeats</h3>
            
            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-sm mb-3">
                <strong>Period</strong> controls how quickly the wave repeats. For y = sin(Bx) or y = cos(Bx):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="text-sm space-y-1">
                    <li>• Period = 2π/|B|</li>
                    <li>• If |B| {'>'} 1: wave compresses (faster)</li>
                    <li>• If |B| {'<'} 1: wave stretches (slower)</li>
                    <li>• If B {'<'} 0: reflection about y-axis</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="text-xs bg-green-50 p-2 rounded">
                    <p><strong>y = sin(2x):</strong> Period = π (half as long)</p>
                  </div>
                  <div className="text-xs bg-green-50 p-2 rounded">
                    <p><strong>y = sin(x/2):</strong> Period = 4π (twice as long)</p>
                  </div>
                  <div className="text-xs bg-green-50 p-2 rounded">
                    <p><strong>y = sin(3x):</strong> Period = 2π/3 (third as long)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🎵 Combined Transformations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">y = A·sin(Bx)</h4>
                <div className="text-sm space-y-1">
                  <p>• Amplitude = |A|</p>
                  <p>• Period = 2π/|B|</p>
                  <p>• Range = [-|A|, |A|]</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Example: y = 3sin(2x)</h4>
                <div className="text-sm space-y-1">
                  <p>• Amplitude = 3</p>
                  <p>• Period = 2π/2 = π</p>
                  <p>• Range = [-3, 3]</p>
                  <p className="text-xs text-blue-600">Tall and fast!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🌊 Real-World Examples</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Ocean Waves</p>
                <p className="text-xs">Large amplitude = tall waves, short period = frequent waves</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Sound Waves</p>
                <p className="text-xs">Large amplitude = loud sound, short period = high pitch</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">AC Electricity</p>
                <p className="text-xs">Amplitude = voltage level, period = frequency (60 Hz in US)</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚡ Quick Check</h4>
            <p className="text-sm">
              Remember: Amplitude affects HEIGHT (how far up/down), Period affects WIDTH (how spread out). 
              Think "tall and skinny" vs "short and wide" waves!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'phase-shifts',
      type: 'concept',
      title: 'Phase Shifts and Vertical Shifts',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Phase Shifts and Vertical Shifts</h2>
          
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="font-semibold mb-4 text-indigo-800">↔️ Phase Shifts: Moving Left and Right</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm mb-3">
                    <strong>Phase shift</strong> moves the entire wave left or right. For y = sin(x - C):
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• If C {'>'} 0: shift RIGHT by C units</li>
                    <li>• If C {'<'} 0: shift LEFT by |C| units</li>
                    <li>• The wave keeps its shape, just moves</li>
                    <li>• Also called "horizontal translation"</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Memory trick:</strong> y = sin(x - π/2) shifts RIGHT π/2 units, 
                    which turns sine into negative cosine!
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Card className="bg-white border-indigo-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = sin(x - π/4)</p>
                    <p className="text-xs">Shifts RIGHT π/4</p>
                    <p className="text-xs text-indigo-600">Delayed start</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-indigo-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = cos(x + π/3)</p>
                    <p className="text-xs">Shifts LEFT π/3</p>
                    <p className="text-xs text-indigo-600">Early start</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-indigo-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = sin(x - π/2)</p>
                    <p className="text-xs">Shifts RIGHT π/2</p>
                    <p className="text-xs text-indigo-600">= -cos(x)</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">↕️ Vertical Shifts: Moving Up and Down</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm mb-3">
                    <strong>Vertical shift</strong> moves the entire wave up or down. For y = sin(x) + D:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• If D {'>'} 0: shift UP by D units</li>
                    <li>• If D {'<'} 0: shift DOWN by |D| units</li>
                    <li>• Changes the midline (center line)</li>
                    <li>• New range: [min+D, max+D]</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Real-world:</strong> Vertical shifts represent baseline values - 
                    like average temperature with daily fluctuations!
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Card className="bg-white border-green-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = sin(x) + 2</p>
                    <p className="text-xs">Shifts UP 2 units</p>
                    <p className="text-xs">Range: [1, 3]</p>
                    <p className="text-xs text-green-600">Elevated wave</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-green-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = cos(x) - 1</p>
                    <p className="text-xs">Shifts DOWN 1 unit</p>
                    <p className="text-xs">Range: [-2, 0]</p>
                    <p className="text-xs text-green-600">Lowered wave</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-green-200">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">y = 2sin(x) + 3</p>
                    <p className="text-xs">Amplitude 2, up 3</p>
                    <p className="text-xs">Range: [1, 5]</p>
                    <p className="text-xs text-green-600">Tall and high!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🎯 Complete Transformation Formula</h3>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center mb-4">
                <p className="text-lg font-bold">y = A·sin(B(x - C)) + D</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium">A</p>
                  <p className="text-xs">Amplitude</p>
                  <p className="text-xs">Height control</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="font-medium">B</p>
                  <p className="text-xs">Period = 2π/|B|</p>
                  <p className="text-xs">Speed control</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="font-medium">C</p>
                  <p className="text-xs">Phase shift</p>
                  <p className="text-xs">Left/right move</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <p className="font-medium">D</p>
                  <p className="text-xs">Vertical shift</p>
                  <p className="text-xs">Up/down move</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">📝 Example Analysis</h3>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-lg font-semibold mb-2">y = 3sin(2(x - π/4)) + 1</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="font-medium">Amplitude: 3</p>
                  <p className="text-xs">Wave is 3 units tall</p>
                </div>
                <div>
                  <p className="font-medium">Period: π</p>
                  <p className="text-xs">2π/2 = π units long</p>
                </div>
                <div>
                  <p className="font-medium">Phase: π/4 right</p>
                  <p className="text-xs">Starts π/4 units later</p>
                </div>
                <div>
                  <p className="font-medium">Vertical: +1</p>
                  <p className="text-xs">Centered at y = 1</p>
                </div>
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                <strong>Range:</strong> [1-3, 1+3] = [-2, 4]
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">🎵 Musical Connection</h4>
            <p className="text-sm">
              These transformations are like adjusting a stereo: amplitude is volume, period is pitch, 
              phase shift is delay/echo, and vertical shift is the baseline or DC offset. 
              Every wave in nature can be described this way!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Wave Master: You Can Graph Any Trigonometric Function!',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 Incredible! You've Mastered the Art of Trigonometric Graphing</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🏆 Your Wave-Riding Skills:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ Creating sine and cosine waves from the unit circle</li>
                <li>✅ Understanding tangent's unique asymptotic behavior</li>
                <li>✅ Controlling amplitude (height) and period (speed)</li>
                <li>✅ Mastering phase shifts (left/right movement)</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Applying vertical shifts (up/down movement)</li>
                <li>✅ Analyzing complex transformations y = A·sin(B(x-C))+D</li>
                <li>✅ Connecting mathematical waves to real-world phenomena</li>
                <li>✅ Recognizing wave patterns in nature and technology</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🌊 Your Transformation Toolkit:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded border border-red-200 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-semibold">Amplitude</p>
                <p className="text-xs">Controls wave height</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200 text-center">
                <Waves className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">Period</p>
                <p className="text-xs">Controls wave speed</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-semibold">Phase Shift</p>
                <p className="text-xs">Moves wave left/right</p>
              </div>
              <div className="bg-white p-3 rounded border border-purple-200 text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold">Vertical Shift</p>
                <p className="text-xs">Moves wave up/down</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🚀 Coming Up Next:</h3>
            <p className="text-sm mb-3">
              Now that you can visualize trigonometric functions, you're ready to explore the relationships 
              between different trig functions:
            </p>
            <ul className="text-xs space-y-1">
              <li>• Fundamental trigonometric identities</li>
              <li>• How to prove and use these powerful relationships</li>
              <li>• Simplifying complex trigonometric expressions</li>
              <li>• Building the foundation for solving trig equations</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-2 text-yellow-800">🎼 The Universal Language</h3>
            <p className="text-sm">
              You've just learned the universal language of oscillation! Every vibrating string, radio wave, 
              heartbeat, brain wave, and planetary orbit can be described using the trigonometric functions 
              you now understand. You're seeing the mathematics that makes the universe dance!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface TrigonometryGraphingMicroLessonProps {
  onComplete?: () => void;
}

const TrigonometryGraphingMicroLesson: React.FC<TrigonometryGraphingMicroLessonProps> = ({ onComplete }) => {
  return (
    <MicroLessonContainer
      lessonData={trigonometryGraphingLessonData as any}
      onComplete={onComplete}
    />
  );
};

export default TrigonometryGraphingMicroLesson;