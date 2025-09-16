import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../../../micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '../../../micro-lessons/ExampleScreen';
import { PracticeScreen } from '../../../micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../../../micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, Grid, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import periodicTableImage from '@/assets/periodic-table-lesson.jpg';

export const periodicTableMicroLessons: MicroLessonData = {
  id: 'periodic-table',
  moduleTitle: 'The Periodic Table',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'The Periodic Table',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🧪⚗️📊</div>
              <h2 className="text-2xl font-bold mb-4">The Periodic Table</h2>
              <p className="text-lg text-muted-foreground">The Chemist's Map</p>
            </div>

            <div className="mb-8">
              <img 
                src={periodicTableImage} 
                alt="Colorful periodic table of elements showing all 118 elements"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understanding the periodic table organization</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Periods vs Groups and their meaning</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Chemical trends and patterns</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Common element groups and properties</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              The periodic table is like a giant cheat sheet for chemistry - it tells you almost everything you need to know about how elements will behave!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is the Periodic Table?
    {
      id: 'what-is-periodic-table',
      type: 'concept',
      title: 'What is the Periodic Table?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Ultimate Chemistry Reference" variant="purple">
              <p className="text-lg leading-relaxed mb-6">
                The <strong>periodic table</strong> is a chart that organises all the known chemical elements. It's a brilliant tool 
                that helps us understand how elements are related to one another. The table is laid out in rows (<strong>periods</strong>) 
                and columns (<strong>groups</strong>), and each element's spot tells us a lot about its atomic number, atomic mass, 
                and chemical properties.
              </p>
            </ConceptSection>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <Grid className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Periodic Table</h3>
                <p className="text-gray-600">118 known elements organized by properties</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Systematic arrangement</li>
                    <li>• By atomic number</li>
                    <li>• Shows relationships</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Element symbol</li>
                    <li>• Atomic number</li>
                    <li>• Atomic mass</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700">Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Chemical behavior</li>
                    <li>• Physical properties</li>
                    <li>• Reactivity patterns</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-center">Fun Facts About the Periodic Table</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🔢</div>
                  <p className="text-sm font-medium">118 Elements</p>
                  <p className="text-xs text-gray-600">Currently known</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm font-medium">1869</p>
                  <p className="text-xs text-gray-600">Mendeleev's first table</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm font-medium">Predictions</p>
                  <p className="text-xs text-gray-600">Predicted undiscovered elements</p>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Periods vs Groups
    {
      id: 'periods-groups',
      type: 'concept',
      title: 'Periods vs Groups',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Table's Structure" variant="blue">
              <p className="text-lg leading-relaxed mb-6">
                The periodic table is organized into horizontal rows called <strong>periods</strong> and vertical columns called <strong>groups</strong>. 
                This organization isn't random - it reveals important patterns about how atoms are structured and how elements behave!
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Periods (Rows)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">↔️</div>
                      <p className="text-sm font-medium">Horizontal Rows</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Horizontal rows in the table</li>
                      <li>• Elements have same number of electron shells</li>
                      <li>• Properties change across a period</li>
                      <li>• 7 periods in total</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Groups (Columns)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">↕️</div>
                      <p className="text-sm font-medium">Vertical Columns</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Vertical columns in the table</li>
                      <li>• Elements have similar properties</li>
                      <li>• Same number of valence electrons</li>
                      <li>• 18 groups in total</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Memory Tricks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">Periods (Rows)</h4>
                  <p className="text-sm text-gray-700">Think "Period = Across" - like reading across a sentence, period to period.</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">Groups (Columns)</h4>
                  <p className="text-sm text-gray-700">Think "Group = Family" - elements in the same column are like family members with similar traits.</p>
                </div>
              </div>
            </div>

            <TeachingMoment variant="blue">
              Here's the key insight: elements in the same GROUP (column) act similarly because they have the same number of outer electrons, while elements in the same PERIOD (row) have the same number of electron shells!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Element Information
    {
      id: 'element-info',
      type: 'concept',
      title: 'Reading Element Information',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What Each Element Square Tells You" variant="green">
              <p className="text-lg leading-relaxed mb-6">
                Every element on the periodic table has its own "address" and comes with important information. 
                Let's decode what all those numbers and letters mean!
              </p>
            </ConceptSection>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-200">
              <h3 className="text-lg font-semibold mb-4 text-center">Sample Element: Helium (He)</h3>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-xs mx-auto">
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600">Atomic Number</div>
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-4xl font-bold text-red-600">He</div>
                  <div className="text-sm text-gray-600">Element Symbol</div>
                  <div className="text-lg font-semibold">Helium</div>
                  <div className="text-sm text-gray-600">Element Name</div>
                  <div className="text-lg text-purple-600">4.003</div>
                  <div className="text-sm text-gray-600">Atomic Mass</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Atomic Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Number of protons</li>
                    <li>• Defines the element</li>
                    <li>• Never changes</li>
                    <li>• Helium = 2 protons</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Element Symbol</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• 1-2 letter abbreviation</li>
                    <li>• International standard</li>
                    <li>• Often from Latin names</li>
                    <li>• He = Helium</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700">Atomic Mass</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Average mass of atoms</li>
                    <li>• Includes protons + neutrons</li>
                    <li>• Usually decimal number</li>
                    <li>• He = 4.003 units</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">Quick Element Facts:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
                <p>• Hydrogen (H) is the simplest: 1 proton</p>
                <p>• Carbon (C) has 6 protons, basis of life</p>
                <p>• Gold (Au) comes from Latin "aurum"</p>
                <p>• Uranium (U) is the heaviest natural element</p>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Practice - Finding Helium
    {
      id: 'helium-practice',
      type: 'example',
      title: 'Practice: Finding Helium',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Locate Helium on the Periodic Table"
          problem="Look up the periodic table and find the element 'Helium.' What's its symbol, atomic number, and atomic mass? What group is it in?"
          variant="blue"
          solution={
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700">Helium Information:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">Basic Information</h5>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Symbol:</strong> He</li>
                    <li><strong>Atomic Number:</strong> 2</li>
                    <li><strong>Atomic Mass:</strong> 4.003</li>
                    <li><strong>Element Name:</strong> Helium</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">Location</h5>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Group:</strong> 18 (Noble Gases)</li>
                    <li><strong>Period:</strong> 1</li>
                    <li><strong>Position:</strong> Top right corner</li>
                    <li><strong>Type:</strong> Noble gas</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-700 mb-2">Cool Facts About Helium:</h5>
                <ul className="space-y-1 text-sm text-purple-600">
                  <li>• Second lightest element after hydrogen</li>
                  <li>• Doesn't react with other elements (noble gas)</li>
                  <li>• Makes your voice squeaky when inhaled</li>
                  <li>• Used in balloons because it's lighter than air</li>
                  <li>• First discovered in the sun before Earth!</li>
                </ul>
              </div>
            </div>
          }
          answer="Helium is a noble gas in Group 18, making it very stable and unreactive!"
        />
      )
    },

    // Screen 6: Chemical Trends
    {
      id: 'chemical-trends',
      type: 'concept',
      title: 'Chemical Trends and Patterns',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Deeper Dive: Trends on the Table</h4>
                <p>
                  The periodic table isn't just a list; it's a map of <strong>chemical trends</strong>. For example, elements in the same 
                  column (group) tend to have similar chemical properties because they have the same number of valence electrons (electrons 
                  in the outermost shell). Elements get more metallic as you go down and to the left of the table. Understanding these trends 
                  is key to predicting how elements will react with each other.
                </p>
              </AlertDescription>
            </Alert>

            <ConceptSection title="Major Periodic Trends" variant="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Metallic Character</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Increases:</strong> Down and left</p>
                        <p className="text-xs text-gray-600">Alkali metals are most metallic</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Decreases:</strong> Up and right</p>
                        <p className="text-xs text-gray-600">Non-metals in top right</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Atomic Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Increases:</strong> Down groups</p>
                        <p className="text-xs text-gray-600">More electron shells = bigger atoms</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Decreases:</strong> Across periods</p>
                        <p className="text-xs text-gray-600">More protons pull electrons closer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ConceptSection>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Predicting Element Behavior</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-purple-700">Reactivity</h4>
                  <p className="text-xs text-gray-600">Extreme edges most reactive</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🔗</div>
                  <h4 className="font-semibold text-blue-700">Bonding</h4>
                  <p className="text-xs text-gray-600">Valence electrons determine bonds</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-green-700">Properties</h4>
                  <p className="text-xs text-gray-600">Position predicts behavior</p>
                </div>
              </div>
            </div>

            <TeachingMoment variant="green">
              The beauty of the periodic table is that once you understand the patterns, you can predict how elements will behave even if you've never studied them before!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 7: Element Groups
    {
      id: 'element-groups',
      type: 'concept',
      title: 'Common Element Groups',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Element Families" variant="red">
              <p className="mb-6">
                Some groups of elements are so important they have special names. These "families" share similar properties 
                and behaviors because they have the same number of valence electrons.
              </p>
            </ConceptSection>

            <Card>
              <CardHeader>
                <CardTitle>Common Element Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">Group 1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Alkali Metals</h4>
                      <p className="text-sm text-muted-foreground">Very reactive metals (like sodium, potassium)</p>
                      <p className="text-xs text-gray-600">React explosively with water, soft metals</p>
                    </div>
                    <div className="text-3xl">🧂</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">Group 17</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Halogens</h4>
                      <p className="text-sm text-muted-foreground">Highly reactive non-metals (like fluorine, chlorine)</p>
                      <p className="text-xs text-gray-600">Form salts, used in disinfectants</p>
                    </div>
                    <div className="text-3xl">🏊</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">Group 18</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Noble Gases</h4>
                      <p className="text-sm text-muted-foreground">Very stable, rarely react (like helium, neon)</p>
                      <p className="text-xs text-gray-600">Complete electron shells, inert</p>
                    </div>
                    <div className="text-3xl">🎈</div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">Groups 3-12</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Transition Metals</h4>
                      <p className="text-sm text-muted-foreground">Hard metals with multiple oxidation states</p>
                      <p className="text-xs text-gray-600">Iron, copper, gold, silver</p>
                    </div>
                    <div className="text-3xl">⚙️</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-3">Why Groups Matter</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Predict chemical behavior</li>
                  <li>• Same number of valence electrons</li>
                  <li>• Similar bonding patterns</li>
                  <li>• Helpful for chemical reactions</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-3">Real-World Examples</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Table salt = Na (Group 1) + Cl (Group 17)</li>
                  <li>• Neon signs = Noble gases</li>
                  <li>• Jewelry = Transition metals</li>
                  <li>• Batteries = Alkali metals</li>
                </ul>
              </div>
            </div>

            <TeachingMoment variant="red">
              Groups are like chemical families - members share traits! This is why sodium and potassium (both Group 1) react similarly with water.
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 8: Summary and Key Terms
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: The Periodic Table',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Table Organization:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 118 elements arranged systematically</li>
                    <li>• Periods (rows) and Groups (columns)</li>
                    <li>• Shows atomic number and mass</li>
                    <li>• Reveals chemical patterns</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Important Groups:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Alkali metals (Group 1)</li>
                    <li>• Halogens (Group 17)</li>
                    <li>• Noble gases (Group 18)</li>
                    <li>• Transition metals (Groups 3-12)</li>
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
                    <h4 className="font-semibold">Periodic Table</h4>
                    <p className="text-sm text-muted-foreground">A chart of all the known chemical elements.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Group</h4>
                    <p className="text-sm text-muted-foreground">A column in the periodic table.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Period</h4>
                    <p className="text-sm text-muted-foreground">A row in the periodic table.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Valence Electrons</h4>
                    <p className="text-sm text-muted-foreground">Electrons in the outermost shell.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Atomic Number</h4>
                    <p className="text-sm text-muted-foreground">Number of protons in an atom.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Chemical Trends</h4>
                    <p className="text-sm text-muted-foreground">Patterns in element properties.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🧪 Outstanding!</h3>
              <p>You now have the key to understanding how all 118 elements relate to each other!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};