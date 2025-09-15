import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { InCourseChatBubble } from '@/components/course/InCourseChatBubble';

interface TrigonometryLesson4Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const TrigonometryLesson4: React.FC<TrigonometryLesson4Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Graphing Trigonometric Functions</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn to graph sine, cosine, and tangent functions and understand their key characteristics.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sine Graph */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-red-700">The Sine Function: y = sin(x)</h3>
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Characteristics:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Domain:</strong> All real numbers (-∞, ∞)</li>
                    <li><strong>Range:</strong> [-1, 1]</li>
                    <li><strong>Period:</strong> 2π (360°)</li>
                    <li><strong>Amplitude:</strong> 1</li>
                    <li><strong>Y-intercept:</strong> (0, 0)</li>
                    <li><strong>Shape:</strong> Smooth, continuous wave</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Key Points (0 to 2π):</h4>
                  <div className="text-sm space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <span>x = 0</span><span>y = 0</span>
                      <span>x = π/2</span><span>y = 1</span>
                      <span>x = π</span><span>y = 0</span>
                      <span>x = 3π/2</span><span>y = -1</span>
                      <span>x = 2π</span><span>y = 0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/40 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Memory tip:</strong> The sine curve starts at the origin, goes up to 1, back down through 0 to -1, and returns to 0.
                </p>
              </div>
            </div>
          </div>

          {/* Cosine Graph */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">The Cosine Function: y = cos(x)</h3>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Characteristics:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Domain:</strong> All real numbers (-∞, ∞)</li>
                    <li><strong>Range:</strong> [-1, 1]</li>
                    <li><strong>Period:</strong> 2π (360°)</li>
                    <li><strong>Amplitude:</strong> 1</li>
                    <li><strong>Y-intercept:</strong> (0, 1)</li>
                    <li><strong>Shape:</strong> Same as sine, shifted left π/2</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Key Points (0 to 2π):</h4>
                  <div className="text-sm space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <span>x = 0</span><span>y = 1</span>
                      <span>x = π/2</span><span>y = 0</span>
                      <span>x = π</span><span>y = -1</span>
                      <span>x = 3π/2</span><span>y = 0</span>
                      <span>x = 2π</span><span>y = 1</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/40 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Relationship:</strong> cos(x) = sin(x + π/2). The cosine curve is the sine curve shifted left by π/2.
                </p>
              </div>
            </div>
          </div>

          {/* Tangent Graph */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">The Tangent Function: y = tan(x)</h3>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Characteristics:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Domain:</strong> All reals except odd multiples of π/2</li>
                    <li><strong>Range:</strong> All real numbers (-∞, ∞)</li>
                    <li><strong>Period:</strong> π (180°)</li>
                    <li><strong>Amplitude:</strong> No amplitude (unbounded)</li>
                    <li><strong>Y-intercept:</strong> (0, 0)</li>
                    <li><strong>Asymptotes:</strong> x = π/2 + nπ (vertical lines)</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Key Points (-π/2 to π/2):</h4>
                  <div className="text-sm space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <span>x = -π/4</span><span>y = -1</span>
                      <span>x = 0</span><span>y = 0</span>
                      <span>x = π/4</span><span>y = 1</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Asymptotes at x = ±π/2</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/40 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Unique feature:</strong> Tangent has vertical asymptotes where cosine equals zero, because tan(x) = sin(x)/cos(x).
                </p>
              </div>
            </div>
          </div>

          {/* Graph Transformations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Graph Transformations</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">General Form: y = A sin(B(x - C)) + D</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-semibold text-purple-700">Parameter Effects:</h5>
                    <ul className="space-y-2 text-sm mt-2">
                      <li><strong>A (Amplitude):</strong> Vertical stretch/compression</li>
                      <li><strong>B (Frequency):</strong> Horizontal stretch/compression</li>
                      <li><strong>C (Phase Shift):</strong> Horizontal translation</li>
                      <li><strong>D (Vertical Shift):</strong> Vertical translation</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <h6 className="font-medium">Period Calculation:</h6>
                    <p className="text-sm mt-1">New Period = 2π/|B|</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <h6 className="font-medium">Examples:</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>y = 2sin(x): Amplitude = 2</li>
                      <li>y = sin(2x): Period = π</li>
                      <li>y = sin(x - π/4): Phase shift right π/4</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graphing Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Step-by-Step Graphing Process</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">For Sine and Cosine:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Identify amplitude, period, phase shift, and vertical shift</li>
                    <li>Draw the midline (y = D)</li>
                    <li>Mark the period on x-axis</li>
                    <li>Plot key points within one period</li>
                    <li>Draw smooth curve through points</li>
                    <li>Extend pattern for additional periods</li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">For Tangent:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Find the period (π/|B|)</li>
                    <li>Locate vertical asymptotes</li>
                    <li>Find zeros (where graph crosses x-axis)</li>
                    <li>Plot points between asymptotes</li>
                    <li>Draw curves approaching asymptotes</li>
                    <li>Repeat pattern for other periods</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Common Applications */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-amber-700 mb-4">Real-World Applications</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/60 p-4 rounded">
                <h4 className="font-semibold text-amber-700">Sound Waves</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Audio frequencies are modeled using sine and cosine waves. Higher frequencies = higher pitch.
                </p>
              </div>
              <div className="bg-white/60 p-4 rounded">
                <h4 className="font-semibold text-amber-700">AC Electricity</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Alternating current follows sinusoidal patterns, switching direction periodically.
                </p>
              </div>
              <div className="bg-white/60 p-4 rounded">
                <h4 className="font-semibold text-amber-700">Tides & Seasons</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Ocean tides and seasonal temperature changes follow periodic sine/cosine patterns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 4 of 7 • Graphing Trig Functions
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Mark as Complete
            </Button>
          )}
          {isCompleted && hasNext && (
            <Button onClick={onNext} className="fpk-gradient text-white">
              Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* In-Course AI Tutor Chat Bubble */}
      <InCourseChatBubble
        courseId="interactive-trigonometry"
        lessonId={4}
        lessonTitle="Graphing Trigonometric Functions"
        lessonContentRef={lessonContentRef}
      />
    </div>
  );
};