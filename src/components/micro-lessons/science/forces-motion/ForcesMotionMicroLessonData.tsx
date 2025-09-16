import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../../../micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '../../../micro-lessons/ExampleScreen';
import { PracticeScreen } from '../../../micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../../../micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import forcesMotionImage from '@/assets/forces-motion-lesson.jpg';

export const forcesMotionMicroLessons: MicroLessonData = {
  id: 'forces-motion',
  moduleTitle: 'Forces and Motion',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Forces and Motion',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🏃‍♂️⚡🚀</div>
              <h2 className="text-2xl font-bold mb-4">Forces and Motion</h2>
              <p className="text-lg text-muted-foreground">The Rules of Movement</p>
            </div>

            <div className="mb-8">
              <img 
                src={forcesMotionImage} 
                alt="Physics demonstration showing forces, motion, and Newton's laws"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understanding physics and forces</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Speed, velocity, and acceleration</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Newton's three laws of motion</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Types of forces in everyday life</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Every movement around you - from a falling apple to a rocket launch - follows the same fundamental physics principles discovered by Newton over 300 years ago!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is Physics and Force?
    {
      id: 'physics-force',
      type: 'concept',
      title: 'What is Physics and Force?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Science of Motion" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                <strong>Physics</strong> is the study of matter and energy and how they interact. A <strong>force</strong> is a push 
                or a pull on an object. Forces are everywhere around us - from the wind pushing on your face to gravity pulling you toward Earth!
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">What is Physics?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Study of matter and energy</li>
                    <li>• How things move and interact</li>
                    <li>• Explains natural phenomena</li>
                    <li>• Uses math to describe patterns</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">What is Force?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• A push or pull on an object</li>
                    <li>• Can change motion</li>
                    <li>• Has both strength and direction</li>
                    <li>• Measured in Newtons (N)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Forces All Around Us</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🏃‍♂️</div>
                  <p className="text-sm font-medium">Push</p>
                  <p className="text-xs text-gray-600">Running forward</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🪢</div>
                  <p className="text-sm font-medium">Pull</p>
                  <p className="text-xs text-gray-600">Tug of war</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🍎</div>
                  <p className="text-sm font-medium">Gravity</p>
                  <p className="text-xs text-gray-600">Apple falling</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧲</div>
                  <p className="text-sm font-medium">Magnetic</p>
                  <p className="text-xs text-gray-600">Magnets attract</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">Key Insight:</h4>
              <p className="text-yellow-700 text-sm">
                Forces are invisible, but we can see their effects! You can't see the force of gravity, 
                but you can see objects falling. Forces cause changes in motion.
              </p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Speed, Velocity, and Acceleration
    {
      id: 'motion-concepts',
      type: 'concept',
      title: 'Speed, Velocity, and Acceleration',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Describing Motion" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                To understand how forces affect motion, we need three key concepts that help us describe exactly how objects move. 
                These might seem similar, but each tells us something different about motion!
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">How fast an object is moving</p>
                    <p className="text-xs text-muted-foreground">Example: 60 km/h</p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <strong>Formula:</strong> Distance ÷ Time
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">How fast an object is moving in a specific direction</p>
                    <p className="text-xs text-muted-foreground">Example: 60 km/h north</p>
                    <div className="bg-green-50 p-2 rounded text-xs">
                      <strong>Key:</strong> Includes direction
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Acceleration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">The rate at which an object's velocity changes</p>
                    <p className="text-xs text-muted-foreground">Example: Speeding up or slowing down</p>
                    <div className="bg-purple-50 p-2 rounded text-xs">
                      <strong>Types:</strong> Speed up, slow down, change direction
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Real-World Examples</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🚗</div>
                    <div>
                      <p className="font-semibold text-sm">Car on highway</p>
                      <p className="text-xs text-gray-600">Speed: 100 km/h</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Just speed (no direction specified)</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🧭</div>
                    <div>
                      <p className="font-semibold text-sm">Car with GPS</p>
                      <p className="text-xs text-gray-600">Velocity: 100 km/h east</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Speed + direction = velocity</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏁</div>
                    <div>
                      <p className="font-semibold text-sm">Racing car</p>
                      <p className="text-xs text-gray-600">Acceleration: 0 to 100 km/h in 3 seconds</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Change in velocity over time</p>
                  </div>
                </div>
              </div>
            </div>

            <TeachingMoment variant="green">
              Here's a memory trick: Speed is just "how fast," velocity is "how fast and which way," and acceleration is "getting faster, slower, or changing direction!"
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Newton's First Law
    {
      id: 'first-law',
      type: 'concept',
      title: "Newton's First Law: Inertia",
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Law of Inertia" variant="blue">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">First Law (Law of Inertia)</h4>
                <p className="text-blue-800">
                  An object at rest will stay at rest, and an object in motion will stay in motion, 
                  unless something else gives it a push or a pull.
                </p>
              </div>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Objects at Rest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-sm font-medium">Book on Table</p>
                    </div>
                    <p className="text-sm">A book on your desk will stay there forever unless someone or something moves it.</p>
                    <div className="bg-red-50 p-2 rounded text-xs">
                      <strong>Inertia:</strong> Resistance to starting motion
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Objects in Motion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏒</div>
                      <p className="text-sm font-medium">Hockey Puck</p>
                    </div>
                    <p className="text-sm">A hockey puck sliding on ice will keep sliding in the same direction until friction stops it.</p>
                    <div className="bg-green-50 p-2 rounded text-xs">
                      <strong>Inertia:</strong> Resistance to changing motion
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Everyday Examples of Inertia</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl">🚗</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Car Braking</p>
                    <p className="text-xs text-gray-600">Your body keeps moving forward when the car stops suddenly</p>
                  </div>
                  <div className="text-xs text-orange-600">Inertia!</div>
                </div>
                
                <div className="flex items-center space-x-4 bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl">🪑</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Tablecloth Trick</p>
                    <p className="text-xs text-gray-600">Pull the cloth fast enough, and dishes stay put</p>
                  </div>
                  <div className="text-xs text-orange-600">Inertia!</div>
                </div>
                
                <div className="flex items-center space-x-4 bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl">🚌</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Bus Starting</p>
                    <p className="text-xs text-gray-600">You lean backward when the bus starts moving forward</p>
                  </div>
                  <div className="text-xs text-orange-600">Inertia!</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">Key Insight:</h4>
              <p className="text-blue-700 text-sm">
                Inertia depends on mass! Heavier objects have more inertia - they're harder to start moving and harder to stop once they're moving.
              </p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Newton's Second and Third Laws
    {
      id: 'second-third-laws',
      type: 'concept',
      title: "Newton's Second and Third Laws",
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Force, Mass, and Action-Reaction" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                Newton's second and third laws explain how forces create motion and how forces always come in pairs. 
                These laws help us understand everything from walking to rocket launches!
              </p>
            </ConceptSection>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Second Law (F = ma)</h4>
                <p className="text-green-800 mb-3">
                  The force on an object equals its mass times its acceleration. Heavier objects need more force to move.
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-center font-mono"><strong>Force = Mass × Acceleration</strong></p>
                  <p className="text-xs text-center text-gray-600 mt-1">F = m × a</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2">Third Law (Action-Reaction)</h4>
                <p className="text-purple-800">
                  For every action, there is an equal and opposite reaction. When you push on something, it pushes back on you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Second Law Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🏀</div>
                        <div>
                          <p className="text-sm font-semibold">Basketball vs Bowling Ball</p>
                          <p className="text-xs text-gray-600">Same force moves basketball faster (less mass)</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🚗</div>
                        <div>
                          <p className="text-sm font-semibold">Car Engine</p>
                          <p className="text-xs text-gray-600">More force = faster acceleration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700">Third Law Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🚀</div>
                        <div>
                          <p className="text-sm font-semibold">Rocket Launch</p>
                          <p className="text-xs text-gray-600">Pushes gas down, gas pushes rocket up</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🚶</div>
                        <div>
                          <p className="text-sm font-semibold">Walking</p>
                          <p className="text-xs text-gray-600">Push ground back, ground pushes you forward</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Understanding F = ma</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl mb-2">💪</div>
                  <p className="font-semibold text-sm">More Force</p>
                  <p className="text-xs text-gray-600">Higher acceleration</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl mb-2">⚖️</div>
                  <p className="font-semibold text-sm">More Mass</p>
                  <p className="text-xs text-gray-600">Lower acceleration</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-2xl mb-2">🏃‍♂️</div>
                  <p className="font-semibold text-sm">Same Result</p>
                  <p className="text-xs text-gray-600">F = m × a always</p>
                </div>
              </div>
            </div>

            <TeachingMoment variant="purple">
              Newton's laws work together! You can't push on something (3rd law) without creating a force (2nd law) that might change its motion (1st law)!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Gravity Deep Dive
    {
      id: 'gravity-deepdive',
      type: 'concept',
      title: 'Gravity: The Universal Force',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Deeper Dive: Gravity—A Force of Attraction</h4>
                <p>
                  One of the most common forces we experience every day is <strong>gravity</strong>. It's a force of attraction that exists 
                  between any two objects with mass. Sir Isaac Newton's law of universal gravitation states that the force of gravity is 
                  directly proportional to the product of their masses and inversely proportional to the square of the distance between them. 
                  This explains why we're pulled towards the Earth, and why the moon orbits our planet.
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="Understanding Gravity" variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">What is Gravity?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Force of attraction between masses</li>
                      <li>• Always pulls objects together</li>
                      <li>• Works over vast distances</li>
                      <li>• Gets weaker with distance</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Gravity Facts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Stronger with more massive objects</li>
                      <li>• Earth's gravity pulls at 9.8 m/s²</li>
                      <li>• Moon has 1/6th Earth's gravity</li>
                      <li>• Keeps planets in orbit</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Gravity in Action</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🍎</div>
                    <div>
                      <p className="font-semibold text-sm">Apple Falls</p>
                      <p className="text-xs text-gray-600">Earth pulls apple toward its center</p>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">9.8 m/s² acceleration</div>
                </div>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🌙</div>
                    <div>
                      <p className="font-semibold text-sm">Moon Orbits Earth</p>
                      <p className="text-xs text-gray-600">Gravity keeps moon in circular path</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600">Balance of forces</div>
                </div>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <p className="font-semibold text-sm">Earth Orbits Sun</p>
                      <p className="text-xs text-gray-600">Sun's massive gravity controls Earth's orbit</p>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">Solar system order</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">Amazing Gravity Facts:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
                <p>• You and your friend pull on each other with gravity!</p>
                <p>• Black holes have gravity so strong light can't escape</p>
                <p>• Gravity made the first stars and galaxies form</p>
                <p>• Without gravity, there would be no planets or life</p>
              </div>
            </div>

            <TeachingMoment variant="blue">
              Gravity is why you don't float away right now! It's also what makes the tides, keeps our atmosphere, and lets us have liquid water on Earth's surface.
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 7: Types of Forces
    {
      id: 'types-forces',
      type: 'concept',
      title: 'Types of Forces',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Forces All Around Us" variant="red">
              <p className="text-lg leading-relaxed mb-6">
                While gravity is the most obvious force, there are many other types of forces acting on objects every day. 
                Each type of force has its own characteristics and effects on motion.
              </p>
            </ConceptSection>

            <Card>
              <CardHeader>
                <CardTitle>Types of Forces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Gravity</h4>
                      <p className="text-sm text-muted-foreground">Pulls objects toward Earth</p>
                      <p className="text-xs text-gray-600">Always points toward center of Earth</p>
                    </div>
                    <div className="text-3xl">🍎</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Friction</h4>
                      <p className="text-sm text-muted-foreground">Opposes motion between surfaces</p>
                      <p className="text-xs text-gray-600">Makes things slow down and stop</p>
                    </div>
                    <div className="text-3xl">🛹</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Magnetic Force</h4>
                      <p className="text-sm text-muted-foreground">Attraction or repulsion between magnets</p>
                      <p className="text-xs text-gray-600">Can attract or repel without touching</p>
                    </div>
                    <div className="text-3xl">🧲</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Normal Force</h4>
                      <p className="text-sm text-muted-foreground">Support force from surfaces</p>
                      <p className="text-xs text-gray-600">Pushes up when you sit or stand</p>
                    </div>
                    <div className="text-3xl">🪑</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Applied Force</h4>
                      <p className="text-sm text-muted-foreground">Force applied by a person or object</p>
                      <p className="text-xs text-gray-600">Pushing, pulling, lifting, throwing</p>
                    </div>
                    <div className="text-3xl">💪</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-3">Contact Forces</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Friction (touching surfaces)</li>
                  <li>• Normal force (support)</li>
                  <li>• Applied force (pushing/pulling)</li>
                  <li>• <strong>Need physical contact</strong></li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-3">Non-Contact Forces</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Gravity (mass attraction)</li>
                  <li>• Magnetic force (magnetic fields)</li>
                  <li>• Electric force (electric charges)</li>
                  <li>• <strong>Work at a distance</strong></li>
                </ul>
              </div>
            </div>

            <TeachingMoment variant="red">
              Right now, you're experiencing multiple forces: gravity pulling you down, normal force from your chair pushing up, and maybe friction keeping you from sliding!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 8: Summary and Key Terms
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Forces and Motion',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Motion Concepts:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Speed (how fast)</li>
                    <li>• Velocity (speed + direction)</li>
                    <li>• Acceleration (change in velocity)</li>
                    <li>• Forces cause changes in motion</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Newton's Laws:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 1st: Inertia (objects resist change)</li>
                    <li>• 2nd: F = ma (force creates acceleration)</li>
                    <li>• 3rd: Action-reaction pairs</li>
                    <li>• Universal principles of motion</li>
                  </ul>
                </div>
              </div>
            </ConceptSection>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Physics</h4>
                    <p className="text-sm text-muted-foreground">The study of matter and energy.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Force</h4>
                    <p className="text-sm text-muted-foreground">A push or pull on an object.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Speed</h4>
                    <p className="text-sm text-muted-foreground">How fast an object is moving.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Velocity</h4>
                    <p className="text-sm text-muted-foreground">Speed in a given direction.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Acceleration</h4>
                    <p className="text-sm text-muted-foreground">The rate of change of velocity.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Gravity</h4>
                    <p className="text-sm text-muted-foreground">Force of attraction between masses.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Inertia</h4>
                    <p className="text-sm text-muted-foreground">Resistance to changes in motion.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Friction</h4>
                    <p className="text-sm text-muted-foreground">Force opposing motion between surfaces.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🚀 Superb!</h3>
              <p>You now understand the fundamental laws that govern all motion in the universe!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};