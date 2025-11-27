import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '@/components/micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '@/components/micro-lessons/ExampleScreen';
import { PracticeScreen } from '@/components/micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '@/components/micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Dna } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import geneticsDnaImage from '@/assets/genetics-dna-lesson.jpg';

export const geneticsDNAMicroLessons: MicroLessonData = {
  id: 'genetics-dna',
  moduleTitle: 'Genetics and DNA',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Genetics and DNA',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🧬🔬📊</div>
              <h2 className="text-2xl font-bold mb-4">Genetics and DNA</h2>
              <p className="text-lg text-muted-foreground">Your Personal Blueprint</p>
            </div>

            <div className="mb-8">
              <img 
                src={geneticsDnaImage} 
                alt="DNA double helix structure with base pairs"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understanding genetics and heredity</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>DNA structure and the double helix</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>The four DNA bases (A, T, G, C)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>How genes determine traits</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Your DNA contains about 3 billion base pairs - that's like a book with 3 billion letters that tells the story of you!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is Genetics?
    {
      id: 'what-is-genetics',
      type: 'concept',
      title: 'What is Genetics?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Study of Heredity" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                Genetics is the study of how traits are passed down from parents to their children. At the very core of genetics is 
                <strong> DNA</strong> (Deoxyribonucleic acid), the molecule that holds the genetic instructions for all living things. 
                DNA is organised into <strong>genes</strong>, which are bits of DNA that contain the code for a specific protein or function.
              </p>
            </ConceptSection>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <Dna className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">DNA Structure</h3>
                <p className="text-gray-600">The famous double helix - like a twisted ladder</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">What is DNA?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Carries genetic instructions</li>
                    <li>• Found in every living cell</li>
                    <li>• Made of four chemical bases (A, T, G, C)</li>
                    <li>• Forms the famous double helix shape</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">What are Genes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Segments of DNA</li>
                    <li>• Code for specific proteins</li>
                    <li>• Determine traits like eye color</li>
                    <li>• Passed from parents to children</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Family Traits Reflection
    {
      id: 'family-traits',
      type: 'concept',
      title: 'Traits in Your Family',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">A Moment for a Think:</h4>
                <p>
                  Think about some traits that are common in your family, like eye colour or a certain height. 
                  How do you reckon DNA is responsible for passing these traits down from one generation to the next?
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="How Traits Are Inherited" variant="green">
              <div className="space-y-4">
                <p className="mb-4">
                  Every trait you have - from your eye color to your height - is influenced by the genetic instructions in your DNA. 
                  You inherit half of your DNA from your mother and half from your father, which is why you might have your mom's eyes 
                  but your dad's nose!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">👁️</div>
                    <h4 className="font-semibold text-blue-700">Eye Color</h4>
                    <p className="text-sm text-blue-600">Controlled by multiple genes</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">📏</div>
                    <h4 className="font-semibold text-green-700">Height</h4>
                    <p className="text-sm text-green-600">Influenced by many genes + environment</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">💇</div>
                    <h4 className="font-semibold text-purple-700">Hair Type</h4>
                    <p className="text-sm text-purple-600">Straight, wavy, or curly</p>
                  </div>
                </div>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Genetic Inheritance Pattern</h3>
              <div className="flex justify-center items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">👩 Mother</div>
                  <p className="text-sm">50% of DNA</p>
                </div>
                <div className="text-4xl">+</div>
                <div className="text-center">
                  <div className="text-2xl mb-2">👨 Father</div>
                  <p className="text-sm">50% of DNA</p>
                </div>
                <div className="text-4xl">=</div>
                <div className="text-center">
                  <div className="text-2xl mb-2">👶 You</div>
                  <p className="text-sm">Unique combination!</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: The Double Helix Discovery
    {
      id: 'double-helix',
      type: 'concept',
      title: 'The Double Helix Discovery',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Deeper Dive: The Double Helix</h4>
                <p>
                  DNA has a famous shape: the <strong>double helix</strong>. It looks like a twisted ladder. The "rungs" of the ladder 
                  are made of four chemical bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). The order of these bases 
                  along the DNA strand is the code that holds all our genetic information. The discovery of this structure by James Watson 
                  and Francis Crick in 1953 was a monumental moment in science.
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="The Structure of DNA" variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">DNA Structure Components:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Sugar-phosphate backbone</strong> - like the sides of a ladder</li>
                    <li>• <strong>Base pairs</strong> - like the rungs of a ladder</li>
                    <li>• <strong>Double helix shape</strong> - twisted like a spiral staircase</li>
                    <li>• <strong>Antiparallel strands</strong> - run in opposite directions</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Why This Discovery Mattered:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Explained how DNA stores information</li>
                    <li>• Showed how DNA replicates itself</li>
                    <li>• Led to advances in medicine and biotechnology</li>
                    <li>• Foundation for understanding genetics</li>
                  </ul>
                </div>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-3">1953: A Year That Changed Science</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔬</div>
                  <h4 className="font-semibold">Watson & Crick</h4>
                  <p className="text-sm text-gray-600">Proposed the double helix model</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <h4 className="font-semibold">Rosalind Franklin</h4>
                  <p className="text-sm text-gray-600">X-ray crystallography evidence</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-semibold">Nobel Prize</h4>
                  <p className="text-sm text-gray-600">1962 award for the discovery</p>
                </div>
              </div>
            </div>

            <TeachingMoment variant="blue">
              The double helix structure explains how DNA can store so much information in such a small space - it's nature's most efficient filing system!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: The Four DNA Bases
    {
      id: 'dna-bases',
      type: 'concept',
      title: 'The Four DNA Bases',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Genetic Alphabet" variant="purple">
              <p className="text-lg leading-relaxed mb-6">
                DNA uses just four chemical bases to store all genetic information. Think of them as the letters in the genetic alphabet. 
                The order of these bases creates the instructions for making proteins and determining traits.
              </p>
            </ConceptSection>

            <Card>
              <CardHeader>
                <CardTitle>The Four DNA Bases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">A</div>
                    <h4 className="font-semibold">Adenine</h4>
                    <p className="text-xs text-gray-600 mt-1">Pairs with Thymine</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">T</div>
                    <h4 className="font-semibold">Thymine</h4>
                    <p className="text-xs text-gray-600 mt-1">Pairs with Adenine</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">G</div>
                    <h4 className="font-semibold">Guanine</h4>
                    <p className="text-xs text-gray-600 mt-1">Pairs with Cytosine</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">C</div>
                    <h4 className="font-semibold">Cytosine</h4>
                    <p className="text-xs text-gray-600 mt-1">Pairs with Guanine</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  The sequence of these bases creates the genetic code that makes you unique!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-3">Base Pairing Rules</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">A (Adenine)</span>
                    <span>↔</span>
                    <span className="font-medium">T (Thymine)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">G (Guanine)</span>
                    <span>↔</span>
                    <span className="font-medium">C (Cytosine)</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-3">Why Pairing Matters</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Ensures accurate DNA replication</li>
                  <li>• Maintains genetic information integrity</li>
                  <li>• Allows DNA repair mechanisms to work</li>
                </ul>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Genes and Proteins
    {
      id: 'genes-proteins',
      type: 'concept',
      title: 'Genes and Proteins',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="From Genes to Traits" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                Genes are specific segments of DNA that contain instructions for making proteins. Proteins are the molecular machines 
                that carry out most functions in your body. The sequence of DNA bases in a gene determines what protein gets made, 
                and different proteins lead to different traits.
              </p>
            </ConceptSection>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">The Central Dogma of Biology</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">DNA</div>
                  <p className="text-xs mt-2">Genetic Code</p>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">RNA</div>
                  <p className="text-xs mt-2">Messenger</p>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">Protein</div>
                  <p className="text-xs mt-2">Function</p>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">Trait</div>
                  <p className="text-xs mt-2">Observable</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Examples of Genes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>OCA2 gene</strong> - influences eye color</li>
                    <li>• <strong>MC1R gene</strong> - affects hair color</li>
                    <li>• <strong>CFTR gene</strong> - important for lung function</li>
                    <li>• <strong>BRCA genes</strong> - DNA repair functions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">What Proteins Do</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Enzymes</strong> - speed up chemical reactions</li>
                    <li>• <strong>Structural</strong> - build tissues like muscle</li>
                    <li>• <strong>Transport</strong> - move substances around</li>
                    <li>• <strong>Defense</strong> - antibodies fight infections</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <TeachingMoment variant="green">
              One amazing fact: humans have about 20,000-25,000 genes, but we can make over 100,000 different proteins through various modifications!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 7: Practice Example
    {
      id: 'practice',
      type: 'example',
      title: 'Practice: DNA Base Pairing',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Complete the DNA Strand"
          problem="Given one strand of DNA with the sequence: A-T-G-C-G-A-T, what would be the complementary strand?"
          variant="blue"
          solution={
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-3">Step-by-step Solution:</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    <div className="text-sm font-semibold">Original:</div>
                    <div className="bg-red-100 p-2 rounded">A</div>
                    <div className="bg-blue-100 p-2 rounded">T</div>
                    <div className="bg-green-100 p-2 rounded">G</div>
                    <div className="bg-yellow-100 p-2 rounded">C</div>
                    <div className="bg-green-100 p-2 rounded">G</div>
                    <div className="bg-red-100 p-2 rounded">A</div>
                    <div className="bg-blue-100 p-2 rounded">T</div>
                  </div>
                  <div className="text-center text-2xl">↓</div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    <div className="text-sm font-semibold">Complement:</div>
                    <div className="bg-blue-100 p-2 rounded">T</div>
                    <div className="bg-red-100 p-2 rounded">A</div>
                    <div className="bg-yellow-100 p-2 rounded">C</div>
                    <div className="bg-green-100 p-2 rounded">G</div>
                    <div className="bg-yellow-100 p-2 rounded">C</div>
                    <div className="bg-blue-100 p-2 rounded">T</div>
                    <div className="bg-red-100 p-2 rounded">A</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Answer: T-A-C-G-C-T-A</p>
              </div>
            </div>
          }
          answer="Remember: A pairs with T, and G pairs with C!"
        />
      )
    },

    // Screen 8: Summary and Key Terms
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Understanding Genetics and DNA',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">DNA Structure:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Double helix shape</li>
                    <li>• Four bases: A, T, G, C</li>
                    <li>• Base pairing rules</li>
                    <li>• Genetic code sequence</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Genetics Concepts:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Heredity and inheritance</li>
                    <li>• Genes make proteins</li>
                    <li>• Proteins determine traits</li>
                    <li>• Family resemblances</li>
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
                    <h4 className="font-semibold">DNA</h4>
                    <p className="text-sm text-muted-foreground">The molecule containing genetic instructions.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Gene</h4>
                    <p className="text-sm text-muted-foreground">A segment of DNA.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Double Helix</h4>
                    <p className="text-sm text-muted-foreground">The twisted ladder shape of DNA.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Genetics</h4>
                    <p className="text-sm text-muted-foreground">Study of heredity and traits.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Base Pairs</h4>
                    <p className="text-sm text-muted-foreground">A-T and G-C combinations in DNA.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Protein</h4>
                    <p className="text-sm text-muted-foreground">Molecules that carry out cell functions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🧬 Excellent!</h3>
              <p>You now understand the molecular basis of heredity and how DNA makes you unique!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};