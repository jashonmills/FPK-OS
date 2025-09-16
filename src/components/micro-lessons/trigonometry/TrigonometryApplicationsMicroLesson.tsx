import React, { useState } from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, CheckCircle, Lightbulb, Target, BookOpen, ChevronRight, Waves, Building2, Satellite, Zap } from 'lucide-react';

interface TrigonometryApplicationsMicroLessonProps {
  onComplete?: () => void;
  trackInteraction?: (action: string, details: any) => void;
}

const TrigonometryApplicationsMicroLesson: React.FC<TrigonometryApplicationsMicroLessonProps> = ({
  onComplete,
  trackInteraction
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const lessonData = {
    id: 'trigonometry-applications',
    moduleTitle: 'Advanced Trigonometry Applications',
    totalScreens: 9,
    screens: [
      {
        id: 'applications-intro',
        type: 'concept' as const,
        title: 'Trigonometry in the Modern World',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Trigonometry in the Modern World</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-3">
                🌍 <strong>Beyond the Classroom:</strong>
              </p>
              <p className="text-blue-800 leading-relaxed">
                Trigonometry isn't just academic - it's the mathematical foundation behind GPS navigation, 3D graphics, architectural design, wave analysis, and countless technologies that shape our daily lives!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Satellite className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Navigation</h3>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• GPS positioning</li>
                    <li>• Aviation routes</li>
                    <li>• Maritime navigation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Engineering</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Structural analysis</li>
                    <li>• Bridge design</li>
                    <li>• Earthquake modeling</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Waves className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Physics</h3>
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Sound waves</li>
                    <li>• Light behavior</li>
                    <li>• Quantum mechanics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Technology</h3>
                  </div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Computer graphics</li>
                    <li>• Signal processing</li>
                    <li>• Robotics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">💡 Did You Know?</h4>
              <p className="text-yellow-800 text-sm">
                Every time you use your smartphone's GPS, watch a 3D movie, listen to music, or even use a washing machine, trigonometry is working behind the scenes to make it all possible!
              </p>
            </div>
          </div>
        ),
        estimatedTime: 3
      },
      {
        id: 'wave-analysis',
        type: 'concept' as const,
        title: 'Wave Analysis and Signal Processing',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Wave Analysis and Signal Processing</h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-3">
                🌊 <strong>Everything is Waves:</strong> Sound, light, radio, WiFi, ocean waves - all described by trigonometry!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Sound Wave Mathematics</h3>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-mono text-sm text-center">y(t) = A sin(2πft + φ)</p>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <p><strong>A:</strong> Amplitude (volume)</p>
                      <p><strong>f:</strong> Frequency (pitch)</p>
                      <p><strong>φ:</strong> Phase (timing)</p>
                    </div>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Music:</strong> A = 440Hz gives middle A note</li>
                    <li>• <strong>Audio processing:</strong> Digital filters use trig functions</li>
                    <li>• <strong>Acoustics:</strong> Concert hall design uses wave interference</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Radio and Communication</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p><strong>AM Radio:</strong> y(t) = [1 + m cos(ωₘt)] cos(ωct)</p>
                    <p><strong>FM Radio:</strong> y(t) = A cos[ωct + β sin(ωₘt)]</p>
                    <p><strong>Applications:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Cell phone signal modulation</li>
                      <li>• WiFi data transmission</li>
                      <li>• Satellite communication</li>
                      <li>• Bluetooth protocols</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Fourier Analysis</h3>
                  <div className="bg-purple-50 p-3 rounded mb-2">
                    <p className="text-sm text-purple-800">
                      Any complex wave can be broken down into simple sine and cosine components!
                    </p>
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Image compression:</strong> JPEG uses 2D Fourier transforms</li>
                    <li>• <strong>Music analysis:</strong> Identify individual notes in chords</li>
                    <li>• <strong>Medical imaging:</strong> MRI and CT scans</li>
                    <li>• <strong>Seismology:</strong> Earthquake wave analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'navigation-gps',
        type: 'concept' as const,
        title: 'Navigation and GPS Technology',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Navigation and GPS Technology</h2>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-900 mb-3">
                📍 <strong>GPS Magic:</strong> How does your phone know exactly where you are? Trigonometry!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">GPS Triangulation</h3>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Process:</strong> Measure distances to at least 4 satellites using time signals
                    </p>
                    <div className="font-mono text-xs space-y-1">
                      <p>Distance = Speed of Light × Time Difference</p>
                      <p>Position = Intersection of spheres (trigonometry!)</p>
                    </div>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Each satellite creates a sphere of possible positions</li>
                    <li>• Trigonometric calculations find sphere intersections</li>
                    <li>• 4+ satellites provide unique 3D position</li>
                    <li>• Accuracy: Within 3-5 meters worldwide!</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Spherical Trigonometry</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-green-800">
                      <strong>Challenge:</strong> Earth is round, not flat! We need spherical trig.
                    </p>
                    <div className="bg-green-50 p-2 rounded text-xs">
                      <p><strong>Great Circle Distance:</strong></p>
                      <p className="font-mono">d = R × arccos(sin φ₁ sin φ₂ + cos φ₁ cos φ₂ cos Δλ)</p>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• φ₁, φ₂: Latitudes of two points</li>
                      <li>• Δλ: Difference in longitude</li>
                      <li>• R: Earth's radius (≈ 6371 km)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Aviation Navigation</h3>
                  <div className="space-y-2 text-sm text-purple-800">
                    <p><strong>Dead Reckoning:</strong> Navigate using speed, time, and direction</p>
                    <div className="bg-purple-50 p-2 rounded font-mono text-xs">
                      <p>New Position = Old Position + (Speed × Time × [cos θ, sin θ])</p>
                    </div>
                    <ul className="space-y-1">
                      <li>• <strong>Wind correction:</strong> Vector addition with trigonometry</li>
                      <li>• <strong>Radio beacons:</strong> Triangulate using signal directions</li>
                      <li>• <strong>Celestial navigation:</strong> Use star positions and sextants</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-red-900">Modern Applications</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• <strong>Autonomous vehicles:</strong> Real-time position tracking</li>
                    <li>• <strong>Delivery drones:</strong> Precise route calculation</li>
                    <li>• <strong>Emergency services:</strong> Accurate location for 911 calls</li>
                    <li>• <strong>Precision agriculture:</strong> GPS-guided farming equipment</li>
                    <li>• <strong>Surveying:</strong> Land mapping and construction</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'computer-graphics',
        type: 'concept' as const,
        title: '3D Graphics and Animation',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">3D Graphics and Animation</h2>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-3">
                🎮 <strong>Digital Worlds:</strong> Every 3D game, movie, and VR experience relies heavily on trigonometry!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">3D Transformations</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Rotation Matrices:</p>
                      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                        <p><strong>X-axis:</strong> [1, 0, 0; 0, cos θ, -sin θ; 0, sin θ, cos θ]</p>
                        <p><strong>Y-axis:</strong> [cos θ, 0, sin θ; 0, 1, 0; -sin θ, 0, cos θ]</p>
                        <p><strong>Z-axis:</strong> [cos θ, -sin θ, 0; sin θ, cos θ, 0; 0, 0, 1]</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Game objects:</strong> Rotate characters and props</li>
                      <li>• <strong>Camera systems:</strong> Look around in 3D space</li>
                      <li>• <strong>Animation:</strong> Smooth object movement</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Perspective Projection</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Converting 3D world to 2D screen:</strong>
                      </p>
                      <div className="font-mono text-xs">
                        <p>screen_x = (3D_x × focal_length) / 3D_z</p>
                        <p>screen_y = (3D_y × focal_length) / 3D_z</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Field of view:</strong> Uses tangent function for viewing angle</li>
                      <li>• <strong>Depth perception:</strong> Objects appear smaller when farther</li>
                      <li>• <strong>Clipping planes:</strong> What's visible on screen</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Lighting and Shading</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm text-purple-800 mb-2">
                        <strong>Lambertian Reflection (Diffuse lighting):</strong>
                      </p>
                      <p className="font-mono text-xs">Intensity = Light_Power × cos(angle_to_surface)</p>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>Surface normals:</strong> Calculate lighting angles</li>
                      <li>• <strong>Specular highlights:</strong> Mirror-like reflections</li>
                      <li>• <strong>Shadow mapping:</strong> Determine what's in shadow</li>
                      <li>• <strong>Ray tracing:</strong> Simulate light bouncing realistically</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Animation and Physics</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Keyframe interpolation:</strong> Smooth movement between poses</li>
                    <li>• <strong>Inverse kinematics:</strong> Calculate joint angles for character movement</li>
                    <li>• <strong>Particle systems:</strong> Simulate fire, water, explosions</li>
                    <li>• <strong>Collision detection:</strong> Determine when objects intersect</li>
                    <li>• <strong>Procedural animation:</strong> Generate realistic motion</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 5
      },
      {
        id: 'engineering-structures',
        type: 'concept' as const,
        title: 'Engineering and Architecture',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Engineering and Architecture</h2>
            
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-900 mb-3">
                🏗️ <strong>Building the World:</strong> From bridges to skyscrapers, trigonometry ensures structures stand strong!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Structural Analysis</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Force Resolution in Trusses:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>F_x = F × cos(θ) (horizontal component)</p>
                        <p>F_y = F × sin(θ) (vertical component)</p>
                        <p>ΣF_x = 0, ΣF_y = 0 (equilibrium)</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Bridge design:</strong> Analyze forces in each beam</li>
                      <li>• <strong>Roof trusses:</strong> Distribute weight safely</li>
                      <li>• <strong>Tower structures:</strong> Handle wind and seismic loads</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Surveying and Construction</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded text-sm">
                      <p><strong>Theodolite measurements:</strong> Measure angles and distances</p>
                      <p><strong>Elevation calculations:</strong> h = d × tan(elevation_angle)</p>
                      <p><strong>Property boundaries:</strong> Use bearings and distances</p>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Land surveying:</strong> Map property lines accurately</li>
                      <li>• <strong>Road design:</strong> Calculate slopes and curves</li>
                      <li>• <strong>Building foundations:</strong> Ensure level construction</li>
                      <li>• <strong>Tunnel projects:</strong> Meet precisely from both ends</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Earthquake Engineering</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm text-purple-800 mb-2">
                        <strong>Seismic Wave Analysis:</strong>
                      </p>
                      <p className="font-mono text-xs">Ground Motion = A × sin(2πft + φ)</p>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>Resonance frequency:</strong> Avoid matching building frequency</li>
                      <li>• <strong>Damping systems:</strong> Reduce oscillation amplitude</li>
                      <li>• <strong>Base isolation:</strong> Decouple building from ground motion</li>
                      <li>• <strong>Seismic retrofitting:</strong> Strengthen existing structures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Modern Applications</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Wind turbines:</strong> Optimal blade angles for energy capture</li>
                    <li>• <strong>Solar panels:</strong> Track sun position throughout day</li>
                    <li>• <strong>Stadium design:</strong> Ensure good sightlines for all seats</li>
                    <li>• <strong>Acoustic engineering:</strong> Design concert halls with perfect sound</li>
                    <li>• <strong>HVAC systems:</strong> Optimize airflow patterns</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'physics-applications',
        type: 'concept' as const,
        title: 'Physics and Natural Phenomena',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Physics and Natural Phenomena</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-3">
                ⚛️ <strong>Nature's Mathematics:</strong> The universe speaks in waves, rotations, and oscillations - all trigonometry!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Simple Harmonic Motion</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Universal equation for oscillation:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>x(t) = A cos(ωt + φ)</p>
                        <p>v(t) = -Aω sin(ωt + φ)</p>
                        <p>a(t) = -Aω² cos(ωt + φ)</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Pendulums:</strong> Clock mechanisms, seismometers</li>
                      <li>• <strong>Springs:</strong> Car suspension, watch mechanisms</li>
                      <li>• <strong>Molecules:</strong> Vibration modes in chemistry</li>
                      <li>• <strong>Atoms:</strong> Electron orbital motion</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Wave Physics</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Wave equation fundamentals:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>y = A sin(kx - ωt + φ)</p>
                        <p>v = fλ = ω/k</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Ocean waves:</strong> Predict wave height and timing</li>
                      <li>• <strong>Electromagnetic radiation:</strong> Radio to gamma rays</li>
                      <li>• <strong>Quantum mechanics:</strong> Particle wave functions</li>
                      <li>• <strong>Interference patterns:</strong> Constructive and destructive</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Circular Motion and Orbits</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm text-purple-800 mb-2">
                        <strong>Position in circular motion:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>x = r cos(ωt), y = r sin(ωt)</p>
                        <p>Centripetal force = mv²/r</p>
                      </div>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>Planetary orbits:</strong> Kepler's laws and elliptical motion</li>
                      <li>• <strong>Satellite mechanics:</strong> Orbital periods and velocities</li>
                      <li>• <strong>Atomic structure:</strong> Electron energy levels</li>
                      <li>• <strong>Cyclotrons:</strong> Particle accelerator design</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-red-900">Electromagnetic Applications</h3>
                  <div className="space-y-2">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm text-red-800 mb-2">
                        <strong>AC Electricity:</strong>
                      </p>
                      <p className="font-mono text-xs">V(t) = V₀ sin(2πft), I(t) = I₀ sin(2πft + φ)</p>
                    </div>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• <strong>Power generation:</strong> Rotating generators create sinusoidal voltage</li>
                      <li>• <strong>Transformers:</strong> Voltage conversion using phase relationships</li>
                      <li>• <strong>Motors:</strong> Magnetic field rotation drives motion</li>
                      <li>• <strong>Antennas:</strong> Electromagnetic wave radiation patterns</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'medical-imaging',
        type: 'concept' as const,
        title: 'Medical and Biological Applications',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Medical and Biological Applications</h2>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
              <p className="text-sm font-medium text-teal-900 mb-3">
                🏥 <strong>Saving Lives:</strong> Modern medical technology relies heavily on trigonometry for diagnosis and treatment!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Medical Imaging</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>CT Scan Reconstruction:</strong>
                      </p>
                      <p className="text-xs text-blue-800">
                        Uses Radon transform and inverse Fourier transforms to reconstruct 3D images from 2D X-ray slices
                      </p>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>MRI:</strong> Fourier transforms convert signals to images</li>
                      <li>• <strong>Ultrasound:</strong> Doppler effect measures blood flow</li>
                      <li>• <strong>PET scans:</strong> Triangulate radioactive decay locations</li>
                      <li>• <strong>X-ray crystallography:</strong> Determine protein structures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Biomechanics and Movement</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Joint Analysis:</strong>
                      </p>
                      <div className="font-mono text-xs">
                        <p>Torque = Force × Distance × sin(angle)</p>
                        <p>Work = Force × Distance × cos(angle)</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Gait analysis:</strong> Study walking patterns for prosthetics</li>
                      <li>• <strong>Sports medicine:</strong> Optimize athletic performance</li>
                      <li>• <strong>Rehabilitation:</strong> Design therapy exercises</li>
                      <li>• <strong>Ergonomics:</strong> Prevent workplace injuries</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Cardiovascular Analysis</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm text-purple-800 mb-2">
                        <strong>Heart Rate Variability:</strong>
                      </p>
                      <p className="font-mono text-xs">ECG = Σ Aₙ sin(nωt + φₙ)</p>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>ECG analysis:</strong> Detect irregular heart rhythms</li>
                      <li>• <strong>Blood flow modeling:</strong> Pulsatile flow in arteries</li>
                      <li>• <strong>Blood pressure:</strong> Systolic/diastolic oscillations</li>
                      <li>• <strong>Cardiac catheterization:</strong> Navigation using angles</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Biological Rhythms</h3>
                  <div className="space-y-2">
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-sm text-orange-800 mb-2">
                        <strong>Circadian rhythms and biological cycles:</strong>
                      </p>
                      <p className="font-mono text-xs">Activity = A₀ + A₁ cos(2πt/24 + φ)</p>
                    </div>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• <strong>Sleep studies:</strong> Analyze sleep-wake cycles</li>
                      <li>• <strong>Hormone cycles:</strong> Model reproductive cycles</li>
                      <li>• <strong>Seasonal affective disorder:</strong> Light therapy timing</li>
                      <li>• <strong>Drug delivery:</strong> Optimize medication timing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-red-900">Epidemiology and Disease Modeling</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• <strong>Disease spread:</strong> SIR models with periodic outbreaks</li>
                    <li>• <strong>Vaccination strategies:</strong> Optimize timing and coverage</li>
                    <li>• <strong>Population dynamics:</strong> Model birth/death rates</li>
                    <li>• <strong>Cancer growth:</strong> Exponential and logistic models</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'future-technologies',
        type: 'concept' as const,
        title: 'Emerging Technologies and Future Applications',
        content: (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Emerging Technologies and Future Applications</h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-3">
                🚀 <strong>The Future:</strong> Cutting-edge technologies pushing trigonometry to new frontiers!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-blue-900">Artificial Intelligence and Machine Learning</h3>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Neural Network Activations:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>Sigmoid: σ(x) = 1/(1 + e⁻ˣ)</p>
                        <p>Tanh: tanh(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ)</p>
                        <p>GELU: x × Φ(x) (uses error function)</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Transformers:</strong> Attention mechanisms use trigonometric position encoding</li>
                      <li>• <strong>CNNs:</strong> Convolution operations for image recognition</li>
                      <li>• <strong>Signal processing:</strong> Fourier transforms in audio AI</li>
                      <li>• <strong>Optimization:</strong> Gradient descent on complex surfaces</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Quantum Computing</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Quantum State Representation:</strong>
                      </p>
                      <div className="font-mono text-xs space-y-1">
                        <p>|ψ⟩ = α|0⟩ + β|1⟩</p>
                        <p>α = cos(θ/2), β = e^(iφ)sin(θ/2)</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Bloch sphere:</strong> Visualize qubit states using spherical coordinates</li>
                      <li>• <strong>Quantum gates:</strong> Rotation operations on the Bloch sphere</li>
                      <li>• <strong>Interference:</strong> Quantum amplitude combination</li>
                      <li>• <strong>Error correction:</strong> Stabilizer codes and syndrome detection</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-purple-900">Augmented and Virtual Reality</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded text-sm">
                      <p><strong>Head tracking and spatial mapping:</strong></p>
                      <p>Real-time 6DOF position and orientation tracking</p>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>SLAM:</strong> Simultaneous localization and mapping</li>
                      <li>• <strong>Occlusion handling:</strong> Hide virtual objects behind real ones</li>
                      <li>• <strong>Hand tracking:</strong> Gesture recognition using joint angles</li>
                      <li>• <strong>Spatial audio:</strong> 3D sound positioning using HRTFs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-orange-900">Autonomous Systems</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Self-driving cars:</strong> LIDAR point cloud processing</li>
                    <li>• <strong>Drone swarms:</strong> Coordinated flight patterns</li>
                    <li>• <strong>Robot manipulation:</strong> Inverse kinematics for precise movement</li>
                    <li>• <strong>Space exploration:</strong> Autonomous navigation on other planets</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-red-900">Climate and Environmental Modeling</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• <strong>Weather prediction:</strong> Atmospheric wave modeling</li>
                    <li>• <strong>Ocean currents:</strong> Tidal and thermal circulation</li>
                    <li>• <strong>Renewable energy:</strong> Wind and solar optimization</li>
                    <li>• <strong>Carbon modeling:</strong> Atmospheric CO₂ distribution</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
        estimatedTime: 4
      },
      {
        id: 'lesson-summary',
        type: 'summary' as const,
        title: 'Trigonometry Master: The World is Your Equation!',
        content: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">🎉 Incredible! You've Mastered Advanced Trigonometry Applications</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold mb-3 text-green-800">🏆 Your Journey Through the Applications:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Wave Analysis & Signal Processing
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Navigation & GPS Technology
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    3D Graphics & Animation
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Engineering & Architecture
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Physics & Natural Phenomena
                  </Badge>
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Medical & Biological Applications
                  </Badge>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Emerging Technologies
                  </Badge>
                  <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Future Applications
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🌟 You Now Understand How Trigonometry Powers:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800 text-sm">
                <div className="space-y-1">
                  <p>• Every GPS navigation system</p>
                  <p>• All 3D games and movies</p>
                  <p>• Modern medical imaging</p>
                  <p>• Structural engineering marvels</p>
                </div>
                <div className="space-y-1">
                  <p>• Wireless communication networks</p>
                  <p>• Quantum computing breakthroughs</p>
                  <p>• Climate prediction models</p>
                  <p>• Artificial intelligence systems</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">🚀 Your Mathematical Journey Continues!</h4>
                  <p className="text-yellow-800 text-sm">
                    You've mastered one of the most powerful mathematical tools humans have ever developed. Trigonometry connects pure mathematics with the real world in ways that would have amazed ancient mathematicians. You now have the foundation to pursue advanced studies in STEM fields, contribute to cutting-edge research, and solve problems that haven't even been imagined yet!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2 text-center">🎊 Congratulations, Trigonometry Master! 🎊</h4>
              <p className="text-purple-800 text-sm text-center">
                The world of mathematics is vast and beautiful, and you now have the tools to explore it with confidence. Keep questioning, keep learning, and keep discovering the mathematical patterns that govern our universe!
              </p>
            </div>
          </div>
        ),
        estimatedTime: 3
      }
    ]
  };

  const handleComplete = () => {
    trackInteraction?.('lesson_completed', {
      lessonId: 'trigonometry-applications',
      currentScreen,
      totalScreens: lessonData.screens.length
    });
    onComplete?.();
  };

  const handleNext = () => {
    trackInteraction?.('next_screen', {
      lessonId: 'trigonometry-applications',
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

export default TrigonometryApplicationsMicroLesson;