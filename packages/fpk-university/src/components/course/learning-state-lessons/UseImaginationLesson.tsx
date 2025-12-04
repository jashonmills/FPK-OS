import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Eye, Play, Pause } from 'lucide-react';
import MediaPlayer from '@/components/course/MediaPlayer';

export const UseImaginationLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <MediaPlayer
        src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/learning-state-course/Module-12-Learning%20State/Module%2012%20-%20Use%20Their%20Imagination.mp4"
        type="video"
        title="Use Their Imagination"
        mediaId="use-imagination-video"
        courseId="optimal-learning-state"
        moduleId="13"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            Use Their Imagination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none space-y-4">
            <p className="text-lg font-medium text-purple-700">
              (Not too much parental/teacher instruction)
            </p>
            <p>
              It is so important for us to keep using our imagination as this is where wonderful ideas come from. Here is a really simple way of using our imaginations to help us learn:
            </p>
          </div>
          
          <Card className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                <Brain className="h-5 w-5" />
                Imagination Exercise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-purple-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div>Picture your favourite animal.</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div>How many of your favourite animals are there in your head right now?</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div>What colours are they?</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <div>Can you pick one out to focus on?</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                  <div>What does this one look like? What is it doing?</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">6</span>
                  <div className="flex items-center gap-2">
                    Can it talk? If so, what is it saying? Is there a speech bubble or can you hear the words?
                    <Eye className="h-4 w-4 text-purple-600" />
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">7</span>
                  <div className="flex items-center gap-2">
                    Is it moving around?
                    <Play className="h-4 w-4 text-purple-600" />
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">8</span>
                  <div className="flex items-center gap-2">
                    Can you get it to freeze? If not, imagine you have a remote control in your hand, now press the pause button on it and this will get your animal to pause.
                    <Pause className="h-4 w-4 text-purple-600" />
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">9</span>
                  <div>What is happening in your body right now?</div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">10</span>
                  <div className="font-medium">Remember there are no right answers for your imagination, it is yours.</div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                <Sparkles className="h-5 w-5" />
                Key Principle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 font-medium">
                This exercise helps children develop their visualization abilities while staying calm and focused. The imagination is a powerful tool for learning and creativity.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                Practice Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Allow children to explore their imagination freely without correction or judgment. This builds confidence in their creative abilities and helps them develop the skill of mental imagery, which is valuable for learning and problem-solving.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};