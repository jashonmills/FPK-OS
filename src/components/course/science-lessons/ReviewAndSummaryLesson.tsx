import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, BookOpen, Microscope, Atom, Zap } from 'lucide-react';
import reviewSummaryImage from '@/assets/review-summary-lesson.jpg';

export const ReviewAndSummaryLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Review and Summary</h1>
        <p className="text-lg text-muted-foreground">Putting It All Together</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={reviewSummaryImage} 
          alt="Comprehensive science overview showing interconnected fields of biology, chemistry, and physics"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              In this course, you've been introduced to the basics of science. From the tiniest parts of an atom to the biggest ecosystems, 
              science is a way of understanding the world. You've learned how to think like a scientist and to see the links between the 
              different fields of study.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-blue-200 text-center p-4">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-blue-700 mb-2">Scientific Method</h3>
                <p className="text-sm text-gray-600">Universal tool for inquiry</p>
              </Card>

              <Card className="border-green-200 text-center p-4">
                <Microscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-700 mb-2">Biology</h3>
                <p className="text-sm text-gray-600">Study of life and living organisms</p>
              </Card>

              <Card className="border-red-200 text-center p-4">
                <Atom className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-red-700 mb-2">Chemistry</h3>
                <p className="text-sm text-gray-600">Building blocks of matter</p>
              </Card>

              <Card className="border-yellow-200 text-center p-4">
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold text-yellow-700 mb-2">Physics</h3>
                <p className="text-sm text-gray-600">Forces and energy in motion</p>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">What You've Learned</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">The Scientific Method</h4>
                <p className="text-blue-800">
                  A systematic process for exploring observations and answering questions through observation, hypothesis, 
                  experimentation, analysis, and conclusion.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Biology</h4>
                <p className="text-green-800">
                  The study of life, from tiny cells with their specialized organelles to the complex genetic code stored in DNA 
                  that makes each living thing unique.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-900 mb-2">Chemistry</h4>
                <p className="text-red-800">
                  The study of matter and its building blocks - atoms and molecules - and how they're organized in the periodic table 
                  to show relationships between elements.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-900 mb-2">Physics</h4>
                <p className="text-yellow-800">
                  The study of forces, motion, and energy, including Newton's laws and the conservation of energy that governs 
                  how objects move and interact.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: Interdisciplinary Science</h4>
          <p>
            The different fields of science aren't separate islands—they are all interconnected. For example, <strong>biochemistry</strong> 
            combines biology and chemistry to study the chemical processes within living organisms. <strong>Astrophysics</strong> combines 
            physics and astronomy to study the physical properties of stars and galaxies. As you continue your scientific journey, 
            you'll discover more and more ways that these fields overlap.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>The Scientific Fields Connect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Biochemistry</h4>
              <p className="text-sm text-purple-800">
                Biology + Chemistry: Studies chemical processes in living organisms
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-2">Biophysics</h4>
              <p className="text-sm text-indigo-800">
                Biology + Physics: Applies physics principles to biological systems
              </p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-semibold text-pink-900 mb-2">Physical Chemistry</h4>
              <p className="text-sm text-pink-800">
                Chemistry + Physics: Studies chemical phenomena using physics principles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Course Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-lg mb-4">
              Congratulations! You've completed an introduction to the fundamental concepts of science.
            </p>
            <p className="text-muted-foreground">
              You now have a solid foundation in scientific thinking and understand how biology, chemistry, and physics 
              work together to explain the natural world around us.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};