import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';

export const ReadingTechniqueLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            The Reading Technique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p>When we are reading in school or doing homework, usually our book is down on the table or on our lap. When we look down, that takes us into our emotional state and we've got a negative emotion attached to reading, we're going to feel negative about it and it's going to make it a lot more difficult for us.</p>
              
              <p className="font-medium text-lg text-primary">So when you want to read with your child don't put the book flat down on the table.</p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="flex items-center gap-2 text-yellow-800 font-semibold mb-4">
                <Eye className="h-6 w-6" />
                The Key Technique: Proper Book Positioning
              </h3>
              <p className="text-yellow-700 text-lg mb-0">
                <strong>Prop the book up so that it is closer to eye level for when they are reading.</strong>
              </p>
            </div>

            <div className="grid gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h3 className="flex items-center gap-2 text-green-800 font-semibold mb-3">
                  <Sparkles className="h-5 w-5" />
                  For Young Children
                </h3>
                <ul className="text-green-700 space-y-2 mb-0">
                  <li>• Let them come up with the story themselves</li>
                  <li>• Let them come up with pictures</li>
                  <li>• Let them describe what's happening</li>
                  <li>• Let them pick subjects that they're interested in</li>
                  <li>• Use fantastic books in your local library that help chart children's development</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h3 className="flex items-center gap-2 text-purple-800 font-semibold mb-3">
                  <Sparkles className="h-5 w-5" />
                  Encouraging Creativity
                </h3>
                <p className="text-purple-700 mb-2">
                  If your child is creating a story in their head or pictures and they start talking about pink coloured elephants, <strong>don't correct them</strong>, because this is their story.
                </p>
                <p className="text-purple-700 mb-0 font-medium">
                  You are nurturing their love for reading and their imagination.
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                <AlertTriangle className="h-5 w-5" />
                Why This Works
              </h3>
              <p className="text-red-700 mb-0">
                Looking down triggers negative emotional states associated with difficulty and struggle. By positioning the book at eye level, we maintain a neutral to positive emotional state, making reading more enjoyable and effective.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};