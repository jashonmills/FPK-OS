import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Zap, Battery, Flame, ArrowUp } from 'lucide-react';
import energyWorkImage from '@/assets/energy-work-lesson.jpg';

export const EnergyAndWorkLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Energy and Work</h1>
        <p className="text-lg text-muted-foreground">The Currency of Change</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={energyWorkImage} 
          alt="Energy transformation demonstration with roller coaster showing potential and kinetic energy"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Energy</strong> is the ability to get work done. Work is done when a force is applied to an object and it moves 
              a certain distance. The <strong>Law of Conservation of Energy</strong> tells us that energy can't be created or destroyed, 
              only changed from one form to another. For example, a roller coaster converts its <strong>potential energy</strong> 
              (energy stored from its height) into <strong>kinetic energy</strong> (energy of motion) as it whizzes down a hill.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Potential Energy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Stored energy</li>
                    <li>• Energy due to position</li>
                    <li>• Higher = more potential energy</li>
                    <li>• Example: Water behind a dam</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Kinetic Energy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Energy of motion</li>
                    <li>• Depends on mass and speed</li>
                    <li>• Faster = more kinetic energy</li>
                    <li>• Example: Moving car</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Law of Conservation of Energy</h3>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <p className="text-center text-lg font-semibold mb-2">
                Energy cannot be created or destroyed, only transformed from one form to another.
              </p>
              <p className="text-center text-muted-foreground">
                The total amount of energy in a closed system always remains the same.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">A Moment for a Think:</h4>
          <p>
            Imagine you're pushing a box across the floor. You're applying a force, and the box is moving a certain distance. 
            What is the work you are doing?
          </p>
        </AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: The Forms of Energy</h4>
          <p>
            Energy comes in many different forms. <strong>Mechanical energy</strong> is the sum of an object's potential and kinetic energy. 
            <strong>Thermal energy</strong> is related to temperature. <strong>Chemical energy</strong> is stored in the bonds of molecules. 
            <strong>Electrical energy</strong> comes from the movement of charged particles. All of these can be converted into one another, 
            but the total amount of energy in a closed system always remains the same.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Forms of Energy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <Flame className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold">Thermal Energy</h4>
                <p className="text-sm text-muted-foreground">Energy related to temperature and heat</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
              <Battery className="h-6 w-6 text-yellow-600" />
              <div>
                <h4 className="font-semibold">Chemical Energy</h4>
                <p className="text-sm text-muted-foreground">Energy stored in molecular bonds</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-semibold">Electrical Energy</h4>
                <p className="text-sm text-muted-foreground">Energy from moving charged particles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <ArrowUp className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold">Mechanical Energy</h4>
                <p className="text-sm text-muted-foreground">Sum of potential and kinetic energy</p>
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
              <h4 className="font-semibold">Energy</h4>
              <p className="text-sm text-muted-foreground">The ability to do work.</p>
            </div>
            <div>
              <h4 className="font-semibold">Potential Energy</h4>
              <p className="text-sm text-muted-foreground">Stored energy.</p>
            </div>
            <div>
              <h4 className="font-semibold">Kinetic Energy</h4>
              <p className="text-sm text-muted-foreground">Energy of motion.</p>
            </div>
            <div>
              <h4 className="font-semibold">Work</h4>
              <p className="text-sm text-muted-foreground">Force applied over a distance.</p>
            </div>
            <div>
              <h4 className="font-semibold">Conservation of Energy</h4>
              <p className="text-sm text-muted-foreground">Energy cannot be created or destroyed.</p>
            </div>
            <div>
              <h4 className="font-semibold">Mechanical Energy</h4>
              <p className="text-sm text-muted-foreground">Sum of potential and kinetic energy.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};