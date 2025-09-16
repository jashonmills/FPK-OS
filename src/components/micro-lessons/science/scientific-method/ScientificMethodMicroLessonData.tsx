import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../../../micro-lessons/ConceptScreen';
import { ExampleScreen, StepList } from '../../../micro-lessons/ExampleScreen';
import { PracticeScreen } from '../../../micro-lessons/PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../../../micro-lessons/MicroLessonContainer';
import { CheckCircle, Lightbulb, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import scientificMethodImage from '@/assets/scientific-method-lesson.jpg';

export const scientificMethodMicroLessons: MicroLessonData = {
  id: 'scientific-method',
  moduleTitle: 'The Scientific Method',
  totalScreens: 8,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to The Scientific Method',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔬📊🧪</div>
              <h2 className="text-2xl font-bold mb-4">The Scientific Method</h2>
              <p className="text-lg text-muted-foreground">Your Roadmap to Discovery</p>
            </div>

            <div className="mb-8">
              <img 
                src={scientificMethodImage} 
                alt="Scientist demonstrating the scientific method in a laboratory"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Master the 5-step scientific method</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understand observation and hypothesis</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Learn experimental design</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Apply scientific thinking daily</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              The scientific method isn't just for scientists in labs - it's a way of thinking that helps us make sound decisions every day!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is the Scientific Method?
    {
      id: 'what-is-scientific-method',
      type: 'concept',
      title: 'What is the Scientific Method?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Definition" variant="blue">
              <p className="text-lg leading-relaxed">
                The <strong>scientific method</strong> is a systematic process used to explore observations and answer questions. 
                It provides a reliable framework for reaching conclusions based on evidence, not just guesswork.
              </p>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Systematic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Follows a clear, ordered process</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Evidence-Based</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Relies on observable facts and data</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Produces consistent, trustworthy results</p>
                </CardContent>
              </Card>
            </div>

            <TeachingMoment variant="blue">
              Think about how you decide what to wear each day. You observe the weather, form a hypothesis about what would be comfortable, and test it by going outside!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Step 1 - Observation
    {
      id: 'observation-step',
      type: 'concept',
      title: 'Step 1: Observation',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-blue-900 text-xl">Observation</h3>
                <p className="text-blue-800 mt-2">
                  It all kicks off with you noticing something and asking a question about it.
                </p>
              </div>
            </div>

            <ConceptSection title="Real-World Example" variant="blue">
              <p className="mb-4">
                You might notice that the plants on your kitchen window grow faster than the ones in a darker corner of the sitting room.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-900">Your Question: "Why is that?"</p>
              </div>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Good Observations:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Specific and measurable</li>
                  <li>• Based on what you can see/detect</li>
                  <li>• Lead to testable questions</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Observation Skills:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Use all your senses</li>
                  <li>• Record what you notice</li>
                  <li>• Look for patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Step 2 - Hypothesis
    {
      id: 'hypothesis-step',
      type: 'concept',
      title: 'Step 2: Hypothesis',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-green-900 text-xl">Hypothesis</h3>
                <p className="text-green-800 mt-2">
                  This is a testable explanation for your observation. It's a bit of an educated guess.
                </p>
              </div>
            </div>

            <ConceptSection title="Plant Example Hypothesis" variant="green">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-900">"Plants grow faster with more sunlight."</p>
              </div>
            </ConceptSection>

            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Deeper Dive: The Art of the Hypothesis</h4>
                <p>
                  A good hypothesis is more than just a guess—it's a prediction that can be proven wrong. It must be <strong>falsifiable</strong>. 
                  If you hypothesise that "fairies make plants grow faster," there's no way to test or disprove that. A falsifiable hypothesis, 
                  like "plants grow faster with more sunlight," can be tested with an experiment. The best hypotheses are specific and measurable.
                </p>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Good Hypothesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Testable</li>
                    <li>• Falsifiable</li>
                    <li>• Specific</li>
                    <li>• Based on prior knowledge</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Poor Hypothesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Vague or unclear</li>
                    <li>• Cannot be tested</li>
                    <li>• Based on supernatural causes</li>
                    <li>• Too broad</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Steps 3-5 Overview
    {
      id: 'remaining-steps',
      type: 'concept',
      title: 'Steps 3, 4, and 5',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-purple-900">Experiment</h4>
                <p className="text-purple-800">
                  This is where you set up a controlled test of your hypothesis. To test the theory about the plants, 
                  you'd get two identical plants and give one plenty of sunlight and the other very little, while making sure 
                  everything else (water, soil, temperature) is the exact same.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-semibold text-orange-900">Analysis</h4>
                <p className="text-orange-800">
                  You gather and analyse the data from your experiment. You'd measure the growth of both plants over a period of time 
                  and compare your results.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h4 className="font-semibold text-red-900">Conclusion</h4>
                <p className="text-red-800">
                  You use your data to figure out if your hypothesis was correct or not. The conclusion either backs up your hypothesis 
                  or sends you back to the drawing board to form a new one.
                </p>
              </div>
            </div>

            <TeachingMoment variant="purple">
              Notice how each step builds on the previous one. The scientific method is like a chain - each link strengthens the whole process!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Practice Example
    {
      id: 'practice-example',
      type: 'example',
      title: 'Practice: Applying the Scientific Method',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Let's Practice Together!"
          problem="You notice that your smartphone battery drains faster on some days than others. Apply the scientific method to investigate this observation."
          variant="blue"
          solution={
            <div className="space-y-4">
              <StepList
                variant="blue"
                steps={[
                  "Observation: Smartphone battery drains at different rates on different days",
                  "Hypothesis: 'Heavy app usage drains the battery faster'",
                  "Experiment: Track app usage and battery drain for two weeks, comparing high-usage vs. low-usage days",
                  "Analysis: Compare battery drain percentages with app usage data",
                  "Conclusion: Determine if app usage correlates with faster battery drain"
                ]}
              />
            </div>
          }
          answer="This systematic approach helps us understand real-world phenomena using scientific thinking!"
        />
      )
    },

    // Screen 7: Key Terms Review
    {
      id: 'key-terms',
      type: 'concept',
      title: 'Key Terms and Concepts',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
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
                    <h4 className="font-semibold">Scientific Method</h4>
                    <p className="text-sm text-muted-foreground">A systematic approach to inquiry.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Hypothesis</h4>
                    <p className="text-sm text-muted-foreground">A testable, falsifiable explanation.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Falsifiable</h4>
                    <p className="text-sm text-muted-foreground">The ability to be proven wrong.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Conclusion</h4>
                    <p className="text-sm text-muted-foreground">The final outcome of an experiment.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Controlled Experiment</h4>
                    <p className="text-sm text-muted-foreground">Test with consistent conditions.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Variable</h4>
                    <p className="text-sm text-muted-foreground">Factor that can change in an experiment.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TeachingMoment>
              These terms form the foundation of scientific thinking. Understanding them helps you think more critically about the world around you!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 8: Summary and Real-World Applications
    {
      id: 'summary',
      type: 'concept',
      title: 'Summary: Scientific Thinking in Daily Life',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="What We've Learned" variant="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">The 5-Step Process:</h4>
                  <ol className="space-y-1 text-sm list-decimal list-inside">
                    <li>Observation</li>
                    <li>Hypothesis</li>
                    <li>Experiment</li>
                    <li>Analysis</li>
                    <li>Conclusion</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Principles:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Evidence-based thinking</li>
                    <li>• Systematic approach</li>
                    <li>• Testable hypotheses</li>
                    <li>• Objective analysis</li>
                  </ul>
                </div>
              </div>
            </ConceptSection>

            <Alert className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-bold mb-2">Real-World Applications:</h4>
                <p>
                  You can use the scientific method to solve everyday problems: troubleshooting technology issues, 
                  improving study habits, optimizing cooking recipes, or even deciding the best route to work!
                </p>
              </AlertDescription>
            </Alert>

            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
              <p>You've mastered the scientific method - your roadmap to discovery and critical thinking!</p>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};