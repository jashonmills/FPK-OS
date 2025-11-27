import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import shortAnswerQuestionsImage from '@/assets/short-answer-questions-lesson.jpg';

export const ShortAnswerQuestionsLesson: React.FC = () => {
  const questions = [
    {
      question: "What is the purpose of the scientific method in scientific inquiry?",
      answer: "The scientific method is a systematic process designed to explore observations and answer questions. It provides a reliable framework for reaching conclusions based on evidence rather than guesswork, guiding discovery and decision-making."
    },
    {
      question: "What makes a hypothesis \"falsifiable,\" and why is this quality important?",
      answer: "A hypothesis is falsifiable if it can be proven wrong through experimentation or observation. This is crucial because it ensures the hypothesis can be tested and disproved, preventing untestable claims from being considered scientific."
    },
    {
      question: "Describe the key structural difference between prokaryotic and eukaryotic cells.",
      answer: "Prokaryotic cells are simpler and lack a nucleus and other specialised organelles, like bacteria. Eukaryotic cells, on the other hand, are more complex and possess a nucleus, along with various organelles, characteristic of animal and plant cells."
    },
    {
      question: "What is the primary function of DNA, and how are genes related to it?",
      answer: "DNA (Deoxyribonucleic acid) is the molecule that holds the genetic instructions for all living things. Genes are specific segments of DNA that contain the code for a particular protein or function, thereby carrying hereditary information."
    },
    {
      question: "How does the electron cloud model differ from the planetary model in describing atomic structure?",
      answer: "The planetary model visualises electrons orbiting the nucleus in neat, predictable paths, similar to planets around a sun. In contrast, the electron cloud model suggests that electrons exist in a probability cloud around the nucleus, meaning their exact location cannot be known, only where they are most likely to be found."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Short-Answer Questions</h1>
        <p className="text-lg text-muted-foreground">Test Your Understanding</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={shortAnswerQuestionsImage} 
          alt="Student studying science with textbooks and materials"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Answer each question in 2-3 sentences.</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-4">{q.question}</p>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800">{q.answer}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};