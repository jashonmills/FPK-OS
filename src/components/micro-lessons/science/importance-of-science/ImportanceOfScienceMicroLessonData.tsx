import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../../../micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '../../../micro-lessons/ExampleScreen';
import { PracticeScreen } from '../../../micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../../../micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Heart, Smartphone, Globe, PenTool, BookOpen, Atom, Microscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import importanceOfScienceImage from '@/assets/importance-of-science-lesson.jpg';

export const importanceOfScienceMicroLessons: MicroLessonData = {
  id: 'importance-of-science',
  moduleTitle: 'The Importance of Science',
  totalScreens: 6,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'The Importance of Science',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🌍🔬💡</div>
              <h2 className="text-2xl font-bold mb-4">The Importance of Science</h2>
              <p className="text-lg text-muted-foreground">Science in Our Daily Lives</p>
            </div>

            <div className="mb-8">
              <img 
                src={importanceOfScienceImage} 
                alt="Collage showing various applications of science in daily life"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Discover</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Science's role in technology</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Medical breakthroughs</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Environmental protection</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Real-world applications</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Science isn't just textbook knowledge - it's the foundation of modern society and touches every aspect of our daily lives!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: Science as Foundation
    {
      id: 'foundation',
      type: 'concept',
      title: 'Science: The Bedrock of Modern Society',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Science as Problem-Solving Tool" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                Science is the <strong>bedrock of modern society</strong> and a powerful tool for <strong>problem-solving</strong>. 
                It gives us the methods and knowledge to understand our world, make informed decisions, and create solutions 
                to complex challenges.
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Technology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">From smartphones to satellites, science drives technological innovation</p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Medicine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Medical advances save lives and improve quality of life worldwide</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Understanding ecosystems helps us protect our planet</p>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Think About This:</h4>
                <p>
                  Consider some of the scientific principles behind everyday objects like smartphones or cars. 
                  How many different areas of science do you think contribute to making these items work?
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Internet and Communication
    {
      id: 'internet-communication',
      type: 'concept',
      title: 'Science Behind Communication',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">The Internet: A Scientific Marvel</h4>
                <p>
                  The internet itself is a product of scientific research and relies on principles from various scientific fields 
                  such as computer science, physics, and telecommunications to function.
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="Scientific Fields Behind the Internet" variant="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-blue-700">Computer Science</h4>
                      <p className="text-sm text-gray-600">Algorithms, programming, and data structures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-purple-700">Physics</h4>
                      <p className="text-sm text-gray-600">Electromagnetic waves and fiber optics</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-green-700">Engineering</h4>
                      <p className="text-sm text-gray-600">Network infrastructure and hardware design</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-orange-700">Mathematics</h4>
                      <p className="text-sm text-gray-600">Encryption and data compression</p>
                    </div>
                  </div>
                </div>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Everyday Communication Technologies</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">Smartphones</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">Internet</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Atom className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">Satellites</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Microscope className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">GPS</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Science Impact Areas
    {
      id: 'impact-areas',
      type: 'concept',
      title: 'Science Impact Areas',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Areas Where Science Makes a Significant Impact" variant="green">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Healthcare & Medicine
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">From antibiotics to advanced surgical techniques, science has revolutionized medicine.</p>
                      <ul className="text-xs space-y-1">
                        <li>• Vaccines prevent deadly diseases</li>
                        <li>• MRI and CT scans for diagnosis</li>
                        <li>• Gene therapy treatments</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Communication & Technology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Science enables instant global communication and information sharing.</p>
                      <ul className="text-xs space-y-1">
                        <li>• Internet and social media</li>
                        <li>• Mobile phone networks</li>
                        <li>• Video conferencing</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-700">Transportation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Scientific principles power modern transportation systems.</p>
                      <ul className="text-xs space-y-1">
                        <li>• Electric and hybrid vehicles</li>
                        <li>• Air travel and aviation</li>
                        <li>• GPS navigation systems</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700">Food & Agriculture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Science helps feed the world's growing population.</p>
                      <ul className="text-xs space-y-1">
                        <li>• Crop breeding and GMOs</li>
                        <li>• Pest control methods</li>
                        <li>• Food preservation techniques</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ConceptSection>

            <TeachingMoment variant="green">
              Each of these areas shows how scientific research and discovery directly improves human life and addresses real-world challenges!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Practice and Reflection
    {
      id: 'practice-reflection',
      type: 'example',
      title: 'Practice: Science in Your Life',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Science Around You"
          problem="Look around your immediate environment right now. Identify at least 5 objects or systems that exist because of scientific discoveries and research."
          variant="blue"
          solution={
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700">Example Discoveries:</h4>
              <StepList
                variant="blue"
                steps={[
                  "Electric lights - Physics (electricity) and chemistry (materials)",
                  "Smartphone - Multiple sciences: electronics, materials science, computer science",
                  "Clean water - Chemistry (water treatment) and biology (understanding pathogens)",
                  "Medicines - Chemistry, biology, and pharmacology",
                  "Weather forecasting - Meteorology, physics, and computer modeling"
                ]}
              />
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Reflection:</strong> Notice how many different scientific fields contribute to the objects and systems we use every day!
                </p>
              </div>
            </div>
          }
          answer="Science is everywhere - from the materials in your walls to the technology in your pocket!"
        />
      )
    },

    // Screen 6: Summary and Future Impact
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Science Shaping Our World',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Science Impact Areas:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Healthcare and medicine</li>
                    <li>• Communication technology</li>
                    <li>• Transportation systems</li>
                    <li>• Food and agriculture</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Why Science Matters:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Solves real-world problems</li>
                    <li>• Improves quality of life</li>
                    <li>• Drives innovation</li>
                    <li>• Informs decision-making</li>
                  </ul>
                </div>
              </div>
            </ConceptSection>

            <Alert className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Looking Forward:</h4>
                <p>
                  Future scientific breakthroughs will continue to transform our world. Areas like renewable energy, 
                  artificial intelligence, space exploration, and personalized medicine hold incredible promise 
                  for addressing tomorrow's challenges.
                </p>
              </AlertDescription>
            </Alert>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🌟 Well Done!</h3>
              <p>You now understand how science shapes our modern world and impacts every aspect of daily life!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};