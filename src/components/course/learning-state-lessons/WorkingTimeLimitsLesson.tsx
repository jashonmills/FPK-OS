import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Smartphone, Coffee, Settings } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const WorkingTimeLimitsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/ep-learning-v2/Module%2011%20-%20Working%20Time%20Limits.mp4"
        type="video"
        title="Working Time Limits"
        mediaId="working-time-limits-video"
        courseId="empowering-learning-state"
        moduleId="12"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            Working Time Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p>If you struggle to concentrate for long, set Working Time Limits for yourself. We are all different so we need to play around to find what amount of time works best for us. Pick a time to work for, set it on your phone and when your time is up, then you can take a break, but use the timers for your break also.</p>
            
            <p>If you are struggling to stay focused for the timer you have picked, plant yourself and commit to finish out your time and then maybe pick a shorter timer for your next block. Having choices is valuable.</p>
          </div>
          
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                <Settings className="h-5 w-5" />
                How to Set Up Time Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-blue-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div><strong>Choose your work duration:</strong> Start with what feels manageable (5, 10, 15, or 25 minutes)</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div><strong>Set your timer:</strong> Use your phone, watch, or any timer device</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div><strong>Work with focus:</strong> Commit to working until the timer goes off</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <div><strong>Take a timed break:</strong> Set another timer for your break period</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                  <div><strong>Adjust as needed:</strong> If you struggled, try a shorter time block next</div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 lg:grid-cols-2 mt-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                  <Clock className="h-5 w-5" />
                  Suggested Work Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-green-800">
                  <p>• <strong>Beginners:</strong> 5-10 minutes</p>
                  <p>• <strong>Building focus:</strong> 15-20 minutes</p>
                  <p>• <strong>Established routine:</strong> 25-30 minutes</p>
                  <p>• <strong>Advanced:</strong> 45-50 minutes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-orange-900">
                  <Coffee className="h-5 w-5" />
                  Suggested Break Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-orange-800">
                  <p>• <strong>Short work blocks:</strong> 2-5 minutes</p>
                  <p>• <strong>Medium work blocks:</strong> 5-10 minutes</p>
                  <p>• <strong>Longer work blocks:</strong> 10-15 minutes</p>
                  <p>• <strong>Extended sessions:</strong> 15-30 minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <Smartphone className="h-5 w-5" />
                Key Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-amber-800">
                <p>• <strong>Flexibility:</strong> Adjust times based on your attention span</p>
                <p>• <strong>Commitment:</strong> Once you set a timer, stick to it</p>
                <p>• <strong>Progressive:</strong> Gradually increase work times as focus improves</p>
                <p>• <strong>Choice:</strong> Having control over your time increases motivation</p>
                <p>• <strong>Breaks matter:</strong> Timed breaks prevent burnout</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start with shorter time blocks than you think you need. Success builds confidence and motivation. It's better to complete several short, focused sessions than to struggle through one long, unfocused session.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};