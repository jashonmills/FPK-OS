import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Clock } from 'lucide-react';

export const FinalTipsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-primary" />
            Final Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>Now that you've learned the basic technique, here are some final tips to ensure your success with the Empowering Learning for Spelling method.</p>
            </div>
            
            <div className="grid gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Stay Consistent</h5>
                      <p className="text-blue-700">Practice for 10 minutes every day for 28 days. Consistency is more important than long practice sessions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-green-900">Keep It Fun</h5>
                      <p className="text-green-700">Be creative with your word choices. Use words that are meaningful and interesting to you.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-purple-900">Trust the Process</h5>
                      <p className="text-purple-700">Remember, you're not stupid - you just learn differently. This visual method works with your natural learning style.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h5 className="font-semibold mb-2">Remember Allen's Words</h5>
                  <p className="text-muted-foreground italic">
                    "You're gonna start to blow everybody's mind and maybe even blow your own one!"
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