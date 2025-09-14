import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Smartphone, Globe, Heart } from 'lucide-react';

export const ImportanceOfScienceLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">The Importance of Science</h1>
        <p className="text-lg text-muted-foreground">Science in Our Daily Lives</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Science is the very bedrock of modern society. From the technology in our smartphones to the medicine that keeps us well, 
              scientific discoveries have shaped our world. It's a tool for solving problems, from small, everyday issues to huge global 
              challenges like climate change and disease. Without a scientific approach, we'd be unable to innovate, improve, and protect 
              our quality of life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Technology</h3>
                <p className="text-sm text-gray-600">Every device we use is built on scientific principles</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Medicine</h3>
                <p className="text-sm text-gray-600">Scientific research saves millions of lives annually</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Environment</h3>
                <p className="text-sm text-gray-600">Science helps us understand and protect our planet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">A Moment for a Think:</h4>
          <p>
            Think about something you use every day, like a smartphone or a car. What scientific principles or discoveries 
            made that object possible? Consider the materials, the energy source, and the systems inside it.
          </p>
        </AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: The Internet and Science</h4>
          <p>
            The internet itself is a product of scientific research. It was originally a military project that later evolved 
            into a global network. The physics of electromagnetism, the engineering of computer chips, and the mathematics of 
            data transfer all had to come together for it to work. Every time you send a message, you're using a web of 
            scientific principles.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Science Impacts Every Aspect of Life</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Healthcare & Medicine</h4>
              <p className="text-sm text-muted-foreground">
                From vaccines to surgical procedures, scientific understanding keeps us healthy and alive.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Communication & Technology</h4>
              <p className="text-sm text-muted-foreground">
                The internet, smartphones, and satellites all depend on scientific breakthroughs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Transportation</h4>
              <p className="text-sm text-muted-foreground">
                Cars, planes, and trains use principles of physics, chemistry, and engineering.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Food & Agriculture</h4>
              <p className="text-sm text-muted-foreground">
                Scientific methods help us grow more food and preserve it safely.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};