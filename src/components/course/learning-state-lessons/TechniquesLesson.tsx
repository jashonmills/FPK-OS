import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Clock, Lightbulb, Zap } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const TechniquesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module%201%20(b)%20-%20Learning%20Techniques.mp4"
        type="video"
        title="Learning Techniques Overview"
        mediaId="learning-techniques-video"
        courseId="optimal-learning-state"
        moduleId="2"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            Techniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>Below, we will outline a range of techniques useful for achieving our most effective learning state. Take your time, see what works, and be flexible. This might be different on any given day. All of the techniques are just as appropriate for parents, teachers, and children. Note that children who are stressed and have difficulty self-regulating easily pick up the stress of others.</p>

            <h2 className="text-xl font-semibold">In order to understand the basic principles, before we dive in, here is a brief overview of the why, when, what and how:</h2>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                  <Target className="h-5 w-5" />
                  Why?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  People can only learn or think clearly when they are calm and relaxed. It is almost impossible to learn when stressed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                  <Clock className="h-5 w-5" />
                  When?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  When you wake up, spend a few minutes getting into an effective learning state (this helps in life, not just education). You may like to repeat it whenever you are about to concentrate (such as homework) or are feeling confused and when you are trying to get to sleep.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                  <Lightbulb className="h-5 w-5" />
                  What?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700">
                  Just think back to when you learned a new skill easily. You could probably choose what it was and what motivated you to learn and practice. So give your child as much choice as possible. Remember we can learn so many school subjects through different "whats". For example, if you have a child who loves soccer, they can learn mathematics, geography, history, science, pretty much anything, by using soccer as the vehicle.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-orange-900">
                  <Zap className="h-5 w-5" />
                  How?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">
                  There are several ways to enter an effective learning state; here are a range. Give each one some time and allow yourself to find what works best for you and your child.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};