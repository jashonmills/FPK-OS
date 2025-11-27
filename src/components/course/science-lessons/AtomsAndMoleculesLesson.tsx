import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Atom, Zap } from 'lucide-react';
import atomsMoleculesImage from '@/assets/atoms-molecules-lesson.jpg';

export const AtomsAndMoleculesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Atoms and Molecules</h1>
        <p className="text-lg text-muted-foreground">The Building Blocks of Everything</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={atomsMoleculesImage} 
          alt="Atomic structure showing nucleus and electron orbitals with molecular examples"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Everything around us is made of <strong>matter</strong>, and the most basic building block of matter is the <strong>atom</strong>. 
              An atom is made up of a central <strong>nucleus</strong> (which holds protons and neutrons) surrounded by <strong>electrons</strong>. 
              Atoms then team up to form <strong>molecules</strong>. For example, a water molecule (H₂O) is made of two hydrogen atoms and one oxygen atom.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border">
                <Atom className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Atomic Structure</h3>
                <p className="text-gray-600">Nucleus surrounded by electron clouds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Nucleus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Center of the atom</li>
                    <li>• Contains protons (+)</li>
                    <li>• Contains neutrons (neutral)</li>
                    <li>• Very dense</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Electrons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Negatively charged (-)</li>
                    <li>• Orbit the nucleus</li>
                    <li>• Much smaller than protons</li>
                    <li>• Determine chemical properties</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Molecules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Two or more atoms bonded</li>
                    <li>• Example: H₂O (water)</li>
                    <li>• Example: CO₂ (carbon dioxide)</li>
                    <li>• Form through chemical bonds</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Have a Visual:</h4>
          <p>
            Imagine the nucleus as the sun and the electrons as planets orbiting around it. It's not a perfect comparison, 
            but it helps to get a picture of what an atom looks like.
          </p>
        </AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: The Electron Cloud Model</h4>
          <p>
            While the planetary model of the atom is great for a basic visual, the reality is a bit more complex. 
            The <strong>electron cloud model</strong> proposes that electrons don't orbit the nucleus in neat, predictable paths. 
            Instead, they exist in a "cloud" of probability, meaning we can't know their exact location at any given moment, 
            only where they are most likely to be. This model is more accurate in modern chemistry and physics.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Common Molecules in Everyday Life</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">H₂O</div>
              <div>
                <h4 className="font-semibold">Water</h4>
                <p className="text-sm text-muted-foreground">2 Hydrogen atoms + 1 Oxygen atom</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">CO₂</div>
              <div>
                <h4 className="font-semibold">Carbon Dioxide</h4>
                <p className="text-sm text-muted-foreground">1 Carbon atom + 2 Oxygen atoms</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">O₂</div>
              <div>
                <h4 className="font-semibold">Oxygen Gas</h4>
                <p className="text-sm text-muted-foreground">2 Oxygen atoms bonded together</p>
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
              <h4 className="font-semibold">Matter</h4>
              <p className="text-sm text-muted-foreground">Anything that has mass and takes up space.</p>
            </div>
            <div>
              <h4 className="font-semibold">Atom</h4>
              <p className="text-sm text-muted-foreground">The basic unit of a chemical element.</p>
            </div>
            <div>
              <h4 className="font-semibold">Molecule</h4>
              <p className="text-sm text-muted-foreground">Two or more atoms joined together.</p>
            </div>
            <div>
              <h4 className="font-semibold">Electron Cloud Model</h4>
              <p className="text-sm text-muted-foreground">Model showing electron probability locations.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};