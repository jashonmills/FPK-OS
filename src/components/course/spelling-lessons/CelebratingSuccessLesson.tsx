import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Smile, Award } from 'lucide-react';

export const CelebratingSuccessLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            The Final Word
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>Congratulations! You've completed the Empowering Learning for Spelling programme. You now have the tools and techniques to transform your spelling abilities using your natural visual learning style.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-yellow-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-yellow-900">What You've Learned</h5>
                      <ul className="text-yellow-700 space-y-1 mt-2">
                        <li>• The Optimal Learning State</li>
                        <li>• Visual memory techniques</li>
                        <li>• The step-by-step spelling method</li>
                        <li>• Advanced Swan & Whiteboard techniques</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-green-900">Your Next Steps</h5>
                      <ul className="text-green-700 space-y-1 mt-2">
                        <li>• Practice 10 minutes daily for 28 days</li>
                        <li>• Keep it fun and creative</li>
                        <li>• Share your success with others</li>
                        <li>• Trust in your visual abilities</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Smile className="h-12 w-12 mx-auto" />
                  <h4 className="text-2xl font-bold">Remember Allen's Promise</h4>
                  <blockquote className="text-lg italic">
                    "You're gonna start to blow everybody's mind and maybe even blow your own one!"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-primary mb-2">28</div>
                  <p className="text-muted-foreground">Days of practice</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-primary mb-2">10</div>
                  <p className="text-muted-foreground">Minutes per day</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-primary mb-2">∞</div>
                  <p className="text-muted-foreground">Improved confidence</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h5 className="font-semibold mb-2 text-blue-900">Final Reminder</h5>
                  <p className="text-blue-700">
                    You're not stupid - you just learn differently. This visual method works with your natural learning style. 
                    Be patient with yourself, celebrate small wins, and remember that every expert was once a beginner.
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