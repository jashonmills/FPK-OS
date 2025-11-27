import React, { useState, useRef } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaPlayer from '@/components/course/MediaPlayer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { LessonProps } from '@/types/course';

const steps = [
  { id: 'step-1', text: 'Pick handwriting that they would like to emulate' },
  { id: 'step-2', text: 'Put up on a screen at eye level' },
  { id: 'step-3', text: 'Look directly at the handwriting, not down at the page' },
  { id: 'step-4', text: 'Practice for a few minutes every day' }
];

const correctOrder = ['step-1', 'step-2', 'step-3', 'step-4'];

export const ELHandwritingTechniqueLesson: React.FC<LessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext, 
  lessonId, 
  lessonTitle, 
  totalLessons 
}) => {
  const [draggedItems, setDraggedItems] = useState(steps);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [message, setMessage] = useState('');
  const dragOverRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    const newItems = [...draggedItems];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setDraggedItems(newItems);
  };

  const checkOrder = () => {
    const userOrder = draggedItems.map(item => item.id);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    
    if (isCorrect) {
      setMessage('Correct! The order is perfect.');
      setIsCompleted(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setMessage("Incorrect again. Let's review the technique carefully.");
      } else {
        const encouragingMessages = [
          "That was a good try! Let's think about this a different way.",
          "Nice attempt! Remember the key principle we just learned."
        ];
        setMessage(`${encouragingMessages[attempts]} You have ${2 - attempts} tries left.`);
      }
    }
  };

  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle={lessonTitle || "The Technique"}
      lessonId={lessonId || 3}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
      totalLessons={totalLessons}
    >
      <div className="space-y-6">
        <MediaPlayer
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/Module%203%20-%20The%20Technique.mp4"
          type="video"
          title="Module 3 - The Technique"
          mediaId="el-handwriting-technique-video"
          courseId="el-handwriting"
          moduleId="3"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              The Technique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              First, get your child to pick handwriting that they would like to emulate. That might be yours, it might be a sibling's, it might be another person that they know, it might be some handwriting that they've seen on the internet but get them to pick one that they would like.
            </p>
            
            <p>
              Then put up on a screen at eye level, not looking down cause we don't want to bring them into that negative emotional state. Then get them to write by looking directly at the handwriting, not down at the page they are writing on.
            </p>

            <p>
              Ideally if you can, you'll have them writing up like on a whiteboard or a chalkboard, but if not get them to just keep looking at the handwriting and write. It will be really messy and all over the place. You can have a good laugh together because that's what it should do at the very start.
            </p>

            <p>
              Let them do it for a few minutes every day and what you'll slowly start to notice is that their writing starts to look like what they want it to. It is a slow process, so there's no time pressure on this.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Activity: Drag and Drop the Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 font-semibold">Drag and drop the steps to the correct order of the technique:</p>
            
            <div ref={dragOverRef} className="bg-gray-100 p-4 rounded-lg shadow-inner space-y-2 mb-4">
              {draggedItems.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="p-3 border border-gray-300 bg-white rounded-lg cursor-grab hover:shadow-md transition-shadow"
                >
                  {item.text}
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button onClick={checkOrder} disabled={isCompleted}>
                Check Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowGuidance(!showGuidance)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {showGuidance ? 'Hide Guidance' : 'Show Guidance'}
              </Button>
            </div>

            {message && (
              <p className={`mt-2 text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {showGuidance && (
              <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                <p className="font-semibold">Guidance:</p>
                <p>1. **Pick the Right Start:** What's the very first thing you do before even thinking about handwriting?</p>
                <p>2. **Focus on the eyes:** The next step is about where the child should be looking.</p>
                <p>3. **The physical action:** The next step is what the child should be doing with the pencil on the page.</p>
                <p>4. **Practice:** The final step is about consistency over time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};