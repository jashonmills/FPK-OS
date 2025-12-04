import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle } from 'lucide-react';
import scientificMethodImage from '@/assets/scientific-method-lesson.jpg';

export const ScientificMethodLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">The Scientific Method</h1>
        <p className="text-lg text-muted-foreground">Your Roadmap to Discovery</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={scientificMethodImage} 
          alt="Scientist demonstrating the scientific method in a laboratory"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              The <strong>scientific method</strong> is a systematic process used to explore observations and answer questions. 
              It's not just for those in the lab; it's a way of thinking that helps us make sound decisions every day. 
              It provides a reliable framework for reaching conclusions based on evidence, not just guesswork.
            </p>

            <h3 className="text-xl font-semibold mb-4">The Five Steps</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-blue-900">Observation</h4>
                  <p className="text-blue-800">
                    It all kicks off with you noticing something and asking a question about it. For example, you might notice 
                    that the plants on your kitchen window grow faster than the ones in a darker corner of the sitting room. 
                    Your question is: "Why is that?"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-green-900">Hypothesis</h4>
                  <p className="text-green-800">
                    This is a testable explanation for your observation. It's a bit of an educated guess. For our plant example, 
                    a hypothesis could be: "Plants grow faster with more sunlight."
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </CardContent>
      </Card>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};