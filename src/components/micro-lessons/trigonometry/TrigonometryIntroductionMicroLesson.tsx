import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Triangle, BookOpen, Target, AlertCircle, Award } from 'lucide-react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';

export const trigonometryIntroductionLessonData = {
  lessonId: 1,
  title: "Introduction to Trigonometry",
  description: "Learn the basics of trigonometry and the unit circle",
  screens: [
    {
      id: 'welcome',
      type: 'intro',
      title: 'Welcome to Trigonometry!',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Triangle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Introduction to Trigonometry</h2>
            <p className="text-lg text-muted-foreground">
              Discover the fascinating world of trigonometry - the mathematics of triangles, waves, and rotations!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-800">🎯 What You'll Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">What trigonometry is and why it matters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Understanding right triangles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">The unit circle concept</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Key angles and their importance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Real-world applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Building foundation for advanced concepts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              <strong>Pro Tip:</strong> Trigonometry connects geometry with algebra and appears everywhere in science, 
              engineering, and even art. Master these basics to unlock advanced mathematics!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-is-trigonometry',
      type: 'concept',
      title: 'What is Trigonometry?',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">What is Trigonometry?</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">📚 Definition</h3>
            <p className="text-lg mb-4">
              <strong>Trigonometry</strong> is the branch of mathematics that studies the relationships between 
              angles and sides in triangles. The word comes from Greek: "trigon" (triangle) + "metron" (measure).
            </p>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-medium text-blue-700">In simple terms:</p>
              <p className="text-sm mt-2">
                Trigonometry helps us find unknown sides or angles in triangles when we know some information about them.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Calculator className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-semibold text-green-800">Engineering</h4>
                <p className="text-xs text-green-700 mt-2">Building bridges, designing structures</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Navigation</h4>
                <p className="text-xs text-purple-700 mt-2">GPS, sailing, aviation</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Physics</h4>
                <p className="text-xs text-orange-700 mt-2">Waves, oscillations, forces</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Fun Fact:</strong> Ancient Egyptians used trigonometry to build pyramids, and today it powers 
              everything from video games to satellite communications!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'right-triangles',
      type: 'concept',
      title: 'Right Triangles: The Foundation',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Right Triangles: The Foundation</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🔺 What Makes a Right Triangle Special?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  Right triangles are the foundation of trigonometry. They have one 90° angle and two acute angles that sum to 90°.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm"><strong>Hypotenuse:</strong> The longest side (opposite the 90° angle)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm"><strong>Opposite:</strong> The side opposite to the angle we're studying</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm"><strong>Adjacent:</strong> The side next to the angle we're studying</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-8xl font-mono mb-2">📐</div>
                <p className="text-xs text-gray-600">
                  Imagine this as a right triangle - the corner represents the 90° angle
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🎯 Key Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ One angle is exactly 90°</li>
                <li>✅ The other two angles sum to 90°</li>
                <li>✅ Hypotenuse is always the longest side</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Pythagorean theorem applies: a² + b² = c²</li>
                <li>✅ Foundation for all trigonometric ratios</li>
                <li>✅ Appears everywhere in real applications</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">💡 Memory Aid</h4>
            <p className="text-sm">
              Think of a right triangle as a "corner" - like the corner of a room where two walls meet the floor. 
              That corner is always 90°, and the triangular space forms our right triangle!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'triangle-sides',
      type: 'example',
      title: 'Identifying Triangle Sides',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Identifying Triangle Sides</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-800">🎯 The Three Sides Explained</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-800">Hypotenuse</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-red-700">
                    • Always the longest side<br/>
                    • Opposite the 90° angle<br/>
                    • Never changes identity
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-800">Opposite</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-blue-700">
                    • Opposite to your chosen angle<br/>
                    • Changes based on which angle you're studying<br/>
                    • Not the hypotenuse
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-800">Adjacent</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-green-700">
                    • Next to your chosen angle<br/>
                    • Changes based on which angle you're studying<br/>
                    • Not the hypotenuse
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📝 Example Walkthrough</h4>
              <p className="text-sm mb-3">
                In a right triangle, if we're looking at angle A (not the 90° angle):
              </p>
              <div className="space-y-1 text-sm">
                <p>🔴 <strong>Hypotenuse:</strong> The side opposite the 90° angle (always the same)</p>
                <p>🔵 <strong>Opposite to A:</strong> The side that doesn't touch angle A</p>
                <p>🟢 <strong>Adjacent to A:</strong> The side that touches angle A (but isn't the hypotenuse)</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">⚡ Quick Check</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Which side is always the longest in a right triangle?</p>
                <p className="text-xs text-gray-600 mt-1">Answer: The hypotenuse (opposite the 90° angle)</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Do opposite and adjacent sides change?</p>
                <p className="text-xs text-gray-600 mt-1">Answer: Yes! They depend on which angle you're studying</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'unit-circle-intro',
      type: 'concept',
      title: 'Introduction to the Unit Circle',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Introduction to the Unit Circle</h2>
          
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="font-semibold mb-4 text-indigo-800">⭕ What is the Unit Circle?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  The unit circle is a circle with radius 1, centered at the origin (0,0) of a coordinate plane. 
                  It's the most important tool in trigonometry!
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-medium text-indigo-700">Key Properties:</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Radius = 1 unit</li>
                      <li>• Center at (0, 0)</li>
                      <li>• Circumference = 2π</li>
                      <li>• Every point is distance 1 from center</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white p-4 rounded-lg">
                <div className="text-6xl mb-2">⭕</div>
                <p className="text-xs text-gray-600">
                  The unit circle - radius = 1
                </p>
                <div className="mt-3 text-xs">
                  <p>Center: (0, 0)</p>
                  <p>Any point on circle: distance 1 from center</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🎯 Why is it So Important?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Connects angles to coordinates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Makes trig functions visual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Works for all angles (not just 0°-90°)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Foundation for advanced topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Used in physics and engineering</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Essential for understanding waves</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🔮 Preview</h4>
            <p className="text-sm">
              Soon you'll see how every point on the unit circle gives us the values of sine and cosine for different angles. 
              This connection between geometry and algebra is what makes trigonometry so powerful!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'key-angles',
      type: 'reference',
      title: 'Important Angles to Remember',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Important Angles to Remember</h2>
          
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-4 text-orange-800">📐 The Special Angles</h3>
            <p className="mb-4 text-sm">
              Certain angles appear frequently in trigonometry. Memorizing their values will save you time and build intuition.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center">0°</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Starting point</p>
                  <div className="text-2xl mb-2">→</div>
                  <p className="text-xs">Horizontal right</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center">30°, 45°, 60°</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-gray-600 mb-2">The "special" angles</p>
                  <div className="text-2xl mb-2">📐</div>
                  <p className="text-xs">Common in problems</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center">90°</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Right angle</p>
                  <div className="text-2xl mb-2">↑</div>
                  <p className="text-xs">Vertical up</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🌐 Degrees vs. Radians</h3>
            <p className="text-sm mb-4">
              Angles can be measured in degrees (°) or radians. Both are important in trigonometry.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Degrees</h4>
                <p className="text-xs mb-2">Full circle = 360°</p>
                <div className="space-y-1 text-xs">
                  <p>• 0° = Start</p>
                  <p>• 90° = Quarter turn</p>
                  <p>• 180° = Half turn</p>
                  <p>• 270° = Three-quarters</p>
                  <p>• 360° = Full circle</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Radians</h4>
                <p className="text-xs mb-2">Full circle = 2π</p>
                <div className="space-y-1 text-xs">
                  <p>• 0 = Start</p>
                  <p>• π/2 = Quarter turn</p>
                  <p>• π = Half turn</p>
                  <p>• 3π/2 = Three-quarters</p>
                  <p>• 2π = Full circle</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">🎯 Study Tip</h4>
            <p className="text-sm">
              Don't worry about memorizing everything now! Focus on understanding the concepts. 
              As we work through examples, these special values will become natural to you.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'real-world-preview',
      type: 'example',
      title: 'Real-World Applications Preview',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Real-World Applications Preview</h2>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-800">🌍 Where You'll Use Trigonometry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🏗️ Construction & Architecture</h4>
                    <p className="text-xs text-blue-700">
                      Calculating roof angles, stair slopes, and ensuring buildings are structurally sound.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-2">🧭 Navigation</h4>
                    <p className="text-xs text-green-700">
                      GPS systems, ship navigation, and flight paths all rely on trigonometric calculations.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-white border-orange-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">🌊 Physics & Waves</h4>
                    <p className="text-xs text-orange-700">
                      Sound waves, light waves, ocean waves - all described using trigonometric functions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-red-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-red-800 mb-2">🎮 Computer Graphics</h4>
                    <p className="text-xs text-red-700">
                      Video games, animations, and 3D modeling use trigonometry for rotations and movements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-3 text-yellow-800">🎯 Example Scenarios</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Scenario 1: Finding Building Height</p>
                <p className="text-xs text-gray-600 mt-1">
                  Standing 50 feet from a building, you measure a 60° angle to the top. How tall is the building?
                </p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Scenario 2: Satellite Communication</p>
                <p className="text-xs text-gray-600 mt-1">
                  What angle should a satellite dish point to receive the strongest signal?
                </p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Scenario 3: Music & Sound</p>
                <p className="text-xs text-gray-600 mt-1">
                  How do different musical notes create harmonies? It's all about wave frequencies!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Your Journey Ahead</h4>
            <p className="text-sm">
              By the end of this course, you'll have the tools to solve all these real-world problems and more. 
              Every concept we learn builds toward these practical applications!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Foundation Complete: Ready for Trigonometric Ratios!',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 Excellent! You've Built a Strong Foundation</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">🏆 What You've Mastered:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ What trigonometry is and why it's important</li>
                <li>✅ Right triangle components (hypotenuse, opposite, adjacent)</li>
                <li>✅ How to identify triangle sides based on reference angles</li>
                <li>✅ Introduction to the unit circle concept</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Key angles in degrees and radians</li>
                <li>✅ Real-world applications overview</li>
                <li>✅ The connection between geometry and algebra</li>
                <li>✅ Why trigonometry appears in so many fields</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-800">🎯 Coming Up Next:</h3>
            <p className="text-sm mb-3">
              Now that you understand the foundation, you're ready to learn the three fundamental trigonometric ratios:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded">
                <p className="font-semibold text-red-600">SINE</p>
                <p className="text-xs">opposite/hypotenuse</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-semibold text-blue-600">COSINE</p>
                <p className="text-xs">adjacent/hypotenuse</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-semibold text-green-600">TANGENT</p>
                <p className="text-xs">opposite/adjacent</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-2 text-purple-800">💡 Key Insight</h3>
            <p className="text-sm">
              Remember: Trigonometry is about relationships. Once you see the patterns, everything becomes much clearer. 
              You're building mathematical superpowers that will serve you throughout your academic and professional journey!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};

interface TrigonometryIntroductionMicroLessonProps {
  onComplete?: () => void;
}

const TrigonometryIntroductionMicroLesson: React.FC<TrigonometryIntroductionMicroLessonProps> = ({ onComplete }) => {
  return (
    <MicroLessonContainer
      lessonData={trigonometryIntroductionLessonData}
      onComplete={onComplete}
    />
  );
};

export default TrigonometryIntroductionMicroLesson;