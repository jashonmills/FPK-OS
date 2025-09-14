import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface TrigonometryLesson2Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const TrigonometryLesson2: React.FC<TrigonometryLesson2Props> = ({
  onComplete, 
  onNext, 
  hasNext,
  isCompleted = false,
  trackInteraction,
  lessonId = 2,
  lessonTitle = "SOHCAHTOA and Basic Functions"
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    trackInteraction?.('lesson_complete_click', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      action: 'complete_button_clicked'
    });
    onComplete();
  };

  const handleConceptClick = (concept: string) => {
    trackInteraction?.('concept_interaction', {
      lesson_id: lessonId,
      concept,
      action: 'concept_viewed'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle="Sine, Cosine, and Tangent"
        lessonNumber={2}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Sine, Cosine, and Tangent (SOHCAHTOA)</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn the three fundamental trigonometric functions and master the SOHCAHTOA mnemonic.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SOHCAHTOA Introduction */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
            <h3 className="text-2xl font-bold text-center text-purple-700 mb-4">SOH CAH TOA</h3>
            <p className="text-center text-muted-foreground mb-6">
              The most important mnemonic in trigonometry! It helps you remember the three basic trig functions.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-red-100 text-red-700 font-bold text-xl p-4 rounded-lg">SOH</div>
                <div>
                  <h4 className="font-semibold text-red-700">Sine</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>S</strong>ine = <strong>O</strong>pposite / <strong>H</strong>ypotenuse
                  </p>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-blue-100 text-blue-700 font-bold text-xl p-4 rounded-lg">CAH</div>
                <div>
                  <h4 className="font-semibold text-blue-700">Cosine</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>C</strong>osine = <strong>A</strong>djacent / <strong>H</strong>ypotenuse
                  </p>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-green-100 text-green-700 font-bold text-xl p-4 rounded-lg">TOA</div>
                <div>
                  <h4 className="font-semibold text-green-700">Tangent</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>T</strong>angent = <strong>O</strong>pposite / <strong>A</strong>djacent
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Explanations */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Understanding Each Function</h3>
            
            {/* Sine Function */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-700">Sine (sin)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-medium text-red-700 mb-2">sin(θ) = opposite / hypotenuse</p>
                  <p className="text-sm text-muted-foreground">
                    Sine tells you the ratio of the opposite side to the hypotenuse for any angle θ.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Common Values:</h5>
                    <ul className="text-sm space-y-1">
                      <li>sin(0°) = 0</li>
                      <li>sin(30°) = 1/2</li>
                      <li>sin(45°) = √2/2 ≈ 0.707</li>
                      <li>sin(60°) = √3/2 ≈ 0.866</li>
                      <li>sin(90°) = 1</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Real-world uses:</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Wave patterns (sound, light)</li>
                      <li>Vertical height calculations</li>
                      <li>Oscillation analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cosine Function */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">Cosine (cos)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-700 mb-2">cos(θ) = adjacent / hypotenuse</p>
                  <p className="text-sm text-muted-foreground">
                    Cosine tells you the ratio of the adjacent side to the hypotenuse for any angle θ.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Common Values:</h5>
                    <ul className="text-sm space-y-1">
                      <li>cos(0°) = 1</li>
                      <li>cos(30°) = √3/2 ≈ 0.866</li>
                      <li>cos(45°) = √2/2 ≈ 0.707</li>
                      <li>cos(60°) = 1/2</li>
                      <li>cos(90°) = 0</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Real-world uses:</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Horizontal distance calculations</li>
                      <li>Engineering projections</li>
                      <li>Physics force analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tangent Function */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Tangent (tan)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-700 mb-2">tan(θ) = opposite / adjacent</p>
                  <p className="text-sm text-muted-foreground">
                    Tangent tells you the ratio of the opposite side to the adjacent side for any angle θ.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Common Values:</h5>
                    <ul className="text-sm space-y-1">
                      <li>tan(0°) = 0</li>
                      <li>tan(30°) = 1/√3 ≈ 0.577</li>
                      <li>tan(45°) = 1</li>
                      <li>tan(60°) = √3 ≈ 1.732</li>
                      <li>tan(90°) = undefined</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Real-world uses:</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Slope calculations</li>
                      <li>Architecture and construction</li>  
                      <li>Navigation and surveying</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Relationships */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-700 mb-4">Important Relationships</h3>
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded">
                <p className="font-medium">Tangent Quotient Identity:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  tan(θ) = sin(θ) / cos(θ) 
                  <span className="ml-2 text-xs">(This is why tan(90°) is undefined!)</span>
                </p>
              </div>
              <div className="bg-white/60 p-3 rounded">
                <p className="font-medium">Pythagorean Identity:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  sin²(θ) + cos²(θ) = 1
                  <span className="ml-2 text-xs">(Always true for any angle θ)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Memory Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Memory Tips</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Alternative SOHCAHTOA phrases:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
                  <li>"Some Old Hippie Caught Another Hippie Tripping On Acid"</li>
                  <li>"Silly Old Harry Caught A Herring Trawling Off Alaska"</li>
                  <li>"Some Old Hag Cracked All Her Teeth On Aspirin"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Quick Reference:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Think of a right triangle and identify which side is which relative to your angle of interest!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 2 of 7 • SOHCAHTOA
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
    </div>
  );
};