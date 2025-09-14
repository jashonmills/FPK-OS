import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Dna } from 'lucide-react';

export const GeneticsAndDNALesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Genetics and DNA</h1>
        <p className="text-lg text-muted-foreground">Your Personal Blueprint</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Genetics is the study of how traits are passed down from parents to their children. At the very core of genetics is 
              <strong>DNA</strong> (Deoxyribonucleic acid), the molecule that holds the genetic instructions for all living things. 
              DNA is organised into <strong>genes</strong>, which are bits of DNA that contain the code for a specific protein or function.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <Dna className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">DNA Structure</h3>
                <p className="text-gray-600">The famous double helix - like a twisted ladder</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>The Four DNA Bases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">A</div>
              <h4 className="font-semibold">Adenine</h4>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">T</div>
              <h4 className="font-semibold">Thymine</h4>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">G</div>
              <h4 className="font-semibold">Guanine</h4>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">C</div>
              <h4 className="font-semibold">Cytosine</h4>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            The sequence of these bases creates the genetic code that makes you unique!
          </p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};