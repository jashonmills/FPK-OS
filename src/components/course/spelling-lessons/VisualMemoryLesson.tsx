import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Image, Palette, Zap } from 'lucide-react';

export const VisualMemoryLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            The Power of Visualising
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>Visual memory is one of the most powerful learning tools we have. When we can see words in our mind's eye, spelling becomes much easier and more natural.</p>
            </div>
            
            <div className="grid gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                    <Image className="h-5 w-5" />
                    Creating Mental Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-700">
                    <p>When you visualize a word:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• See the letters clearly in your mind</li>
                      <li>• Notice the shape and size of each letter</li>
                      <li>• Pay attention to spacing between letters</li>
                      <li>• Make the image as vivid as possible</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                    <Palette className="h-5 w-5" />
                    Using Colors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-green-700">
                    <p>Colors enhance memory by:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Making letters more distinctive</li>
                      <li>• Creating stronger neural pathways</li>
                      <li>• Adding emotional connection to learning</li>
                      <li>• Improving recall accuracy</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                    <Zap className="h-5 w-5" />
                    The Reverse Spelling Trick
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-purple-700">
                    <p>Spelling words in reverse proves you truly "see" the word because:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• It requires visual memory, not just phonetic memory</li>
                      <li>• It confirms the word is stored as a complete image</li>
                      <li>• It strengthens the visual pathway to the word</li>
                      <li>• It makes forward spelling feel effortless</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h5 className="font-semibold mb-2 text-yellow-900">Practice Exercise</h5>
                  <p className="text-yellow-700">
                    Try visualizing the word "ELEPHANT" in bright blue letters. Can you see each letter clearly? 
                    Now try spelling it in reverse: T-N-A-H-P-E-L-E
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};