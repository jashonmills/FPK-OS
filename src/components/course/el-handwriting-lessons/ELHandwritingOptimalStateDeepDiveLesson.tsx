import React, { useState } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingOptimalStateDeepDiveLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [message, setMessage] = useState('');

  const correctAnswer = 'Reduces stress hormones';

  const handleQuizSubmit = () => {
    if (!selectedAnswer) {
      setMessage('Please select an answer.');
      return;
    }

    if (selectedAnswer === correctAnswer) {
      setMessage('Correct!');
      setQuizAnswered(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setMessage(`Incorrect again. The correct answer was "${correctAnswer}".`);
        setQuizAnswered(true);
      } else {
        setMessage(`That was a good try! You have ${2 - attempts} tries left.`);
      }
    }
  };

  return (
    <InteractiveLessonWrapper
      courseId="el-handwriting"
      lessonTitle="Optimal Learning State Techniques"
      lessonId={6}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Module 2 Deep Dive: Techniques for Optimal Learning State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Getting into an optimal learning state is more than just being calm. It's about achieving a focused, yet relaxed, state of mind where the brain is primed for new information. We talked about getting "grounded," which is the foundation of this state.
            </p>
            
            <p>
              You can achieve this through simple techniques like **box breathing** (4 seconds in, 4 hold, 4 out, 4 hold) or a **mindful body scan**, where you consciously relax each part of the body. These techniques reduce the stress hormone cortisol, which can inhibit learning, and promote the release of dopamine, which enhances focus and motivation.
            </p>

            <p>
              Creating a distraction-free environment is also key, as it minimizes the cognitive load on the brain, allowing it to dedicate more resources to the task at hand.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-semibold text-purple-800">Real-World Connection:</p>
              <p className="text-purple-700 mt-1">
                Imagine you're about to take a difficult exam. Your heart is racing, and your mind is full of distracting thoughts. This is a state of high stress. The techniques from this module are like a reset button. A few moments of mindful breathing can bring your heart rate down and clear your mind, putting you back in a state where your brain is ready to access information rather than being hijacked by stress.
              </p>
              <p className="font-semibold text-purple-800 mt-4">Learning Moment:</p>
              <p className="text-purple-700 mt-1">
                The key takeaway here is that **managing your state is a skill in itself.** The ability to consciously switch from a state of stress to a state of calm focus is a superpower. By practicing these techniques, you are building resilience and giving yourself a powerful tool to use not just in learning but in all areas of life.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Quiz: Module 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-4">What is the primary effect of techniques like box breathing on the brain?</p>
            <div className="space-y-2 mb-4">
              {['Increases heart rate', 'Reduces stress hormones', 'Enhances muscle memory'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name="quiz2"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={quizAnswered}
                  />
                  <label htmlFor={option} className="ml-2">{option}</label>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleQuizSubmit} disabled={quizAnswered}>
                Check Answer
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
              <p className={`mt-2 text-sm font-semibold ${selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {showGuidance && (
              <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                <p className="font-semibold">Guidance:</p>
                <p>Think about the effects of stress on your body and mind. What is the goal of "getting grounded"?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};