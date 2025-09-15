import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, FileText } from 'lucide-react';
import proofsReasoningImage from '@/assets/proofs-reasoning-lesson.jpg';

export const ProofsReasoningLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Proofs and Reasoning</h1>
        <p className="text-lg text-muted-foreground">Logical Reasoning and Mathematical Proof</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={proofsReasoningImage} 
          alt="Geometric proofs and reasoning with logical statements and mathematical notation"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              A <strong>proof</strong> is a logical argument that shows why a statement is true. 
              In geometry, we use definitions, postulates, theorems, and logical reasoning 
              to prove relationships between geometric figures.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border">
                <FileText className="h-16 w-16 text-violet-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Logical Reasoning</h3>
                <p className="text-gray-600">Step-by-step logical arguments</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Types of Reasoning</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Deductive Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Uses general rules to reach specific conclusions</li>
                    <li>• Goes from general to specific</li>
                    <li>• If premises are true, conclusion must be true</li>
                    <li>• Used in formal proofs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Inductive Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Uses specific examples to form general rules</li>
                    <li>• Goes from specific to general</li>
                    <li>• Makes educated guesses</li>
                    <li>• Used to form conjectures</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Components of Proof</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Given Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Facts provided in the problem</li>
                    <li>• Starting point of proof</li>
                    <li>• What we know to be true</li>
                    <li>• Foundation for reasoning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Prove Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• What we want to show is true</li>
                    <li>• Goal of the proof</li>
                    <li>• Must follow logically from given</li>
                    <li>• Conclusion we reach</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Statements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Logical steps in the proof</li>
                    <li>• What we conclude at each step</li>
                    <li>• Must follow previous statements</li>
                    <li>• Lead to final conclusion</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Why each statement is true</li>
                    <li>• Definitions, postulates, theorems</li>
                    <li>• Justify each step</li>
                    <li>• Support the logic</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Common Proof Methods</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Two-Column Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Statements in left column, reasons in right</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Most common format</li>
                    <li>• Clear organization</li>
                    <li>• Easy to follow logic</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">Paragraph Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Written in paragraph form</p>
                  <ul className="space-y-1 text-sm">
                    <li>• More natural language</li>
                    <li>• Flows like explanation</li>
                    <li>• Still logically organized</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-violet-200 bg-violet-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Proof Strategy:</h4>
          <p>
            Start with what you're given and work step-by-step toward what you want to prove. 
            Each step must be justified with a definition, postulate, or theorem!
          </p>
        </AlertDescription>
      </Alert>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Identify the reasoning:</h4>
              <p className="text-sm">Is this deductive or inductive? "All squares are rectangles. ABCD is a square. Therefore, ABCD is a rectangle."</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Write a statement:</h4>
              <p className="text-sm">Given: ∠A and ∠B are supplementary. ∠A = 70°. What can you conclude about ∠B?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Identify the given:</h4>
              <p className="text-sm">In triangle ABC, AB = BC. What type of triangle is ABC?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};