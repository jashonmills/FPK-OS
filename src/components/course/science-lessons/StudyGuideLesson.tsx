import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, PenTool } from 'lucide-react';
import studyGuideImage from '@/assets/study-guide-lesson.jpg';

export const StudyGuideLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Complete Study Guide</h1>
        <p className="text-lg text-muted-foreground">Comprehensive Review Materials</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={studyGuideImage} 
          alt="Comprehensive study guide with organized materials and reference books"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            Essay Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Scientific Method Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Discuss the critical steps of the scientific method and explain how each step contributes to a comprehensive 
                and reliable scientific investigation. Use a real-world example to illustrate your points.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Falsifiability in Science</h4>
              <p className="text-sm text-muted-foreground">
                Analyse the importance of falsifiability in a scientific hypothesis. How does this characteristic differentiate 
                scientific inquiry from other forms of explanation?
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Cell Types Comparison</h4>
              <p className="text-sm text-muted-foreground">
                Compare and contrast the fundamental characteristics of prokaryotic and eukaryotic cells, including their 
                structural components and evolutionary implications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Key Terms Glossary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Scientific Method</h4>
              <p className="text-sm text-muted-foreground">A systematic approach to inquiry</p>
            </div>
            <div>
              <h4 className="font-semibold">DNA</h4>
              <p className="text-sm text-muted-foreground">Molecule containing genetic instructions</p>
            </div>
            <div>
              <h4 className="font-semibold">Atom</h4>
              <p className="text-sm text-muted-foreground">Basic unit of chemical elements</p>
            </div>
            <div>
              <h4 className="font-semibold">Energy</h4>
              <p className="text-sm text-muted-foreground">The ability to do work</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};