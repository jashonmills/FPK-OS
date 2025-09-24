import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Key, CheckCircle } from 'lucide-react';

interface GlossaryLessonProps {
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const GlossaryLesson: React.FC<GlossaryLessonProps> = ({ 
  onComplete,
  isCompleted = false 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Glossary of Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>This glossary contains definitions of key terms and concepts used throughout the Empowering Learning for Spelling programme. Use it as a reference guide to reinforce your understanding.</p>
            </div>
            
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-blue-900 mb-2">Optimal Learning State</h5>
                  <p className="text-gray-700">
                    A calm, relaxed mental and physical state that enhances the brain's ability to process, store, and recall information. 
                    Achieved through grounding techniques like the "Big Strong Tree" visualization.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-green-900 mb-2">Visual Memory</h5>
                  <p className="text-gray-700">
                    The ability to recall and manipulate mental images. In spelling, this means "seeing" words in the mind's eye 
                    rather than relying solely on phonetic or auditory memory.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-purple-900 mb-2">The Swan Technique</h5>
                  <p className="text-gray-700">
                    A method for identifying a person's natural visual access point by observing where their eyes move when 
                    creating mental images. Used to position the mental "whiteboard" in the optimal visual field.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-orange-900 mb-2">The Whiteboard</h5>
                  <p className="text-gray-700">
                    A mental "screen" or "board" in the visual field where words can be imagined, manipulated, and recalled. 
                    The whiteboard provides a consistent place to "write" and "see" spelling words.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-red-900 mb-2">Visual Access Point</h5>
                  <p className="text-gray-700">
                    The specific direction or position in a person's visual field where they naturally create and access mental images. 
                    Varies between individuals - some look up and left, others up and right.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-indigo-900 mb-2">Reverse Spelling</h5>
                  <p className="text-gray-700">
                    Spelling a word in reverse (from right to left) to confirm that it has been stored as a visual image 
                    rather than just phonetic memory. Proves true visual mastery of the word.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-pink-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-pink-900 mb-2">Grounding</h5>
                  <p className="text-gray-700">
                    The initial step in the technique involving relaxation and centering exercises (like the Big Strong Tree) 
                    to achieve the optimal learning state before beginning spelling practice.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-teal-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-teal-900 mb-2">Visual Learner</h5>
                  <p className="text-gray-700">
                    Someone who learns best through visual information processing, including mental imagery, colors, 
                    patterns, and spatial relationships. Often struggles with purely auditory or phonetic learning methods.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-yellow-900 mb-2">Color Coding</h5>
                  <p className="text-gray-700">
                    Using different colors for letters or words in visual memory to enhance recall and make spelling 
                    more distinctive and memorable. Colors create stronger neural pathways.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-gray-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">28-Day Practice</h5>
                  <p className="text-gray-700">
                    The recommended practice period of 10 minutes daily for 28 consecutive days to establish new neural 
                    pathways and make visual spelling automatic and effortless.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Key className="h-5 w-5 text-primary" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Core Technique Steps:</p>
                    <ol className="space-y-1 text-muted-foreground">
                      <li>1. Grounding (tree technique)</li>
                      <li>2. Check visualization (dog)</li>
                      <li>3. Stop moving images</li>
                      <li>4. Visualize spelling word</li>
                      <li>5. See letters clearly</li>
                      <li>6. Add colors</li>
                      <li>7. Spell forward and in reverse</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Advanced Techniques:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Swan technique for visual access</li>
                      <li>• Mental whiteboard positioning</li>
                      <li>• Color manipulation for memory</li>
                      <li>• Daily 10-minute practice</li>
                      <li>• Creative word selection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Complete Lesson Button */}
      {onComplete && !isCompleted && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button 
                onClick={onComplete}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Complete Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Completed Message */}
      {isCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span className="font-medium">Lesson Completed!</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};