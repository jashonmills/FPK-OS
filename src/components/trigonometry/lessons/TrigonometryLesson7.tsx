import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';

interface TrigonometryLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const TrigonometryLesson7: React.FC<TrigonometryLesson7Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Real-World Applications of Trigonometry</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Discover how trigonometry solves real problems in engineering, physics, navigation, and everyday life.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Engineering Applications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Engineering and Construction</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Structural Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Engineers use trigonometry to calculate forces in bridges, buildings, and towers.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Example: Bridge Design</h5>
                    <p className="text-sm mt-2">
                      To find the tension in a cable at 30° angle supporting 1000 N:
                    </p>
                    <p className="text-sm mt-1 font-mono">
                      Tension = Weight / sin(30°) = 1000 / 0.5 = 2000 N
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Roof Construction</h4>
                  <p className="text-sm text-muted-foreground">
                    Calculating rafter lengths, angles, and material needs.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Example: Roof Pitch</h5>
                    <p className="text-sm mt-2">
                      For a roof with 20-foot span and 6-foot height:
                    </p>
                    <p className="text-sm mt-1 font-mono">
                      Angle = arctan(6/10) = 31°
                    </p>
                    <p className="text-sm mt-1 font-mono">
                      Rafter length = 10/cos(31°) = 11.7 feet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation and GPS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Navigation and GPS Systems</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">GPS Triangulation</h4>
                  <p className="text-sm text-muted-foreground">
                    GPS uses trilateration with trigonometry to pinpoint locations using satellite signals.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">How it works:</h5>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Measure distances to 3+ satellites</li>
                      <li>• Use spherical trigonometry</li>
                      <li>• Calculate intersection point</li>
                      <li>• Account for time delays and relativity</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Marine Navigation</h4>
                  <p className="text-sm text-muted-foreground">
                    Ships use trigonometry for course plotting and distance calculations.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Example: Course Correction</h5>
                    <p className="text-sm mt-2">
                      Ship is 5° off course after traveling 100 nautical miles:
                    </p>
                    <p className="text-sm mt-1 font-mono">
                      Distance off = 100 × sin(5°) = 8.7 nautical miles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Physics and Waves */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Physics and Wave Phenomena</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-700">Sound Waves</h4>
                    <p className="text-sm text-muted-foreground">
                      Audio frequencies, acoustics, and music theory all rely on trigonometric functions.
                    </p>
                    <div className="bg-white/60 p-4 rounded">
                      <h5 className="font-medium">Musical Notes</h5>
                      <p className="text-sm mt-2">
                        A 440 Hz note: y = sin(2π × 440 × t)
                      </p>
                      <p className="text-sm mt-1">
                        Higher frequency = higher pitch
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-700">Light and Optics</h4>
                    <p className="text-sm text-muted-foreground">
                      Snell's law uses trigonometry to describe light refraction.
                    </p>
                    <div className="bg-white/60 p-4 rounded">
                      <h5 className="font-medium">Snell's Law</h5>
                      <p className="text-sm mt-2 font-mono">
                        n₁sin(θ₁) = n₂sin(θ₂)
                      </p>
                      <p className="text-sm mt-1">
                        Explains why objects look bent in water
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/40 p-4 rounded">
                  <h4 className="font-semibold text-purple-700">AC Electricity</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Household electricity follows sinusoidal patterns.
                  </p>
                  <p className="text-sm font-mono">
                    V(t) = 120√2 × sin(120πt) volts (US standard)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Voltage alternates 60 times per second
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Astronomy and Space */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Astronomy and Space Exploration</h3>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-700">Planetary Motion</h4>
                  <p className="text-sm text-muted-foreground">
                    Celestial mechanics uses trigonometry to predict orbital positions.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Kepler's Laws</h5>
                    <p className="text-sm mt-2">
                      Elliptical orbits described using trigonometric functions
                    </p>
                    <p className="text-sm mt-1">
                      Position = a(cos E - e), b sin E
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-700">Satellite Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Ground stations use trigonometry to track and communicate with satellites.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Antenna Positioning</h5>
                    <p className="text-sm mt-2">
                      Azimuth and elevation angles calculated using spherical trigonometry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Computer Graphics and Animation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Computer Graphics and Gaming</h3>
            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">3D Rotations</h4>
                  <p className="text-sm text-muted-foreground">
                    Rotating objects in 3D space using rotation matrices with sine and cosine.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Rotation Matrix (2D)</h5>
                    <div className="text-sm mt-2 space-y-1 font-mono">
                      <p>[cos θ  -sin θ]</p>
                      <p>[sin θ   cos θ]</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">Animation Curves</h4>
                  <p className="text-sm text-muted-foreground">
                    Smooth animations use trigonometric functions for natural motion.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Examples</h5>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Pendulum swing: sin(ωt)</li>
                      <li>• Breathing effects: |sin(t)|</li>
                      <li>• Circular motion: (cos t, sin t)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Problem Solving */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Everyday Applications</h3>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-cyan-700">Photography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Lens focal length and field of view calculations.
                    </p>
                    <div className="text-xs font-mono bg-white/60 p-2 rounded">
                      FOV = 2 × arctan(d/2f)
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-cyan-700">Surveying</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Measuring land areas and property boundaries.
                    </p>
                    <div className="text-xs bg-white/60 p-2 rounded">
                      Height = distance × tan(angle)
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-cyan-700">Sports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Optimal angles for projectile motion in sports.
                    </p>
                    <div className="text-xs bg-white/60 p-2 rounded">
                      Max range at 45° angle
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Medical and Biological Applications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Medical and Biological Sciences</h3>
            <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-teal-700">Medical Imaging</h4>
                  <p className="text-sm text-muted-foreground">
                    CT scans and MRI use trigonometric reconstruction algorithms.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">Computed Tomography</h5>
                    <p className="text-sm mt-2">
                      Radon transform uses sinusoidal projections to rebuild 3D images from 2D slices.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-teal-700">Biorhythms</h4>
                  <p className="text-sm text-muted-foreground">
                    Circadian rhythms and heartbeat patterns follow periodic functions.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <h5 className="font-medium">ECG Analysis</h5>
                    <p className="text-sm mt-2">
                      Heart rhythm analysis uses Fourier transforms (built on trigonometry).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem-Solving Strategy */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Approaching Real-World Problems</h3>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-violet-700">Step-by-Step Problem Solving</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <h5 className="font-semibold text-sm">1. Understand the Problem</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      • What are you trying to find?<br/>
                      • What information is given?<br/>
                      • What are the constraints?
                    </p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <h5 className="font-semibold text-sm">2. Draw a Diagram</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      • Visualize the situation<br/>
                      • Label known values<br/>
                      • Identify the triangle(s)
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <h5 className="font-semibold text-sm">3. Choose the Right Function</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      • SOHCAHTOA for right triangles<br/>
                      • Law of sines/cosines for others<br/>
                      • Consider what you know vs. need
                    </p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <h5 className="font-semibold text-sm">4. Solve and Verify</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      • Set up the equation<br/>
                      • Solve algebraically<br/>
                      • Check if answer makes sense
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Conclusion */}
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg border-2 border-gold-200">
            <h3 className="text-xl font-semibold text-gold-700 mb-4">🎉 Congratulations!</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You've completed your journey through trigonometry! From basic SOHCAHTOA to complex 
                real-world applications, you now have the tools to solve problems involving angles, 
                waves, rotations, and periodic phenomena.
              </p>
              <div className="bg-white/60 p-4 rounded">
                <h4 className="font-semibold text-gold-700 mb-2">What You've Mastered:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Right triangle trigonometry (SOHCAHTOA)</li>
                  <li>✓ Unit circle and trigonometric functions</li>
                  <li>✓ Graphing sine, cosine, and tangent</li>
                  <li>✓ Trigonometric identities and proofs</li>
                  <li>✓ Solving trigonometric equations</li>
                  <li>✓ Real-world applications across multiple fields</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Remember: Trigonometry is more than formulas and techniques—it's a way of understanding 
                the mathematical patterns that govern our world. Keep practicing and you'll continue 
                to see these concepts everywhere!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 7 of 7 • Real-World Applications
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Complete Course
            </Button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Course Completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};