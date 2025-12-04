import React, { useState } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingScienceDeepDiveLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [message, setMessage] = useState('');

  const correctAnswer = 'Multisensory engagement';

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
      lessonTitle="The Science of Learning"
      lessonId={5}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-6 w-6" />
              Module 1 Deep Dive: The Science of Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The introduction to our main course spoke about the importance of practice and long-term improvement. Here, we'll expand on the neurological basis for this. **Handwriting is not just about muscle memory; it's a powerful tool for cognitive development.**
            </p>
            
            <p>
              The act of physically forming letters engages more of the brain's motor and cognitive centers than typing. This multisensory process—combining visual, motor, and kinesthetic feedback—creates stronger neural pathways, which leads to better retention and recall of information.
            </p>

            <p>
              Encouraging a growth mindset is also crucial, as it helps children view initial struggles not as failures but as essential steps on the path to mastery.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-semibold text-purple-800">Real-World Connection:</p>
              <p className="text-purple-700 mt-1">
                Think about how a musician learns to play a new piece. They don't just read the notes; they practice the physical movements, listening to the sound, and watching their hands on the instrument. This same combination of seeing, doing, and hearing is what makes handwriting a holistic learning exercise, creating a deeper and more lasting memory of letter shapes and spellings than simply typing them out.
              </p>
              <p className="font-semibold text-purple-800 mt-4">Learning Moment:</p>
              <p className="text-purple-700 mt-1">
                The key takeaway here is that **deliberate practice is a form of brain training.** Every time you put pen to paper with focused intent, you're not just moving your hand—you're strengthening the neural connections that link your vision, motor skills, and memory.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Quiz: Module 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-4">What cognitive process is most enhanced by the physical act of handwriting?</p>
            <div className="space-y-2 mb-4">
              {['Typing speed', 'Passive recall', 'Multisensory engagement'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name="quiz1"
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
                <p>Think about how many different senses and motor skills you are using when you write by hand versus when you type. Which one is more active and engaging for your brain?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};