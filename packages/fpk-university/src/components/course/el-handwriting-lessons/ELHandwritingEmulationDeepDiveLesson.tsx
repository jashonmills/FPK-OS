import React, { useState } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingEmulationDeepDiveLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [message, setMessage] = useState('');

  const correctAnswer = 'Observational learning';

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
      lessonTitle="The Art and Science of Emulation"
      lessonId={7}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Module 3 Deep Dive: The Art and Science of Emulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The technique of emulating handwriting is not just copying; it's a form of **observational learning** and **deliberate practice**. By having a child look directly at the handwriting they admire, we engage their mirror neurons, which fire both when an action is performed and when it's observed.
            </p>
            
            <p>
              This process helps them internalize the patterns and flow of the desired handwriting. The initial "messiness" is a natural part of this process—it's the brain's way of experimenting and mapping the new motor skills. As they continue to practice daily, the neural pathways become more refined, and the messy attempts gradually transform into the desired handwriting style.
            </p>

            <p>
              This process mirrors how master artists and musicians learn, by studying the work of those they wish to emulate.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-semibold text-purple-800">Real-World Connection:</p>
              <p className="text-purple-700 mt-1">
                Think about how a basketball player learns a new move. They don't just get a verbal description; they watch a professional execute the move perfectly. They study the footwork, the angle of the arm, and the release of the ball. Then, they go out and practice, often with messy and awkward results at first. But with repeated, deliberate practice, their body and brain learn to emulate the movement, and it becomes second nature.
              </p>
              <p className="font-semibold text-purple-800 mt-4">Learning Moment:</p>
              <p className="text-purple-700 mt-1">
                The key takeaway here is that **emulation is a shortcut to expertise.** Instead of starting from scratch, you're leveraging the knowledge and experience of a master. Your brain is a powerful pattern-recognition machine, and this technique gives it a clear, compelling pattern to follow.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Quiz: Module 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-4">The concept of "mirror neurons" is most relevant to which part of the technique?</p>
            <div className="space-y-2 mb-4">
              {['Mindful breathing', 'Deliberate practice', 'Observational learning'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name="quiz3"
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
                <p>Mirror neurons are active when you perform an action and also when you observe someone else performing the same action. Which step of the technique involves watching someone else?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};