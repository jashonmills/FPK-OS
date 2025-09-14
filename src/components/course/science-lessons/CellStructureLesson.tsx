import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Zap, Shield, Database } from 'lucide-react';

export const CellStructureLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Cell Structure and Function</h1>
        <p className="text-lg text-muted-foreground">The Building Blocks of Life</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              A <strong>cell</strong> is the most basic unit of life. There are two main types: prokaryotic and eukaryotic. 
              <strong>Prokaryotic cells</strong> are simple and don't have a nucleus (like bacteria), while <strong>eukaryotic cells</strong> 
              are more complex and have a nucleus along with other specialised parts called organelles (like animal and plant cells).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Prokaryotic Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Simple structure</li>
                    <li>• No nucleus</li>
                    <li>• No membrane-bound organelles</li>
                    <li>• Example: Bacteria</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Eukaryotic Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Complex structure</li>
                    <li>• Has a nucleus</li>
                    <li>• Multiple organelles</li>
                    <li>• Example: Animal & plant cells</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Key Organelles and Their Functions</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900">Nucleus</h4>
                  <p className="text-blue-800">
                    The control centre, holding the cell's genetic material (DNA).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <Zap className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900">Mitochondria</h4>
                  <p className="text-green-800">
                    The cell's powerhouses, generating energy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-purple-900">Cell Membrane</h4>
                  <p className="text-purple-800">
                    The protective outer layer that controls what gets in and out of the cell.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="h-6 w-6 bg-orange-600 rounded-full mt-1"></div>
                <div>
                  <h4 className="font-semibold text-orange-900">Cytoplasm</h4>
                  <p className="text-orange-800">
                    The jelly-like goo that fills the cell and holds the organelles in place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: The Power of the Mitochondria</h4>
          <p>
            Mitochondria are fascinating. They have their own small set of DNA, separate from the DNA in the cell's nucleus. 
            This has led scientists to believe that mitochondria were once separate, free-living bacteria that were absorbed by larger 
            cells billions of years ago in a process called <strong>endosymbiosis</strong>. This symbiotic relationship allowed both 
            the host cell and the mitochondria to survive and thrive, a major event in the evolution of complex life.
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
              <h4 className="font-semibold">Cell</h4>
              <p className="text-sm text-muted-foreground">The basic unit of life.</p>
            </div>
            <div>
              <h4 className="font-semibold">Eukaryotic Cell</h4>
              <p className="text-sm text-muted-foreground">A cell with a nucleus.</p>
            </div>
            <div>
              <h4 className="font-semibold">Prokaryotic Cell</h4>
              <p className="text-sm text-muted-foreground">A cell without a nucleus.</p>
            </div>
            <div>
              <h4 className="font-semibold">Organelles</h4>
              <p className="text-sm text-muted-foreground">The specialized parts within a cell.</p>
            </div>
            <div>
              <h4 className="font-semibold">Endosymbiosis</h4>
              <p className="text-sm text-muted-foreground">Process where one organism lives inside another.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};