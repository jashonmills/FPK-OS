import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface TrigonometryLesson5Props {
  onComplete?: () => void;
  onNext?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, details: any) => void;
}

export const TrigonometryLesson5: React.FC<TrigonometryLesson5Props> = ({
  onComplete,
  onNext,
  isCompleted,
  trackInteraction
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6" ref={lessonContentRef}>
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Trigonometric Identities</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Explore and master the fundamental trigonometric identities that form the foundation of advanced trigonometry.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fundamental Identities */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Fundamental Identities</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">The Big Three - Know These By Heart!</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <h5 className="font-semibold text-blue-700">Pythagorean Identity</h5>
                  <p className="text-lg font-bold mt-2">sin²θ + cos²θ = 1</p>
                  <p className="text-xs text-muted-foreground mt-2">Always true for any angle θ</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <h5 className="font-semibold text-green-700">Quotient Identity</h5>
                  <p className="text-lg font-bold mt-2">tan θ = sin θ / cos θ</p>
                  <p className="text-xs text-muted-foreground mt-2">Wherever cos θ ≠ 0</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <h5 className="font-semibold text-purple-700">Reciprocal Identities</h5>
                  <div className="text-sm mt-2 space-y-1">
                    <p>csc θ = 1/sin θ</p>
                    <p>sec θ = 1/cos θ</p>
                    <p>cot θ = 1/tan θ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Pythagorean Identities */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Extended Pythagorean Identities</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">From sin²θ + cos²θ = 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-semibold">Divide by cos²θ:</p>
                    <p className="text-sm mt-1">tan²θ + 1 = sec²θ</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-semibold">Divide by sin²θ:</p>
                    <p className="text-sm mt-1">1 + cot²θ = csc²θ</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These are extremely useful for simplifying expressions!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Quick Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm space-y-1">
                    <p><strong>Identity 1:</strong> sin²θ + cos²θ = 1</p>
                    <p><strong>Identity 2:</strong> 1 + tan²θ = sec²θ</p>
                    <p><strong>Identity 3:</strong> 1 + cot²θ = csc²θ</p>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                    <p><strong>Memory tip:</strong> Start with the basic identity and manipulate algebraically!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Even-Odd Identities */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Even and Odd Function Identities</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Even Functions (Symmetric about y-axis)</h4>
                  <div className="bg-white/60 p-4 rounded">
                    <p className="font-medium">cos(-θ) = cos θ</p>
                    <p className="font-medium">sec(-θ) = sec θ</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      These functions don't change when you negate the angle.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">Odd Functions (Symmetric about origin)</h4>
                  <div className="bg-white/60 p-4 rounded">
                    <p className="font-medium">sin(-θ) = -sin θ</p>
                    <p className="font-medium">tan(-θ) = -tan θ</p>
                    <p className="font-medium">csc(-θ) = -csc θ</p>
                    <p className="font-medium">cot(-θ) = -cot θ</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      These functions change sign when you negate the angle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cofunction Identities */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Cofunction Identities</h3>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-orange-700">Complementary Angle Relationships</h4>
              <p className="text-muted-foreground mb-4">
                These identities relate functions of complementary angles (angles that sum to 90°):
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/60 p-4 rounded">
                  <h5 className="font-semibold mb-3">Basic Cofunctions:</h5>
                  <div className="space-y-2 text-sm">
                    <p>sin θ = cos(90° - θ)</p>
                    <p>cos θ = sin(90° - θ)</p>
                    <p>tan θ = cot(90° - θ)</p>
                    <p>cot θ = tan(90° - θ)</p>
                    <p>sec θ = csc(90° - θ)</p>
                    <p>csc θ = sec(90° - θ)</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded">
                  <h5 className="font-semibold mb-3">Examples:</h5>
                  <div className="space-y-2 text-sm">
                    <p>sin 30° = cos 60°</p>
                    <p>cos 45° = sin 45°</p>
                    <p>tan 20° = cot 70°</p>
                  </div>
                  <div className="mt-3 p-2 bg-orange-50 rounded text-xs">
                    <p><strong>Why "cofunction"?</strong> The "co" stands for "complementary"!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sum and Difference Formulas */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Sum and Difference Formulas</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sine Addition Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">sin(A + B) = sin A cos B + cos A sin B</p>
                        <p className="font-semibold mt-2">sin(A - B) = sin A cos B - cos A sin B</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Example:</strong></p>
                        <p>sin(75°) = sin(45° + 30°)</p>
                        <p>= sin 45° cos 30° + cos 45° sin 30°</p>
                        <p>= (√2/2)(√3/2) + (√2/2)(1/2)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cosine Addition Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">cos(A + B) = cos A cos B - sin A sin B</p>
                        <p className="font-semibold mt-2">cos(A - B) = cos A cos B + sin A sin B</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Note the signs!</strong></p>
                        <p>Cosine addition uses opposite signs from sine.</p>
                        <p>Addition formula has minus, subtraction has plus.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tangent Addition Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded">
                    <div className="space-y-3">
                      <p className="font-semibold">tan(A + B) = (tan A + tan B) / (1 - tan A tan B)</p>
                      <p className="font-semibold">tan(A - B) = (tan A - tan B) / (1 + tan A tan B)</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Warning:</strong> These formulas are undefined when the denominator equals zero!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Double Angle Formulas */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Double Angle Formulas</h3>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-violet-700">When A = B in Addition Formulas</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded text-center">
                  <h5 className="font-semibold text-red-700">Sine</h5>
                  <p className="font-bold mt-2">sin(2θ) = 2 sin θ cos θ</p>
                </div>
                <div className="bg-white/60 p-4 rounded text-center">
                  <h5 className="font-semibold text-blue-700">Cosine</h5>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="font-bold">cos(2θ) = cos²θ - sin²θ</p>
                    <p>= 2cos²θ - 1</p>
                    <p>= 1 - 2sin²θ</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded text-center">
                  <h5 className="font-semibold text-green-700">Tangent</h5>
                  <p className="font-bold mt-2">tan(2θ) = 2tan θ / (1 - tan²θ)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Using Identities */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">How to Use These Identities</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Verification Problems:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Start with the more complex side</li>
                  <li>• Use fundamental identities first</li>
                  <li>• Factor when possible</li>
                  <li>• Convert everything to sin and cos if stuck</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Simplification Tips:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Look for perfect squares (sin²θ + cos²θ = 1)</li>
                  <li>• Substitute equivalent expressions</li>
                  <li>• Use reciprocal identities to eliminate fractions</li>
                  <li>• Factor out common terms</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};