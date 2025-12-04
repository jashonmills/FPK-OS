import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '@/components/micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '@/components/micro-lessons/ExampleScreen';
import { PracticeScreen } from '@/components/micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '@/components/micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Zap, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import cellStructureImage from '@/assets/cell-structure-lesson.jpg';

export const cellStructureMicroLessons: MicroLessonData = {
  id: 'cell-structure',
  moduleTitle: 'Cell Structure and Function',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Cell Structure and Function',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔬🧫🧪</div>
              <h2 className="text-2xl font-bold mb-4">Cell Structure and Function</h2>
              <p className="text-lg text-muted-foreground">The Building Blocks of Life</p>
            </div>

            <div className="mb-8">
              <img 
                src={cellStructureImage} 
                alt="Detailed cross-section of a eukaryotic cell showing organelles"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understanding cell types</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Key organelles and functions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Prokaryotic vs Eukaryotic</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Cell specialization</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Every living thing, from the tiniest bacteria to the largest whale, is made up of cells. You are literally made of trillions of these microscopic building blocks!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is a Cell?
    {
      id: 'what-is-cell',
      type: 'concept',
      title: 'What is a Cell?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Basic Unit of Life" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                A <strong>cell</strong> is the most basic unit of life. All living organisms are made up of one or more cells. 
                Cells carry out all the functions necessary for life, including growth, reproduction, and responding to their environment.
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Organized internal components working together</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Function</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Carries out all life processes</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Reproduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Can create copies of itself</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Cell Size Perspective</h3>
              <p className="text-center text-sm text-gray-600 mb-4">Most cells are incredibly small - you'd need a microscope to see them!</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🦠</div>
                  <p className="text-xs font-medium">Bacteria</p>
                  <p className="text-xs text-gray-500">1-5 μm</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🧫</div>
                  <p className="text-xs font-medium">Human Cell</p>
                  <p className="text-xs text-gray-500">10-30 μm</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🥚</div>
                  <p className="text-xs font-medium">Chicken Egg</p>
                  <p className="text-xs text-gray-500">3 cm (visible!)</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Two Main Types of Cells
    {
      id: 'cell-types',
      type: 'concept',
      title: 'Two Main Types of Cells',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Prokaryotic vs Eukaryotic Cells" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                There are two main types: <strong>prokaryotic</strong> and <strong>eukaryotic</strong>. 
                <strong>Prokaryotic cells</strong> are simple and don't have a nucleus (like bacteria), while <strong>eukaryotic cells</strong> 
                are more complex and have a nucleus along with other specialised parts called organelles (like animal and plant cells).
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Prokaryotic Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🦠</div>
                      <p className="text-sm font-medium">Example: Bacteria</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Simple structure</li>
                      <li>• No nucleus</li>
                      <li>• No membrane-bound organelles</li>
                      <li>• DNA floats freely in cytoplasm</li>
                      <li>• Usually single-celled organisms</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Eukaryotic Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧫</div>
                      <p className="text-sm font-medium">Example: Animal & Plant Cells</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Complex structure</li>
                      <li>• Has a nucleus</li>
                      <li>• Multiple organelles</li>
                      <li>• DNA contained in nucleus</li>
                      <li>• Can be single or multicellular</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">Memory Tip:</h4>
              <p className="text-yellow-700 text-sm">
                <strong>PRO</strong>karyotic = <strong>PRO</strong>fessionally simple (no nucleus)<br/>
                <strong>EU</strong>karyotic = <strong>EU</strong>phemistically complex (has nucleus)
              </p>
            </div>

            <TeachingMoment variant="blue">
              The evolution from prokaryotic to eukaryotic cells was one of the most important events in the history of life on Earth!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Key Organelles - The Nucleus
    {
      id: 'nucleus',
      type: 'concept',
      title: 'The Nucleus: Cell Control Center',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <Database className="h-8 w-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 text-xl">Nucleus</h3>
                <p className="text-blue-800 mt-2">
                  The control centre, holding the cell's genetic material (DNA).
                </p>
              </div>
            </div>

            <ConceptSection title="What Makes the Nucleus Special?" variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Key Functions:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Stores DNA (genetic instructions)</li>
                    <li>• Controls cell activities</li>
                    <li>• Regulates gene expression</li>
                    <li>• Makes ribosomes</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Structure:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Double membrane (nuclear envelope)</li>
                    <li>• Nuclear pores for transport</li>
                    <li>• Nucleolus inside</li>
                    <li>• Chromatin (DNA + proteins)</li>
                  </ul>
                </div>
              </div>
            </ConceptSection>

            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Think of it like this:</h4>
                <p>
                  The nucleus is like the "city hall" of the cell - it's where all the important decisions are made and 
                  where the "blueprints" (DNA) for the entire cell are kept safe.
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-lg font-semibold mb-2">Nucleus = Cell's Government</h3>
              <p className="text-sm text-gray-600">Controls and coordinates all cell activities</p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: More Key Organelles
    {
      id: 'other-organelles',
      type: 'concept',
      title: 'Other Essential Organelles',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Cell's Workforce" variant="green">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900">Mitochondria</h4>
                    <p className="text-green-800">
                      The cell's powerhouses, generating energy (ATP) from glucose and oxygen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-900">Cell Membrane</h4>
                    <p className="text-purple-800">
                      The protective outer layer that controls what gets in and out of the cell.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                  <div className="h-6 w-6 bg-orange-600 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-orange-900">Cytoplasm</h4>
                    <p className="text-orange-800">
                      The jelly-like goo that fills the cell and holds the organelles in place.
                    </p>
                  </div>
                </div>
              </div>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200 text-center">
                <CardContent className="pt-6">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-700">⚡</div>
                  <h4 className="font-semibold text-green-700">Energy Production</h4>
                  <p className="text-xs text-gray-600 mt-2">Mitochondria = Cell's power plants</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 text-center">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-700">🛡️</div>
                  <h4 className="font-semibold text-purple-700">Protection</h4>
                  <p className="text-xs text-gray-600 mt-2">Membrane = Cell's security system</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 text-center">
                <CardContent className="pt-6">
                  <div className="h-8 w-8 bg-orange-600 rounded-full mx-auto mb-3"></div>
                  <div className="text-2xl font-bold text-orange-700">🌊</div>
                  <h4 className="font-semibold text-orange-700">Support</h4>
                  <p className="text-xs text-gray-600 mt-2">Cytoplasm = Cell's foundation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Mitochondria Deep Dive
    {
      id: 'mitochondria-deepdive',
      type: 'concept',
      title: 'The Power of Mitochondria',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Deeper Dive: The Power of the Mitochondria</h4>
                <p>
                  Mitochondria are fascinating. They have their own small set of DNA, separate from the DNA in the cell's nucleus. 
                  This has led scientists to believe that mitochondria were once separate, free-living bacteria that were absorbed by larger 
                  cells billions of years ago in a process called <strong>endosymbiosis</strong>. This symbiotic relationship allowed both 
                  the host cell and the mitochondria to survive and thrive, a major event in the evolution of complex life.
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="Endosymbiosis Theory" variant="green">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl mb-2">🦠</div>
                  <h4 className="font-semibold text-red-700">Step 1</h4>
                  <p className="text-sm text-red-600">Free-living bacteria</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="font-semibold text-yellow-700">Step 2</h4>
                  <p className="text-sm text-yellow-600">Engulfed by larger cell</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🧫</div>
                  <h4 className="font-semibold text-green-700">Step 3</h4>
                  <p className="text-sm text-green-600">Became mitochondria</p>
                </div>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Evidence for Endosymbiosis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• Own circular DNA (like bacteria)</li>
                  <li>• Double membrane structure</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• Reproduce independently</li>
                  <li>• Similar size to bacteria</li>
                </ul>
              </div>
            </div>

            <TeachingMoment variant="green">
              This ancient partnership between cells is why you can breathe oxygen and have energy to think and move right now!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 7: Practice and Application
    {
      id: 'practice',
      type: 'example',
      title: 'Practice: Cell Component Functions',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Match the Organelle to Its Function"
          problem="Based on what you've learned, match each cell component with its primary function:"
          variant="blue"
          solution={
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700">Correct Matches:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-700">Nucleus</span>
                  </div>
                  <p className="text-xs text-blue-600">→ Controls cell activities and stores DNA</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">Mitochondria</span>
                  </div>
                  <p className="text-xs text-green-600">→ Produces energy (ATP) for the cell</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-700">Cell Membrane</span>
                  </div>
                  <p className="text-xs text-purple-600">→ Controls what enters and exits the cell</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
                    <span className="font-semibold text-orange-700">Cytoplasm</span>
                  </div>
                  <p className="text-xs text-orange-600">→ Holds organelles in place</p>
                </div>
              </div>
            </div>
          }
          answer="Great job! Each organelle has a specific role that keeps the cell functioning properly."
        />
      )
    },

    // Screen 8: Summary and Key Terms
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Understanding Cells',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Cell Types:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Prokaryotic (no nucleus)</li>
                    <li>• Eukaryotic (has nucleus)</li>
                    <li>• Both are living units</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Organelles:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Nucleus (control center)</li>
                    <li>• Mitochondria (powerhouse)</li>
                    <li>• Cell membrane (gatekeeper)</li>
                    <li>• Cytoplasm (support)</li>
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
                    <h4 className="font-semibold">Cell</h4>
                    <p className="text-sm text-muted-foreground">The basic unit of life.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Eukaryotic Cell</h4>
                    <p className="text-sm text-muted-foreground">A cell with a nucleus.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Prokaryotic Cell</h4>
                    <p className="text-sm text-muted-foreground">A cell without a nucleus.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Organelles</h4>
                    <p className="text-sm text-muted-foreground">The specialized parts within a cell.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Endosymbiosis</h4>
                    <p className="text-sm text-muted-foreground">Process where one organism lives inside another.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🔬 Amazing!</h3>
              <p>You now understand the fundamental structures that make all life possible!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};