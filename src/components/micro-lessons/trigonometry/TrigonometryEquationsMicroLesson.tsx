import React, { useState } from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, CheckCircle, Lightbulb, Target, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';

interface InteractionDetails {
  lessonId?: string;
  action?: string;
  element?: string;
  value?: string | number;
  timestamp?: number;
  [key: string]: unknown;
}

interface TrigonometryEquationsMicroLessonProps {
  onComplete?: () => void;
  trackInteraction?: (action: string, details: InteractionDetails) => void;
}

const TrigonometryEquationsMicroLesson: React.FC<TrigonometryEquationsMicroLessonProps> = ({
  onComplete,
  trackInteraction
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const lessonData = {
    id: 'trigonometry-equations',
    moduleTitle: 'Solving Trigonometric Equations',
    totalScreens: 8,
    screens: [
      {
        id: 'equations-intro',
        type: 'concept' as const,
        title: 'What Are Trigonometric Equations?',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">What Are Trigonometric Equations?</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-3">
                🎯 <strong>Definition:</strong>
              </p>
              <p className="text-blue-800 leading-relaxed">
                Trigonometric equations are equations that contain trigonometric functions. Unlike identities (which are always true), these equations are only true for specific values of the variable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Simple Example</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded font-mono text-sm">
                    sin θ = 1/2
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Solution: θ = 30°, 150°, 390°, 510°...
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Key Difference</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Identity:</strong> sin²θ + cos²θ = 1</p>
                    <p className="text-xs text-gray-600">(Always true)</p>
                    <p><strong>Equation:</strong> sin θ = 0.5</p>
                    <p className="text-xs text-gray-600">(True for specific θ values)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">💡 Important Note:</h4>
              <p className="text-yellow-800 text-sm">
                Trigonometric equations often have <strong>infinitely many solutions</strong> because trig functions are periodic. We usually find solutions in a specific interval, like [0°, 360°) or [0, 2π).
              </p>
            </div>
          </div>
        ),
        estimatedTime: 3
      },
      {
        id: 'basic-solving',
        type: 'concept' as const,
        title: 'Basic Solution Strategy',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Step-by-Step Solution Strategy</h2>
            
            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <h3 className="font-semibold text-blue-900">Isolate the Trig Function</h3>
                  </div>
                  <p className="text-sm text-blue-800">
                    Get the trigonometric function by itself on one side of the equation.
                  </p>
                  <div className="bg-blue-50 p-2 rounded font-mono text-sm mt-2">
                    2sin θ - 1 = 0 → sin θ = 1/2
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <h3 className="font-semibold text-green-900">Find the Reference Angle</h3>
                  </div>
                  <p className="text-sm text-green-800">
                    Use inverse functions or special angle knowledge to find one solution.
                  </p>
                  <div className="bg-green-50 p-2 rounded font-mono text-sm mt-2">
                    sin⁻¹(1/2) = 30°
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <h3 className="font-semibold text-purple-900">Find All Solutions in the Interval</h3>
                  </div>
                  <p className="text-sm text-purple-800">
                    Use the unit circle and function properties to find all solutions.
                  </p>
                  <div className="bg-purple-50 p-2 rounded font-mono text-sm mt-2">
                    θ = 30°, 150° (in [0°, 360°))
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-100 text-red-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <h3 className="font-semibold text-red-900">Consider Periodicity</h3>
                  </div>
                  <p className="text-sm text-red-800">
                    Add multiples of the period for general solutions.
                  </p>
                  <div className="bg-red-50 p-2 rounded font-mono text-sm mt-2">
                    θ = 30° + 360°k, 150° + 360°k (k ∈ ℤ)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'quadrant-analysis',
        type: 'concept' as const,
        title: 'Using Quadrants to Find Solutions',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Quadrant Analysis Method</h2>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-3">
                🎯 <strong>Strategy:</strong> Use the unit circle and quadrant signs to find all solutions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">Quadrant I</h4>
                  <p className="text-xs text-blue-800">All positive</p>
                  <div className="bg-blue-50 p-2 rounded mt-1">
                    <span className="font-mono text-xs">sin⁺, cos⁺, tan⁺</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-green-900 text-sm mb-2">Quadrant II</h4>
                  <p className="text-xs text-green-800">Sin positive</p>
                  <div className="bg-green-50 p-2 rounded mt-1">
                    <span className="font-mono text-xs">sin⁺, cos⁻, tan⁻</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-red-900 text-sm mb-2">Quadrant III</h4>
                  <p className="text-xs text-red-800">Tan positive</p>
                  <div className="bg-red-50 p-2 rounded mt-1">
                    <span className="font-mono text-xs">sin⁻, cos⁻, tan⁺</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-orange-900 text-sm mb-2">Quadrant IV</h4>
                  <p className="text-xs text-orange-800">Cos positive</p>
                  <div className="bg-orange-50 p-2 rounded mt-1">
                    <span className="font-mono text-xs">sin⁻, cos⁺, tan⁻</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-300">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Example: Solve sin θ = -1/2</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">Step 1:</span>
                    <span className="text-sm">Reference angle: sin⁻¹(1/2) = 30°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">Step 2:</span>
                    <span className="text-sm">Sine is negative in Quadrants III and IV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">Step 3:</span>
                    <span className="text-sm">Solutions: 180° + 30° = 210°, 360° - 30° = 330°</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'algebraic-techniques',
        type: 'concept' as const,
        title: 'Algebraic Techniques',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Algebraic Techniques for Trig Equations</h2>
            
            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Factoring</h3>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-mono text-sm mb-2">sin θ cos θ = 0</p>
                    <p className="text-xs text-blue-800">
                      Either sin θ = 0 OR cos θ = 0<br/>
                      θ = 0°, 90°, 180°, 270°
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Substitution</h3>
                  <div className="bg-green-50 p-3 rounded space-y-2">
                    <p className="font-mono text-sm">2cos²θ - cos θ - 1 = 0</p>
                    <p className="text-xs text-green-800">Let u = cos θ</p>
                    <p className="font-mono text-sm">2u² - u - 1 = 0</p>
                    <p className="font-mono text-sm">(2u + 1)(u - 1) = 0</p>
                    <p className="text-xs text-green-800">u = -1/2 or u = 1</p>
                    <p className="text-xs text-green-800">cos θ = -1/2 or cos θ = 1</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Using Identities</h3>
                  <div className="bg-purple-50 p-3 rounded space-y-2">
                    <p className="font-mono text-sm">sin²θ + cos θ = 1</p>
                    <p className="text-xs text-purple-800">Use sin²θ = 1 - cos²θ</p>
                    <p className="font-mono text-sm">1 - cos²θ + cos θ = 1</p>
                    <p className="font-mono text-sm">-cos²θ + cos θ = 0</p>
                    <p className="font-mono text-sm">cos θ(-cos θ + 1) = 0</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">🧠 Strategy Tips:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Factor when possible</strong> - Look for common factors</li>
                <li>• <strong>Substitute</strong> - Treat trig functions like algebraic variables</li>
                <li>• <strong>Use identities</strong> - Convert to a single trig function when possible</li>
                <li>• <strong>Check your work</strong> - Substitute solutions back into original equation</li>
              </ul>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'special-cases',
        type: 'concept' as const,
        title: 'Special Cases and Advanced Techniques',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Special Cases and Advanced Techniques</h2>
            
            <div className="space-y-4">
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-red-900">Multiple Angles</h3>
                  <div className="bg-red-50 p-3 rounded space-y-2">
                    <p className="font-mono text-sm">sin(2θ) = 1/2</p>
                    <p className="text-xs text-red-800">Let u = 2θ, then sin u = 1/2</p>
                    <p className="text-xs text-red-800">u = 30°, 150° (+ multiples of 360°)</p>
                    <p className="text-xs text-red-800">So 2θ = 30°, 150°, 390°, 510°...</p>
                    <p className="text-xs text-red-800">Therefore θ = 15°, 75°, 195°, 255°...</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Equations with No Solution</h3>
                  <div className="bg-orange-50 p-3 rounded space-y-2">
                    <p className="font-mono text-sm">sin θ = 2</p>
                    <p className="text-xs text-orange-800">
                      <strong>No solution</strong> because -1 ≤ sin θ ≤ 1
                    </p>
                    <p className="font-mono text-sm">cos θ = -1.5</p>
                    <p className="text-xs text-orange-800">
                      <strong>No solution</strong> because -1 ≤ cos θ ≤ 1
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-indigo-900">Inverse Function Restrictions</h3>
                  <div className="bg-indigo-50 p-3 rounded space-y-2">
                    <p className="text-xs text-indigo-800">
                      <strong>arcsin:</strong> domain [-1,1], range [-90°, 90°]
                    </p>
                    <p className="text-xs text-indigo-800">
                      <strong>arccos:</strong> domain [-1,1], range [0°, 180°]
                    </p>
                    <p className="text-xs text-indigo-800">
                      <strong>arctan:</strong> domain ℝ, range (-90°, 90°)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">📝 Problem-Solving Checklist:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p>✓ Isolate the trig function</p>
                  <p>✓ Check if solution exists</p>
                  <p>✓ Find reference angle</p>
                </div>
                <div className="space-y-1">
                  <p>✓ Determine correct quadrants</p>
                  <p>✓ Include all solutions in interval</p>
                  <p>✓ Consider general solution if needed</p>
                </div>
              </div>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'practice-problems',
        type: 'practice' as const,
        title: 'Guided Practice Problems',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Let's Practice Together!</h2>
            
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Problem 1: Basic Equation</h3>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-mono text-center">Solve: 2cos θ + 1 = 0 for 0° {"<="} θ {"<"} 360°</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Isolate cos θ</p>
                    <p className="ml-4 font-mono">2cos θ = -1 → cos θ = -1/2</p>
                    <p><strong>Step 2:</strong> Reference angle</p>
                    <p className="ml-4">cos⁻¹(1/2) = 60°</p>
                    <p><strong>Step 3:</strong> Quadrants where cos is negative: II and III</p>
                    <p className="ml-4">θ = 180° - 60° = 120°</p>
                    <p className="ml-4">θ = 180° + 60° = 240°</p>
                    <div className="bg-green-50 p-2 rounded mt-2">
                      <p className="font-semibold text-green-800">Answer: θ = 120°, 240°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Problem 2: Quadratic Form</h3>
                  <div className="bg-purple-50 p-3 rounded mb-3">
                    <p className="font-mono text-center">Solve: 2sin²θ - sin θ - 1 = 0 for 0° {"<="} θ {"<"} 360°</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Factor or use substitution (let u = sin θ)</p>
                    <p className="ml-4 font-mono">2u² - u - 1 = 0</p>
                    <p className="ml-4 font-mono">(2u + 1)(u - 1) = 0</p>
                    <p><strong>Step 2:</strong> Solve for u</p>
                    <p className="ml-4">u = -1/2 or u = 1</p>
                    <p><strong>Step 3:</strong> Substitute back</p>
                    <p className="ml-4">sin θ = -1/2 → θ = 210°, 330°</p>
                    <p className="ml-4">sin θ = 1 → θ = 90°</p>
                    <div className="bg-green-50 p-2 rounded mt-2">
                      <p className="font-semibold text-green-800">Answer: θ = 90°, 210°, 330°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Problem 3: Multiple Angle</h3>
                  <div className="bg-orange-50 p-3 rounded mb-3">
                    <p className="font-mono text-center">Solve: cos(2θ) = √3/2 for 0° {"<="} θ {"<"} 180°</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Let u = 2θ, so cos u = √3/2</p>
                    <p><strong>Step 2:</strong> Solve for u in [0°, 360°)</p>
                    <p className="ml-4">u = 30°, 330°</p>
                    <p><strong>Step 3:</strong> Find θ values</p>
                    <p className="ml-4">2θ = 30° → θ = 15°</p>
                    <p className="ml-4">2θ = 330° → θ = 165°</p>
                    <div className="bg-green-50 p-2 rounded mt-2">
                      <p className="font-semibold text-green-800">Answer: θ = 15°, 165°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 6
      },
      {
        id: 'real-world-applications',
        type: 'concept' as const,
        title: 'Real-World Applications',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Trigonometric Equations in Action</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-3">
                🌍 <strong>Real-World Applications:</strong> Where do we use trigonometric equations?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Physics & Engineering</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Wave interference patterns</li>
                    <li>• Resonance frequencies in structures</li>
                    <li>• Alternating current analysis</li>
                    <li>• Satellite orbit calculations</li>
                    <li>• Pendulum motion periods</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Navigation & Astronomy</h3>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• GPS coordinate calculations</li>
                    <li>• Celestial navigation timing</li>
                    <li>• Sunrise/sunset predictions</li>
                    <li>• Tidal pattern analysis</li>
                    <li>• Planetary alignment dates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Computer Graphics</h3>
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Animation keyframe timing</li>
                    <li>• 3D rotation calculations</li>
                    <li>• Ray tracing algorithms</li>
                    <li>• Texture mapping coordinates</li>
                    <li>• Game physics simulations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Music & Signal Processing</h3>
                  </div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Audio frequency analysis</li>
                    <li>• Musical harmony calculations</li>
                    <li>• Digital filter design</li>
                    <li>• Noise cancellation algorithms</li>
                    <li>• Sound wave synthesis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-300">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Example: AC Current Analysis</h4>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <p className="font-mono text-sm">Find when AC current equals zero: I(t) = 10sin(120πt) = 0</p>
                  <p className="text-sm">
                    <strong>Solution:</strong> sin(120πt) = 0<br/>
                    This occurs when 120πt = nπ (where n is any integer)<br/>
                    So t = n/(120) seconds<br/>
                    <strong>Meaning:</strong> Current crosses zero every 1/120 second (twice per 60Hz cycle)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'lesson-summary',
        type: 'summary' as const,
        title: 'Equation Solver: Advanced Trigonometry Awaits!',
        content: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">🎉 Fantastic! You've Mastered Trigonometric Equations</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold mb-3 text-green-800">🏆 What You've Accomplished:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Basic Solution Strategies
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Quadrant Analysis
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Algebraic Techniques
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Multiple Angle Equations
                  </Badge>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Special Cases
                  </Badge>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Real-World Applications
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Key Problem-Solving Skills:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Systematic approach to isolating trigonometric functions</li>
                <li>• Using reference angles and quadrant analysis effectively</li>
                <li>• Applying algebraic techniques like factoring and substitution</li>
                <li>• Handling multiple angles and periodic solutions</li>
                <li>• Recognizing when equations have no solutions</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Ready for Advanced Applications?</h4>
                  <p className="text-yellow-800 text-sm">
                    You now have the tools to solve complex trigonometric problems! Next, you'll explore calculus of trigonometric functions, Fourier analysis, and advanced engineering applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        estimatedTime: 2
      }
    ]
  };

  const handleComplete = () => {
    trackInteraction?.('lesson_completed', {
      lessonId: 'trigonometry-equations',
      currentScreen,
      totalScreens: lessonData.screens.length
    });
    onComplete?.();
  };

  const handleNext = () => {
    trackInteraction?.('next_screen', {
      lessonId: 'trigonometry-equations',
      fromScreen: currentScreen,
      toScreen: currentScreen + 1
    });
  };

  return (
    <MicroLessonContainer
      lessonData={lessonData}
      onComplete={handleComplete}
      onNext={handleNext}
    />
  );
};

export default TrigonometryEquationsMicroLesson;