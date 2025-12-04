import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '@/components/micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '@/components/micro-lessons/ExampleScreen';
import { PracticeScreen } from '@/components/micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '@/components/micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Atom, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import atomsMoleculesImage from '@/assets/atoms-molecules-lesson.jpg';

export const atomsMoleculesMicroLessons: MicroLessonData = {
  id: 'atoms-molecules',
  moduleTitle: 'Atoms and Molecules',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Atoms and Molecules',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚛️🧪🔬</div>
              <h2 className="text-2xl font-bold mb-4">Atoms and Molecules</h2>
              <p className="text-lg text-muted-foreground">The Building Blocks of Everything</p>
            </div>

            <div className="mb-8">
              <img 
                src={atomsMoleculesImage} 
                alt="Atomic structure showing nucleus and electron orbitals with molecular examples"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understanding matter and atoms</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Atomic structure and components</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>How atoms form molecules</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Common molecules in daily life</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Everything you can touch, see, or breathe is made of atoms. You are literally made of the same elements that were forged in ancient stars!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is Matter?
    {
      id: 'what-is-matter',
      type: 'concept',
      title: 'What is Matter?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Basis of Everything" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                Everything around us is made of <strong>matter</strong>, and the most basic building block of matter is the <strong>atom</strong>. 
                An atom is made up of a central <strong>nucleus</strong> (which holds protons and neutrons) surrounded by <strong>electrons</strong>. 
                Atoms then team up to form <strong>molecules</strong>. For example, a water molecule (H₂O) is made of two hydrogen atoms and one oxygen atom.
              </p>
            </ConceptSection>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border">
                <Atom className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Atomic Structure</h3>
                <p className="text-gray-600">Nucleus surrounded by electron clouds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">What is Matter?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Anything that has mass</li>
                    <li>• Takes up space (has volume)</li>
                    <li>• Exists in different states</li>
                    <li>• Made up of atoms</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">States of Matter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Solid</strong> - fixed shape and volume</li>
                    <li>• <strong>Liquid</strong> - fixed volume, flexible shape</li>
                    <li>• <strong>Gas</strong> - flexible shape and volume</li>
                    <li>• <strong>Plasma</strong> - ionized gas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Examples of Matter Around You</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🪨</div>
                  <p className="text-sm font-medium">Rocks (Solid)</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">💧</div>
                  <p className="text-sm font-medium">Water (Liquid)</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">💨</div>
                  <p className="text-sm font-medium">Air (Gas)</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">⭐</div>
                  <p className="text-sm font-medium">Stars (Plasma)</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Atomic Structure
    {
      id: 'atomic-structure',
      type: 'concept',
      title: 'Inside an Atom',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Three Main Parts of an Atom" variant="red">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">Neutrons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• No electrical charge</li>
                      <li>• Found in the nucleus</li>
                      <li>• Similar mass to protons</li>
                      <li>• Provide nuclear stability</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ConceptSection>

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

            <div className="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Atomic Scale Perspective</h3>
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">If an atom were the size of a football stadium...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="text-2xl mb-2">🏟️</div>
                    <p className="font-semibold">Atom = Stadium</p>
                    <p className="text-xs text-gray-600">The entire structure</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="text-2xl mb-2">⚽</div>
                    <p className="font-semibold">Nucleus = Soccer Ball</p>
                    <p className="text-xs text-gray-600">At the center</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">Most of an atom is actually empty space!</p>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Electron Cloud Model
    {
      id: 'electron-cloud',
      type: 'concept',
      title: 'The Electron Cloud Model',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
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

            <ConceptSection title="Two Models of the Atom" variant="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Planetary Model</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪐</div>
                      <p className="text-sm">Simple and easy to visualize</p>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li>• Electrons orbit like planets</li>
                      <li>• Circular or elliptical paths</li>
                      <li>• Good for basic understanding</li>
                      <li>• Not scientifically accurate</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Electron Cloud Model</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">☁️</div>
                      <p className="text-sm">Modern quantum mechanical model</p>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li>• Electrons exist in probability clouds</li>
                      <li>• Different shapes (s, p, d, f orbitals)</li>
                      <li>• Scientifically accurate</li>
                      <li>• Explains chemical bonding</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Quantum Mechanics in Simple Terms</h3>
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-700">
                  The electron cloud model comes from quantum mechanics, which describes the behavior of very small particles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-xs font-semibold">Probability</p>
                    <p className="text-xs text-gray-600">Likely locations</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="text-2xl mb-2">🌊</div>
                    <p className="text-xs font-semibold">Wave-like</p>
                    <p className="text-xs text-gray-600">Not just particles</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="text-2xl mb-2">❓</div>
                    <p className="text-xs font-semibold">Uncertainty</p>
                    <p className="text-xs text-gray-600">Can't know everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: What are Molecules?
    {
      id: 'molecules',
      type: 'concept',
      title: 'From Atoms to Molecules',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="When Atoms Team Up" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                When two or more atoms join together, they form a <strong>molecule</strong>. Atoms bond together by sharing or 
                transferring electrons. This creates chemical bonds that hold the atoms together in specific arrangements.
              </p>
            </ConceptSection>

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

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Simple Molecule Formation</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">H</div>
                  <p className="text-xs mt-2">Hydrogen</p>
                </div>
                <div className="text-2xl">+</div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">H</div>
                  <p className="text-xs mt-2">Hydrogen</p>
                </div>
                <div className="text-2xl">+</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">O</div>
                  <p className="text-xs mt-2">Oxygen</p>
                </div>
                <div className="text-2xl">=</div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg border-2 border-blue-300">
                    <div className="text-lg font-bold text-blue-600">H₂O</div>
                  </div>
                  <p className="text-xs mt-2">Water Molecule</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-3">Types of Chemical Bonds</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Covalent bonds</strong> - atoms share electrons</li>
                  <li>• <strong>Ionic bonds</strong> - atoms transfer electrons</li>
                  <li>• <strong>Hydrogen bonds</strong> - weak attractions</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-3">Why Atoms Bond</h4>
                <ul className="space-y-2 text-sm">
                  <li>• To become more stable</li>
                  <li>• To fill electron shells</li>
                  <li>• To lower energy</li>
                </ul>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Common Molecules
    {
      id: 'common-molecules',
      type: 'concept',
      title: 'Molecules in Everyday Life',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Molecules You Encounter Daily" variant="blue">
              <p className="mb-6">
                Many molecules are part of your everyday experience. Understanding their composition helps you appreciate 
                the chemistry happening all around you!
              </p>
            </ConceptSection>

            <Card>
              <CardHeader>
                <CardTitle>Common Molecules in Everyday Life</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">H₂O</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Water</h4>
                      <p className="text-sm text-muted-foreground">2 Hydrogen atoms + 1 Oxygen atom</p>
                      <p className="text-xs text-gray-600">Essential for all life on Earth</p>
                    </div>
                    <div className="text-3xl">💧</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">CO₂</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Carbon Dioxide</h4>
                      <p className="text-sm text-muted-foreground">1 Carbon atom + 2 Oxygen atoms</p>
                      <p className="text-xs text-gray-600">What you breathe out, plants breathe in</p>
                    </div>
                    <div className="text-3xl">🌱</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">O₂</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Oxygen Gas</h4>
                      <p className="text-sm text-muted-foreground">2 Oxygen atoms bonded together</p>
                      <p className="text-xs text-gray-600">What you breathe in to stay alive</p>
                    </div>
                    <div className="text-3xl">🫁</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">NaCl</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Salt (Sodium Chloride)</h4>
                      <p className="text-sm text-muted-foreground">1 Sodium atom + 1 Chlorine atom</p>
                      <p className="text-xs text-gray-600">What makes your food taste better</p>
                    </div>
                    <div className="text-3xl">🧂</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Amazing Molecular Facts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🔥</div>
                  <p className="text-sm font-medium">One match flame</p>
                  <p className="text-xs text-gray-600">Contains trillions of molecules</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🍎</div>
                  <p className="text-sm font-medium">Apple smell</p>
                  <p className="text-xs text-gray-600">Ethyl butyrate molecules</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">💎</div>
                  <p className="text-sm font-medium">Diamond</p>
                  <p className="text-xs text-gray-600">Pure carbon atoms in crystal</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 7: Practice Example
    {
      id: 'practice',
      type: 'example',
      title: 'Practice: Identifying Atoms and Molecules',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Atomic Components Challenge"
          problem="A carbon atom has 6 protons. How many electrons does it have in its neutral state? And if it bonds with 4 hydrogen atoms, what molecule does it form?"
          variant="red"
          solution={
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700">Step-by-step Solution:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-700 mb-2">Part 1: Electrons in Carbon</h5>
                  <p className="text-sm mb-2">In a neutral atom, the number of electrons equals the number of protons.</p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm"><strong>Answer:</strong> 6 electrons (same as 6 protons)</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">Part 2: Carbon + 4 Hydrogens</h5>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                    <span className="text-sm">+</span>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">H</div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">H</div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">H</div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">H</div>
                    <span className="text-sm">=</span>
                    <div className="bg-white p-2 rounded border font-bold">CH₄</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm"><strong>Answer:</strong> CH₄ (Methane) - natural gas used for cooking and heating!</p>
                  </div>
                </div>
              </div>
            </div>
          }
          answer="Great job! You understand atomic structure and molecular formation!"
        />
      )
    },

    // Screen 8: Summary and Key Terms
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Atoms and Molecules',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="orange">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Atomic Structure:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Nucleus with protons and neutrons</li>
                    <li>• Electrons in probability clouds</li>
                    <li>• Mostly empty space</li>
                    <li>• Building blocks of matter</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Molecules:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Atoms bonded together</li>
                    <li>• Chemical bonds hold them</li>
                    <li>• H₂O, CO₂, O₂ examples</li>
                    <li>• Essential for life</li>
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
                  <div>
                    <h4 className="font-semibold">Chemical Bond</h4>
                    <p className="text-sm text-muted-foreground">Force that holds atoms together.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Nucleus</h4>
                    <p className="text-sm text-muted-foreground">Dense center of an atom.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">⚛️ Fantastic!</h3>
              <p>You now understand the fundamental building blocks that make up everything in the universe!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};