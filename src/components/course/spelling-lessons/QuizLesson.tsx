import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, CheckCircle, Brain } from 'lucide-react';

export const QuizLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            Quiz - Short Answer Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>Test your understanding of the Empowering Learning for Spelling method with these short answer questions. Use them to reinforce your learning and identify areas that might need review.</p>
            </div>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-blue-900">Question 1:</h5>
                    <p className="text-gray-700">What is the first step in the Empowering Learning technique?</p>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-700"><strong>Answer:</strong> Grounding - using the tree or another technique from the Learning State programme to achieve the optimal learning state.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-green-900">Question 2:</h5>
                    <p className="text-gray-700">Why do you ask the person to visualize their dog at the beginning?</p>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-green-700"><strong>Answer:</strong> To check if their mental images are still or moving, and to help them learn to control their visual memory for optimal learning.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-purple-900">Question 3:</h5>
                    <p className="text-gray-700">What is the purpose of asking someone to spell a word backwards?</p>
                    <div className="bg-purple-50 p-3 rounded-md">
                      <p className="text-sm text-purple-700"><strong>Answer:</strong> It proves they truly "see" the word as a visual image rather than just remembering the sound, confirming the word is stored in visual memory.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-orange-900">Question 4:</h5>
                    <p className="text-gray-700">How long should you practice daily and for how many days?</p>
                    <div className="bg-orange-50 p-3 rounded-md">
                      <p className="text-sm text-orange-700"><strong>Answer:</strong> Practice for 10 minutes every day for 28 days to establish the visual spelling pathway.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-red-900">Question 5:</h5>
                    <p className="text-gray-700">What is the purpose of the Swan technique?</p>
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-sm text-red-700"><strong>Answer:</strong> To find a person's natural visual access point - the direction their eyes move when creating mental images - so you can position the whiteboard in their optimal visual field.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="font-semibold">Think About:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• How does this method differ from traditional spelling instruction?</li>
                    <li>• Why might visual learners struggle with phonetic spelling methods?</li>
                    <li>• How can you make the practice sessions more engaging and fun?</li>
                    <li>• What words would you like to practice first using this technique?</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};