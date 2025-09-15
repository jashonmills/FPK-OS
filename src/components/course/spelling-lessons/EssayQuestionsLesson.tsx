import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, PenTool, Lightbulb } from 'lucide-react';

export const EssayQuestionsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Essay Format Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>These longer-form questions will help you think deeply about the concepts and applications of the Empowering Learning for Spelling method. Take your time to reflect and provide detailed responses.</p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-blue-900 flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Essay Question 1
                    </h5>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="font-semibold text-blue-900 mb-2">The Role of Visual Learning in Spelling Success</p>
                      <p className="text-blue-700 mb-3">
                        Explain why visual memory techniques are particularly effective for spelling, especially for learners who have struggled with traditional phonetic methods. 
                        Discuss the neurological basis for visual learning and how it differs from auditory processing in the context of spelling acquisition.
                      </p>
                      <div className="text-sm text-blue-600">
                        <p><strong>Consider:</strong></p>
                        <ul className="ml-4 space-y-1">
                          <li>• Different learning styles and brain processing</li>
                          <li>• Why some students struggle in traditional classroom settings</li>
                          <li>• The relationship between visual memory and spelling accuracy</li>
                          <li>• Examples from your own experience or observations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-green-900 flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Essay Question 2
                    </h5>
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="font-semibold text-green-900 mb-2">Implementing the Technique: Challenges and Solutions</p>
                      <p className="text-green-700 mb-3">
                        Describe the potential challenges someone might face when first learning or teaching the Empowering Learning spelling technique. 
                        Propose practical solutions for overcoming these obstacles and maintaining motivation throughout the 28-day practice period.
                      </p>
                      <div className="text-sm text-green-600">
                        <p><strong>Consider:</strong></p>
                        <ul className="ml-4 space-y-1">
                          <li>• Initial skepticism or resistance to visual methods</li>
                          <li>• Difficulty in achieving the optimal learning state</li>
                          <li>• Maintaining consistency in daily practice</li>
                          <li>• Adapting the technique for different age groups</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-900 flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Essay Question 3
                    </h5>
                    <div className="bg-purple-50 p-4 rounded-md">
                      <p className="font-semibold text-purple-900 mb-2">Beyond Spelling: Applications of Visual Learning Techniques</p>
                      <p className="text-purple-700 mb-3">
                        Explore how the principles and techniques learned in this course could be applied to other areas of learning beyond spelling. 
                        Discuss the broader implications for education and learning support, particularly for visual learners who may struggle in traditional academic environments.
                      </p>
                      <div className="text-sm text-purple-600">
                        <p><strong>Consider:</strong></p>
                        <ul className="ml-4 space-y-1">
                          <li>• Applications in mathematics, reading, or other subjects</li>
                          <li>• Supporting learners with different needs and abilities</li>
                          <li>• The importance of identifying individual learning styles</li>
                          <li>• Implications for curriculum design and teaching methods</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-orange-900 flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Essay Question 4
                    </h5>
                    <div className="bg-orange-50 p-4 rounded-md">
                      <p className="font-semibold text-orange-900 mb-2">Personal Reflection and Action Plan</p>
                      <p className="text-orange-700 mb-3">
                        Reflect on your learning journey through this course and create a detailed action plan for implementing these techniques. 
                        Consider your personal learning style, the people you might help, and your long-term goals for using visual learning methods.
                      </p>
                      <div className="text-sm text-orange-600">
                        <p><strong>Consider:</strong></p>
                        <ul className="ml-4 space-y-1">
                          <li>• Your own experience with spelling and learning</li>
                          <li>• Who you might teach or support using these methods</li>
                          <li>• Your 28-day practice plan and goals</li>
                          <li>• How you'll measure success and track progress</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Take time to think about each question before writing</li>
                    <li>• Use specific examples and personal experiences</li>
                    <li>• Connect concepts from different lessons</li>
                    <li>• Write in your own words - there are no "perfect" answers</li>
                    <li>• Consider different perspectives and viewpoints</li>
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