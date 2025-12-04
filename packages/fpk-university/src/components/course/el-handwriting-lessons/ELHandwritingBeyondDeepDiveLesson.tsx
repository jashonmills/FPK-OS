import React, { useState } from 'react';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { LessonProps } from '@/types/course';

export const ELHandwritingBeyondDeepDiveLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [message, setMessage] = useState('');

  const correctAnswer = 'Lifelong learning';

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
      lessonTitle="Beyond Handwriting"
      lessonId={8}
      onComplete={onComplete}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Module 4 Deep Dive: Beyond Handwriting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The principles you've learned for handwriting—mindfulness, emulation, and deliberate practice—are not confined to this one skill. They form a versatile toolkit for **lifelong learning**.
            </p>
            
            <p>
              You can apply these same techniques to help your child master other skills. When learning a musical instrument, they can watch a master's hand movements. For sports, they can study the form of professional athletes. By teaching them this foundational approach to learning, you're not just improving their handwriting; you're equipping them with a powerful framework for excelling in any area of life they choose to explore.
            </p>

            <p>
              The next step is to identify a new skill and apply the same principles you've mastered in this course.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-semibold text-purple-800">Real-World Connection:</p>
              <p className="text-purple-700 mt-1">
                This module's principles can be applied to any skill a student wants to learn. For example, a student interested in coding could use a similar method to learn a new programming language. They could observe and emulate clean, efficient code from a mentor or open-source project. They could use mindful breathing to stay focused during long coding sessions. The principles are universal and create a pathway for continuous learning and self-improvement in any field.
              </p>
              <p className="font-semibold text-purple-800 mt-4">Learning Moment:</p>
              <p className="text-purple-700 mt-1">
                The key takeaway here is that **you are not just learning a skill; you are learning how to learn.** This framework of mindset, state control, and deliberate practice is the ultimate meta-skill. You've completed a powerful course on handwriting, but you've also gained a universal tool that can be applied to any challenge, from academic subjects to creative pursuits and beyond.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Quiz: Module 4</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-4">The principles learned in this course are best described as a toolkit for what?</p>
            <div className="space-y-2 mb-4">
              {['Specific handwriting styles', 'Lifelong learning', 'Typing faster'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name="quiz4"
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
                <p>Consider the overarching message of this final module. Is the course only about one specific skill, or is it about a broader, more universal approach to development?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InteractiveLessonWrapper>
  );
};