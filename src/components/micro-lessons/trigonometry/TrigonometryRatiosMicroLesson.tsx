import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Target, BookOpen, AlertCircle, CheckCircle, Trophy } from 'lucide-react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';

export const trigonometryRatiosLessonData = {
  id: 'trigonometry-ratios',
  moduleTitle: 'Sine, Cosine, and Tangent', 
  totalScreens: 8,
  screens: [
    {
      id: 'welcome',
      type: 'concept' as const,
      title: 'The Big Three: Sin, Cos, and Tan',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Calculator className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Sine, Cosine, and Tangent</h2>
            <p className="text-lg text-muted-foreground">
              Master the three fundamental trigonometric ratios that unlock all of trigonometry!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-red-800">🎯 What You'll Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">The SOHCAHTOA mnemonic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">How to calculate sine, cosine, tangent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">When to use each ratio</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Step-by-step problem solving</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Calculator usage and techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Real-world problem applications</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              <strong>Get Ready!</strong> You're about to learn the most important concept in trigonometry. 
              Once you master these three ratios, you can solve almost any triangle problem!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'sohcahtoa',
      type: 'concept',
      title: 'SOHCAHTOA: The Magic Formula',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">SOHCAHTOA: The Magic Formula</h2>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-red-600 mb-2">SOHCAHTOA</h3>
              <p className="text-lg text-red-600">The most important mnemonic in trigonometry!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center text-red-700">SOH</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm font-semibold mb-2">Sine = Opposite/Hypotenuse</p>
                  <div className="text-xs text-gray-600">
                    <p>sin(θ) = O/H</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center text-blue-700">CAH</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm font-semibold mb-2">Cosine = Adjacent/Hypotenuse</p>
                  <div className="text-xs text-gray-600">
                    <p>cos(θ) = A/H</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center text-green-700">TOA</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm font-semibold mb-2">Tangent = Opposite/Adjacent</p>
                  <div className="text-xs text-gray-600">
                    <p>tan(θ) = O/A</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🧠 Memory Tricks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Classic: SOHCAHTOA</h4>
                <p className="text-sm">{'"Some Old Hippie Caught Another Hippie Tripping On Acid"'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Alternative</h4>
                <p className="text-sm">{'"Silly Old Harry Caught A Herring Trawling Off America"'}</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 mt-4 text-center">
              Choose whichever phrase helps you remember best, or create your own!
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 The Key Insight</h4>
            <p className="text-sm">
              These aren't just formulas - they're relationships! Each ratio tells us something specific about 
              the triangle's shape. The same angle in any right triangle will always give the same ratios.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'sine-explained',
      type: 'concept',
      title: 'Understanding Sine',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Understanding Sine</h2>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold mb-4 text-red-800">📐 Sine: The Vertical Component</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-red-700 text-lg mb-2">sin(θ) = Opposite/Hypotenuse</h4>
                  <p className="text-sm text-red-600">
                    Sine measures how much of the hypotenuse is in the vertical direction compared to the angle.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-red-400">
                    <p className="text-sm font-medium">When sin(θ) = 0.5</p>
                    <p className="text-xs text-gray-600">The opposite side is half the length of the hypotenuse</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-400">
                    <p className="text-sm font-medium">When sin(θ) = 1</p>
                    <p className="text-xs text-gray-600">The triangle is "flat" - angle is 90°</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-400">
                    <p className="text-sm font-medium">When sin(θ) = 0</p>
                    <p className="text-xs text-gray-600">The triangle is "flat" - angle is 0°</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-4">Common Sine Values</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>sin(30°)</span>
                    <span className="font-mono">0.5</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>sin(45°)</span>
                    <span className="font-mono">0.707</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>sin(60°)</span>
                    <span className="font-mono">0.866</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>sin(90°)</span>
                    <span className="font-mono">1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🎯 When to Use Sine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">You Know:</h4>
                <ul className="text-sm space-y-1">
                  <li>• An angle</li>
                  <li>• The hypotenuse length</li>
                </ul>
                <h4 className="font-semibold text-yellow-700 mt-3 mb-2">You Want:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The opposite side length</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Or You Know:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The opposite side</li>
                  <li>• The hypotenuse</li>
                </ul>
                <h4 className="font-semibold text-yellow-700 mt-3 mb-2">You Want:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The angle</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">💡 Visual Tip</h4>
            <p className="text-sm">
              Think of sine as measuring "height." If you're looking up at something, sine tells you how much 
              of your line of sight is vertical. This is why sine is used for heights, elevations, and vertical distances!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'cosine-explained',
      type: 'concept',
      title: 'Understanding Cosine',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Understanding Cosine</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">📐 Cosine: The Horizontal Component</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-blue-700 text-lg mb-2">cos(θ) = Adjacent/Hypotenuse</h4>
                  <p className="text-sm text-blue-600">
                    Cosine measures how much of the hypotenuse is in the horizontal direction relative to the angle.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm font-medium">When cos(θ) = 1</p>
                    <p className="text-xs text-gray-600">The adjacent side equals the hypotenuse (angle = 0°)</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm font-medium">When cos(θ) = 0.5</p>
                    <p className="text-xs text-gray-600">The adjacent side is half the hypotenuse length</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm font-medium">When cos(θ) = 0</p>
                    <p className="text-xs text-gray-600">No horizontal component (angle = 90°)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-4">Common Cosine Values</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>cos(0°)</span>
                    <span className="font-mono">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>cos(30°)</span>
                    <span className="font-mono">0.866</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>cos(45°)</span>
                    <span className="font-mono">0.707</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>cos(60°)</span>
                    <span className="font-mono">0.5</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>cos(90°)</span>
                    <span className="font-mono">0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🎯 When to Use Cosine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">You Know:</h4>
                <ul className="text-sm space-y-1">
                  <li>• An angle</li>
                  <li>• The hypotenuse length</li>
                </ul>
                <h4 className="font-semibold text-green-700 mt-3 mb-2">You Want:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The adjacent side length</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Or You Know:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The adjacent side</li>
                  <li>• The hypotenuse</li>
                </ul>
                <h4 className="font-semibold text-green-700 mt-3 mb-2">You Want:</h4>
                <ul className="text-sm space-y-1">
                  <li>• The angle</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">💡 Visual Tip</h4>
            <p className="text-sm">
              Think of cosine as measuring "distance." If you're walking toward something, cosine tells you how much 
              of your path is horizontal. This is why cosine is used for horizontal distances, shadows, and ground coverage!
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">🔗 Sine & Cosine Connection</h4>
            <p className="text-sm">
              Notice: sin²(θ) + cos²(θ) = 1. This means sine and cosine are complementary - 
              they always work together to describe the complete triangle!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'tangent-explained',
      type: 'concept',
      title: 'Understanding Tangent',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Understanding Tangent</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">📐 Tangent: The Slope Ratio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-green-700 text-lg mb-2">tan(θ) = Opposite/Adjacent</h4>
                  <p className="text-sm text-green-600">
                    Tangent measures the steepness or slope of the angle. It's the ratio of "rise over run."
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <p className="text-sm font-medium">When tan(θ) = 1</p>
                    <p className="text-xs text-gray-600">45° angle - rise equals run (slope = 1)</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <p className="text-sm font-medium">When tan(θ) {'>'}; 1</p>
                    <p className="text-xs text-gray-600">Steep angle - more rise than run</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <p className="text-sm font-medium">When tan(θ) {'<'} 1</p>
                    <p className="text-xs text-gray-600">Shallow angle - more run than rise</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-4">Common Tangent Values</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>tan(0°)</span>
                    <span className="font-mono">0.0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>tan(30°)</span>
                    <span className="font-mono">0.577</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>tan(45°)</span>
                    <span className="font-mono">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>tan(60°)</span>
                    <span className="font-mono">1.732</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>tan(90°)</span>
                    <span className="font-mono">∞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🎯 When to Use Tangent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Perfect for:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Finding angles of elevation</li>
                  <li>• Calculating slopes and grades</li>
                  <li>• When hypotenuse is unknown</li>
                  <li>• Ramp and stair problems</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Bonus Feature:</h4>
                <p className="text-sm">
                  Tangent doesn't need the hypotenuse! If you only know the two legs of a right triangle, 
                  tangent can still find angles.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Real-World Connection</h4>
            <p className="text-sm">
              Tangent is everywhere! Road grades (6% grade means tan(angle) = 0.06), roof pitches 
              (4:12 pitch means tan(angle) = 4/12), and even smartphone tilt sensors use tangent values.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🔗 Special Relationship</h4>
            <p className="text-sm">
              Here's a secret: tan(θ) = sin(θ)/cos(θ). Tangent is actually just sine divided by cosine! 
              This relationship will become very useful later.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'problem-solving-steps',
      type: 'example',
      title: 'Step-by-Step Problem Solving',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Step-by-Step Problem Solving</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-800">🎯 The Universal Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-white border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-700">Step 1: Draw & Label</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      • Draw the right triangle<br/>
                      • Mark the right angle<br/>
                      • Label known sides/angles<br/>
                      • Mark what you're looking for
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-700">Step 2: Identify</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      • Which angle are you using?<br/>
                      • Which sides are opposite, adjacent, hypotenuse?<br/>
                      • What do you know? What do you need?
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-white border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-700">Step 3: Choose Ratio</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      • SOH: Use sine (O/H)<br/>
                      • CAH: Use cosine (A/H)<br/>
                      • TOA: Use tangent (O/A)<br/>
                      • Pick the one matching your known/unknown
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-700">Step 4: Solve</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      • Set up the equation<br/>
                      • Substitute known values<br/>
                      • Solve for the unknown<br/>
                      • Check your answer makes sense
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">📝 Example Problem</h3>
            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-sm font-medium mb-2">
                A ladder leans against a wall at a 60° angle. The ladder is 10 feet long. How high up the wall does it reach?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-semibold text-sm">Step 1: Draw & Label</p>
                  <p className="text-xs">Right triangle: wall, ground, ladder. Angle = 60°, hypotenuse = 10 ft</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-semibold text-sm">Step 2: Identify</p>
                  <p className="text-xs">Want: height (opposite to 60°). Know: hypotenuse = 10 ft</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-semibold text-sm">Step 3: Choose Ratio</p>
                  <p className="text-xs">Need opposite/hypotenuse = sine. Use SOH!</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-semibold text-sm">Step 4: Solve</p>
                  <p className="text-xs">sin(60°) = height/10<br/>height = 10 × sin(60°) = 10 × 0.866 = 8.66 ft</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🎯 Pro Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Always draw a diagram - it prevents confusion</li>
              <li>• Label everything you know before choosing a formula</li>
              <li>• Double-check which side is opposite/adjacent to your angle</li>
              <li>• Make sure your calculator is in the right mode (degrees vs radians)</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'calculator-tips',
      type: 'example',
      title: 'Calculator Usage and Inverse Functions',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Calculator Usage and Inverse Functions</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 text-blue-800">🔢 Calculator Basics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-white border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-700">Finding Ratios</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <p><strong>sin(30°):</strong> 30 [SIN] = 0.5</p>
                      <p><strong>cos(45°):</strong> 45 [COS] = 0.707</p>
                      <p><strong>tan(60°):</strong> 60 [TAN] = 1.732</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-700">Mode Check</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      Always verify: DEG mode for degrees, RAD mode for radians. 
                      Most problems use degrees unless specified otherwise.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-white border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-700">Finding Angles (Inverse)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <p><strong>sin⁻¹(0.5):</strong> 0.5 [SIN⁻¹] = 30°</p>
                      <p><strong>cos⁻¹(0.707):</strong> 0.707 [COS⁻¹] = 45°</p>
                      <p><strong>tan⁻¹(1.732):</strong> 1.732 [TAN⁻¹] = 60°</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-700">Inverse Notation</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs">
                      sin⁻¹, arcsin, asin all mean the same thing. Different calculators use different notation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-4 text-green-800">🔄 Forward vs. Inverse Functions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Forward (Angle → Ratio)</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Given:</strong> Angle</p>
                  <p><strong>Find:</strong> Trigonometric ratio</p>
                  <p><strong>Use:</strong> sin, cos, tan buttons</p>
                  <p><strong>Example:</strong> sin(30°) = 0.5</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Inverse (Ratio → Angle)</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Given:</strong> Trigonometric ratio</p>
                  <p><strong>Find:</strong> Angle</p>
                  <p><strong>Use:</strong> sin⁻¹, cos⁻¹, tan⁻¹ buttons</p>
                  <p><strong>Example:</strong> sin⁻¹(0.5) = 30°</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">⚡ Quick Practice</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Try this: What's cos(60°)?</p>
                <p className="text-xs text-gray-600 mt-1">Answer: 0.5 (or exactly 1/2)</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Now try: What angle has sin(θ) = 0.707?</p>
                <p className="text-xs text-gray-600 mt-1">Answer: θ = sin⁻¹(0.707) = 45°</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Common Calculator Mistakes</h4>
            <ul className="text-sm space-y-1">
              <li>• Wrong mode (degrees vs radians)</li>
              <li>• Forgetting parentheses: sin(30°) not sin30°</li>
              <li>• Confusing sin⁻¹ with 1/sin (they're different!)</li>
              <li>• Not checking if answers make sense</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: "SOHCAHTOA Mastered: You're Ready for Advanced Trigonometry!",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 Outstanding! You've Mastered the Foundation of Trigonometry</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🏆 What You've Conquered:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ SOHCAHTOA mnemonic and its meaning</li>
                <li>✅ Sine: opposite/hypotenuse relationship</li>
                <li>✅ Cosine: adjacent/hypotenuse relationship</li>
                <li>✅ Tangent: opposite/adjacent relationship</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ When to use each trigonometric ratio</li>
                <li>✅ Step-by-step problem-solving method</li>
                <li>✅ Calculator techniques and inverse functions</li>
                <li>✅ Common values and practical applications</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🎯 Your Trigonometric Arsenal:</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-bold text-red-600">SINE</p>
                <p className="text-xs">Height finder</p>
                <p className="text-xs">Vertical component</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-bold text-blue-600">COSINE</p>
                <p className="text-xs">Distance finder</p>
                <p className="text-xs">Horizontal component</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="font-bold text-green-600">TANGENT</p>
                <p className="text-xs">Slope finder</p>
                <p className="text-xs">Steepness measure</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3 text-purple-800">🚀 Coming Up Next:</h3>
            <p className="text-sm mb-3">
              Now that you're a SOHCAHTOA expert, you're ready to explore how these ratios work on the unit circle, 
              opening up a whole new world of possibilities:
            </p>
            <ul className="text-xs space-y-1">
              <li>• Understanding angles beyond 90°</li>
              <li>• Visualizing trig functions on the coordinate plane</li>
              <li>• Connecting geometry with algebra</li>
              <li>• Preparing for graphing and periodic functions</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-2 text-yellow-800">💪 Power User Status Unlocked!</h3>
            <p className="text-sm">
              You can now solve any right triangle problem! Whether it's finding missing sides, calculating angles, 
              or tackling real-world applications, you have the tools. The mathematical universe just got a lot more accessible!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface TrigonometryRatiosMicroLessonProps {
  onComplete?: () => void;
}

const TrigonometryRatiosMicroLesson: React.FC<TrigonometryRatiosMicroLessonProps> = ({ onComplete }) => {
  return (
    <MicroLessonContainer
      lessonData={trigonometryRatiosLessonData as any}
      onComplete={onComplete}
    />
  );
};

export default TrigonometryRatiosMicroLesson;