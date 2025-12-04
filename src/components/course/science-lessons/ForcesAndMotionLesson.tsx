import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import forcesMotionImage from '@/assets/forces-motion-lesson.jpg';

export const ForcesAndMotionLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Forces and Motion</h1>
        <p className="text-lg text-muted-foreground">The Rules of Movement</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={forcesMotionImage} 
          alt="Physics demonstration showing forces, motion, and Newton's laws"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Physics</strong> is the study of matter and energy and how they interact. A <strong>force</strong> is a push 
              or a pull on an object. We can talk about an object's motion using three key ideas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">How fast an object is moving</p>
                  <p className="text-xs text-muted-foreground mt-2">Example: 60 km/h</p>
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
                  <p className="text-sm">How fast an object is moving in a specific direction</p>
                  <p className="text-xs text-muted-foreground mt-2">Example: 60 km/h north</p>
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
                  <p className="text-sm">The rate at which an object's velocity changes</p>
                  <p className="text-xs text-muted-foreground mt-2">Example: Speeding up or slowing down</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Newton's Laws of Motion</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">First Law (Law of Inertia)</h4>
                <p className="text-blue-800">
                  An object at rest will stay at rest, and an object in motion will stay in motion, 
                  unless something else gives it a push or a pull.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Second Law (F = ma)</h4>
                <p className="text-green-800">
                  The force on an object equals its mass times its acceleration. Heavier objects need more force to move.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2">Third Law (Action-Reaction)</h4>
                <p className="text-purple-800">
                  For every action, there is an equal and opposite reaction. When you push on something, it pushes back on you.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Types of Forces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold">Gravity</h4>
                <p className="text-sm text-muted-foreground">Pulls objects toward Earth</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold">Friction</h4>
                <p className="text-sm text-muted-foreground">Opposes motion between surfaces</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold">Magnetic Force</h4>
                <p className="text-sm text-muted-foreground">Attraction or repulsion between magnets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};