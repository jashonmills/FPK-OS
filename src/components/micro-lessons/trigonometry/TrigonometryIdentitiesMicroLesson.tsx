import React, { useState } from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, CheckCircle, Lightbulb, Target, BookOpen, ChevronRight } from 'lucide-react';

interface TrigonometryIdentitiesMicroLessonProps {
  onComplete?: () => void;
  trackInteraction?: (action: string, details: any) => void;
}

const TrigonometryIdentitiesMicroLesson: React.FC<TrigonometryIdentitiesMicroLessonProps> = ({
  onComplete,
  trackInteraction
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const lessonData = {
    id: 'trigonometry-identities',
    moduleTitle: 'Trigonometric Identities',
    totalScreens: 8,
    screens: [
      {
        id: 'identities-intro',
        type: 'concept' as const,
        title: 'What Are Trigonometric Identities?',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">What Are Trigonometric Identities?</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-3">
                🎯 <strong>Key Definition:</strong>
              </p>
              <p className="text-blue-800 leading-relaxed">
                Trigonometric identities are equations that are true for all values of the variables where both sides of the equation are defined. They're like algebraic rules, but for trigonometric functions!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Pythagorean Identity</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    sin²θ + cos²θ = 1
                  </div>
                  <p className="text-xs text-gray-600 mt-2">The most fundamental identity</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Tangent Identity</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    tan θ = sin θ / cos θ
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Connects all three basic functions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 3
      },
      {
        id: 'pythagorean-identities',
        type: 'concept' as const,
        title: 'The Pythagorean Family',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">The Pythagorean Family of Identities</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-3 text-blue-900">Primary Pythagorean Identity</h3>
                <div className="bg-white p-3 rounded border font-mono text-lg text-center">
                  sin²θ + cos²θ = 1
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  This comes directly from the Pythagorean theorem applied to the unit circle!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-900">Tangent Form</h4>
                  <div className="bg-white p-2 rounded border font-mono text-center">
                    1 + tan²θ = sec²θ
                  </div>
                  <p className="text-xs text-green-700 mt-2">Divide by cos²θ</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-900">Cotangent Form</h4>
                  <div className="bg-white p-2 rounded border font-mono text-center">
                    1 + cot²θ = csc²θ
                  </div>
                  <p className="text-xs text-purple-700 mt-2">Divide by sin²θ</p>
                </div>
              </div>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'reciprocal-identities',
        type: 'concept' as const,
        title: 'Reciprocal Identities',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Reciprocal Identities</h2>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-900 mb-3">
                💡 <strong>Remember:</strong> Reciprocals multiply to equal 1
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-3">Sine & Cosecant</h3>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                    csc θ = 1/sin θ
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    sin θ = 1/csc θ
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-3">Cosine & Secant</h3>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                    sec θ = 1/cos θ
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    cos θ = 1/sec θ
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-3">Tangent & Cotangent</h3>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                    cot θ = 1/tan θ
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    tan θ = 1/cot θ
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 3
      },
      {
        id: 'quotient-identities',
        type: 'concept' as const,
        title: 'Quotient Identities',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Quotient Identities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-blue-900">Tangent</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-mono text-lg">
                        tan θ = <span className="text-blue-600">sin θ</span> / <span className="text-green-600">cos θ</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Rise over run" on the unit circle
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-purple-900">Cotangent</h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-mono text-lg">
                        cot θ = <span className="text-green-600">cos θ</span> / <span className="text-blue-600">sin θ</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      The reciprocal of tangent
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">💡 Memory Tip:</h4>
              <p className="text-gray-700">
                <strong>Tangent:</strong> "Tan goes <span className="underline">S</span>in over <span className="underline">C</span>os" <br/>
                <strong>Cotangent:</strong> "Cot goes <span className="underline">C</span>os over <span className="underline">S</span>in"
              </p>
            </div>
          </div>
        ),
        estimatedTime: 3
      },
      {
        id: 'double-angle-identities',
        type: 'concept' as const,
        title: 'Double Angle Identities',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Double Angle Identities</h2>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-900 mb-3">
                🚀 <strong>These help us find trig values for 2θ when we know θ</strong>
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Sine Double Angle</h3>
                  <div className="bg-blue-50 p-3 rounded font-mono text-center text-lg">
                    sin(2θ) = 2 sin θ cos θ
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Cosine Double Angle (3 forms!)</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-2 rounded font-mono text-center">
                      cos(2θ) = cos²θ - sin²θ
                    </div>
                    <div className="bg-green-50 p-2 rounded font-mono text-center">
                      cos(2θ) = 2cos²θ - 1
                    </div>
                    <div className="bg-green-50 p-2 rounded font-mono text-center">
                      cos(2θ) = 1 - 2sin²θ
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Tangent Double Angle</h3>
                  <div className="bg-purple-50 p-3 rounded font-mono text-center text-lg">
                    tan(2θ) = 2tan θ / (1 - tan²θ)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'half-angle-identities',
        type: 'concept' as const,
        title: 'Half Angle Identities',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Half Angle Identities</h2>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-900 mb-3">
                ⭐ <strong>These help us find exact values for angles like 15°, 22.5°, etc.</strong>
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Sine Half Angle</h3>
                  <div className="bg-blue-50 p-3 rounded font-mono text-center">
                    sin(θ/2) = ±√[(1 - cos θ)/2]
                  </div>
                  <p className="text-xs text-blue-700 mt-2 text-center">
                    Sign depends on the quadrant of θ/2
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Cosine Half Angle</h3>
                  <div className="bg-green-50 p-3 rounded font-mono text-center">
                    cos(θ/2) = ±√[(1 + cos θ)/2]
                  </div>
                  <p className="text-xs text-green-700 mt-2 text-center">
                    Sign depends on the quadrant of θ/2
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Tangent Half Angle</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-2 rounded font-mono text-center text-sm">
                      tan(θ/2) = ±√[(1 - cos θ)/(1 + cos θ)]
                    </div>
                    <div className="bg-purple-50 p-2 rounded font-mono text-center text-sm">
                      tan(θ/2) = sin θ/(1 + cos θ)
                    </div>
                    <div className="bg-purple-50 p-2 rounded font-mono text-center text-sm">
                      tan(θ/2) = (1 - cos θ)/sin θ
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'sum-difference-identities',
        type: 'concept' as const,
        title: 'Sum and Difference Identities',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Sum and Difference Identities</h2>
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-3">
                🎯 <strong>These let us find exact values for angles like 15° = 45° - 30°</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Sine Formulas</h3>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-2 rounded font-mono text-sm text-center">
                      sin(A + B) = sin A cos B + cos A sin B
                    </div>
                    <div className="bg-blue-50 p-2 rounded font-mono text-sm text-center">
                      sin(A - B) = sin A cos B - cos A sin B
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Cosine Formulas</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-2 rounded font-mono text-sm text-center">
                      cos(A + B) = cos A cos B - sin A sin B
                    </div>
                    <div className="bg-green-50 p-2 rounded font-mono text-sm text-center">
                      cos(A - B) = cos A cos B + sin A sin B
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 lg:col-span-2">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Tangent Formulas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-purple-50 p-2 rounded font-mono text-sm text-center">
                      tan(A + B) = (tan A + tan B)/(1 - tan A tan B)
                    </div>
                    <div className="bg-purple-50 p-2 rounded font-mono text-sm text-center">
                      tan(A - B) = (tan A - tan B)/(1 + tan A tan B)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">🧠 Memory Tricks:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Sine:</strong> "Sine is simple" - same pattern for both terms</li>
                <li>• <strong>Cosine:</strong> "Cosine is contrary" - signs are opposite</li>
                <li>• <strong>Tangent:</strong> "Add the tangents, but watch the denominator!"</li>
              </ul>
            </div>
          </div>
        ),
        estimatedTime: 5
      },
      {
        id: 'lesson-summary',
        type: 'summary' as const,
        title: 'Identity Master: Ready for Advanced Trigonometry!',
        content: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">🎉 Excellent! You've Mastered Trigonometric Identities</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold mb-3 text-green-800">🏆 What You've Conquered:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Pythagorean Identities
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Reciprocal Identities
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Quotient Identities
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Double Angle Identities
                  </Badge>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Half Angle Identities
                  </Badge>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sum & Difference Identities
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Key Takeaways:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Identities are mathematical tools that simplify complex expressions</li>
                <li>• The Pythagorean identity is the foundation of many others</li>
                <li>• Double and half angle formulas extend our problem-solving toolkit</li>
                <li>• Sum and difference formulas help find exact values for unusual angles</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Ready for the Next Challenge?</h4>
                  <p className="text-yellow-800 text-sm">
                    You now have a powerful arsenal of identities! Next, you'll learn to solve trigonometric equations and tackle complex applications in physics and engineering.
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
      lessonId: 'trigonometry-identities',
      currentScreen,
      totalScreens: lessonData.screens.length
    });
    onComplete?.();
  };

  const handleNext = () => {
    trackInteraction?.('next_screen', {
      lessonId: 'trigonometry-identities',
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

export default TrigonometryIdentitiesMicroLesson;