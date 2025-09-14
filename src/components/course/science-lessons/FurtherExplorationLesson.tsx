import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Rocket, Telescope, Microscope, Cpu, Dna, Globe } from 'lucide-react';

export const FurtherExplorationLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Further Exploration</h1>
        <p className="text-lg text-muted-foreground">Your Next Steps in Science</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              This course is just the beginning of the road. The world of science is massive and full of opportunities. 
              Whether you're thinking of a career as a doctor, an engineer, a researcher, or a teacher, a solid foundation 
              in science is key. You can keep learning by diving into more advanced topics in any of the fields we've touched on. 
              The journey of scientific discovery is a lifelong one, so it is.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-blue-200 text-center p-4">
                <Microscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-blue-700 mb-2">Medicine & Healthcare</h3>
                <p className="text-sm text-gray-600">Doctor, nurse, researcher, pharmacist</p>
              </Card>

              <Card className="border-green-200 text-center p-4">
                <Cpu className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-700 mb-2">Engineering & Technology</h3>
                <p className="text-sm text-gray-600">Software, mechanical, electrical engineer</p>
              </Card>

              <Card className="border-purple-200 text-center p-4">
                <Telescope className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-purple-700 mb-2">Research & Academia</h3>
                <p className="text-sm text-gray-600">Scientist, professor, lab researcher</p>
              </Card>

              <Card className="border-yellow-200 text-center p-4">
                <Globe className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold text-yellow-700 mb-2">Environmental Science</h3>
                <p className="text-sm text-gray-600">Climate researcher, conservationist</p>
              </Card>

              <Card className="border-red-200 text-center p-4">
                <Dna className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-red-700 mb-2">Biotechnology</h3>
                <p className="text-sm text-gray-600">Genetic engineer, biotech researcher</p>
              </Card>

              <Card className="border-orange-200 text-center p-4">
                <Rocket className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-orange-700 mb-2">Space & Astronomy</h3>
                <p className="text-sm text-gray-600">Astronaut, astrophysicist, mission control</p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: The Future of Science</h4>
          <p>
            Science is constantly evolving. Breakthroughs in quantum computing could change the way we process information. 
            Advancements in genetic engineering could help us cure diseases. And as we continue to explore space, we'll uncover 
            new mysteries about the universe. The future of science is a blank canvas, and the next big discovery could be made by 
            someone just like you.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Emerging Scientific Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quantum Computing</h4>
              <p className="text-sm text-blue-800">
                Using quantum mechanics to process information in revolutionary ways
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">CRISPR Gene Editing</h4>
              <p className="text-sm text-green-800">
                Precisely editing DNA to treat genetic diseases and enhance crops
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Artificial Intelligence</h4>
              <p className="text-sm text-purple-800">
                Creating machines that can learn and make decisions like humans
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Space Exploration</h4>
              <p className="text-sm text-orange-800">
                Missions to Mars, asteroid mining, and the search for life beyond Earth
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Continue Your Science Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Take Advanced Courses</h4>
                <p className="text-sm text-muted-foreground">
                  Dive deeper into biology, chemistry, physics, or explore new fields like environmental science
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Join Science Clubs</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other science enthusiasts and participate in experiments and competitions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Read Scientific Literature</h4>
                <p className="text-sm text-muted-foreground">
                  Stay updated with the latest discoveries through science magazines and journals
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Consider STEM Education</h4>
                <p className="text-sm text-muted-foreground">
                  Pursue degrees in science, technology, engineering, or mathematics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            Your Scientific Adventure Awaits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-lg mb-4">
              Science is not just a subject—it's a way of thinking, questioning, and understanding the world around us.
            </p>
            <p className="text-muted-foreground">
              The curiosity and scientific thinking skills you've developed in this course will serve you well in any field you choose. 
              Keep asking questions, keep experimenting, and keep discovering!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};