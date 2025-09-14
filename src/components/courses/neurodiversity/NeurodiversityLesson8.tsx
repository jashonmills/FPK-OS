import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Trophy, Search } from 'lucide-react';

interface NeurodiversityLesson8Props {
  onComplete?: () => void;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const NeurodiversityLesson8: React.FC<NeurodiversityLesson8Props> = ({
  onComplete,
  isCompleted,
  trackInteraction,
  lessonId,
  lessonTitle
}) => {

  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleQuestionClick = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
    
    trackInteraction?.('quiz_interaction', {
      questionId,
      action: newExpanded.has(questionId) ? 'expand' : 'collapse',
      lessonId,
      lessonTitle,
      timestamp: Date.now()
    });
  };

  const handleComplete = () => {
    trackInteraction?.('lesson_completion', {
      lessonId,
      lessonTitle,
      completionMethod: 'manual',
      timestamp: Date.now()
    });
    onComplete?.();
  };

  const questions = [
    {
      id: 1,
      question: "What is the core difference between the medical model and the social model of neurological differences?",
      answer: "The medical model views neurological differences as problems within the individual that need to be \"cured\" or \"fixed.\" In contrast, the social model argues that the real issue is a society not built to accommodate diverse minds, focusing on environmental support rather than individual pathology."
    },
    {
      id: 2,
      question: "Briefly define \"neurodiverse\" and explain why this term was coined.",
      answer: "\"Neurodiverse\" refers to an individual whose brain functions in a way that diverges significantly from the neurotypical majority. This term was created to be more empowering and inclusive, moving away from older, often pathologising clinical labels."
    },
    {
      id: 3,
      question: "How can dyslexia be reframed as a \"superpower,\" and in what fields might this strength be particularly useful?",
      answer: "Dyslexia can be reframed as a superpower by highlighting strengths like superior pattern recognition, spatial reasoning, and holistic thinking. These abilities are particularly useful in fields such as engineering, architecture, and the creative arts, where seeing entire systems is an asset."
    },
    {
      id: 4,
      question: "According to the text, what is a more accurate description for ADHD than \"attention deficit,\" and what strengths does it encompass?",
      answer: "A more accurate description for ADHD is \"attention variability,\" as individuals can often achieve hyperfocus on areas of passion. This encompasses strengths like highly associative thinking, which drives creativity and innovative problem-solving."
    },
    {
      id: 5,
      question: "How does the text suggest individuals with autism can leverage their \"attention to detail\" in academic or professional settings?",
      answer: "Individuals with autism can leverage their \"attention to detail\" to excel in analysing complex information, such as spotting tiny errors in code or identifying subtle details in government budgets or trade agreements that others might overlook. This precision makes them adept at problem-solving and quality control."
    },
    {
      id: 6,
      question: "What is Universal Design for Learning (UDL), and how does it relate to individual learning strategies?",
      answer: "Universal Design for Learning (UDL) is a framework acknowledging that there is no single \"correct\" way to learn and that what works for one person may not work for another. It promotes the idea that designing learning environments with diverse needs in mind benefits all students, allowing individuals to build their own effective learning systems."
    },
    {
      id: 7,
      question: "Provide an example of how \"multisensory learning\" might be applied by a student struggling with an abstract concept.",
      answer: "A student struggling with an abstract concept like supply and demand in economics could use multisensory learning by building a physical model of the curves with clay. This hands-on, three-dimensional activity helps to internalise the concept in a way that simply reading about it might not."
    },
    {
      id: 8,
      question: "Describe how FPK University's \"flexible pacing\" feature can benefit a student with fluctuating energy levels.",
      answer: "FPK University's \"flexible pacing\" feature allows students to work at a rhythm that suits their energy levels and focus, such as using the Pomodoro Technique. This helps manage mental energy throughout the day, preventing burnout and improving sustained productivity for students whose focus fluctuates."
    },
    {
      id: 9,
      question: "Why does the text argue that neurodiverse minds have a \"natural advantage\" in economics?",
      answer: "The text argues that neurodiverse minds have a \"natural advantage\" in economics because the field is built on patterns, relationships, and cause-and-effect logic. Strengths like systematic thinking and pattern recognition allow them to understand underlying economic structures rather than just memorise facts."
    },
    {
      id: 10,
      question: "How can \"argument mapping\" be a beneficial study tool for individuals with systematic thinking strengths in logic and critical thinking?",
      answer: "Argument mapping is a beneficial study tool for individuals with systematic thinking strengths because it provides a structured and visual way to break down complex ideas. It allows them to clearly see the main conclusion and the premises that support it, making logical structures more comprehensible than just reading text."
    }
  ];

  const glossaryData = [
    { term: "Neurodiversity", definition: "A concept proposing that variations in brain function, including how we learn, socialise, and pay attention, are natural and valuable parts of human diversity, akin to biodiversity. Coined by Judy Singer in 1998." },
    { term: "Neurodiverse", definition: "An individual whose brain functions in a way that diverges significantly from the neurotypical majority. This term aims to be empowering and inclusive." },
    { term: "Neurotypical", definition: "An individual whose brain functions in a way that aligns with the societal norm. Used to highlight the existence of neurological diversity." },
    { term: "Medical Model", definition: "A traditional perspective that views neurological differences as medical problems or disorders that need to be 'cured' or 'fixed.'" },
    { term: "Social Model", definition: "A perspective that argues the real issue isn't the individual's brain, but a society that is not built to accommodate a wide range of minds, advocating for environmental and societal accommodations." },
    { term: "Pattern Recognition", definition: "The ability to identify regularities and structures in data or information, often a strength in neurodiverse individuals, particularly those with dyslexia." },
    { term: "Hyperfocus", definition: "An intense, prolonged period of concentration on a specific task or area of interest, often experienced by individuals with ADHD or autism, allowing for deep and productive work." },
    { term: "Universal Design for Learning (UDL)", definition: "A framework that advocates for designing learning environments and materials to be accessible and effective for all learners, recognising that diverse approaches benefit everyone." },
    { term: "Multisensory Learning", definition: "An approach to learning that engages multiple senses (e.g., visual, auditory, kinesthetic, tactile) to improve comprehension and retention, especially beneficial for neurodiverse learners." },
    { term: "Self-Advocacy", definition: "The ability to understand one's own needs and confidently communicate them to others, particularly important for neurodiverse individuals seeking appropriate accommodations and support." },
  ];

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGlossary = glossaryData.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Unit Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
          <Trophy className="w-5 h-5 mr-2 text-indigo-600" />
          <span className="text-indigo-800 dark:text-indigo-200 font-semibold">UNIT 4: INTERACTIVE STUDY GUIDE</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">LESSON 4.2: Quiz & Assessment</h1>
        <p className="text-xl text-muted-foreground">Test Your Knowledge</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search questions or glossary terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Short-Answer Questions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Short-Answer Questions</h2>
        <p className="text-muted-foreground">
          Test your knowledge with these short-answer questions. Click on each question to reveal the answer.
        </p>
        
        <div className="space-y-4">
          {filteredQuestions.map((item) => (
            <Card key={item.id} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader
                className="cursor-pointer"
                onClick={() => handleQuestionClick(item.id)}
              >
                <CardTitle className="flex justify-between items-center text-base">
                  <span>{item.id}. {item.question}</span>
                  {expandedQuestions.has(item.id) ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedQuestions.has(item.id) && (
                <CardContent className="pt-0">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-l-green-500">
                    <p><strong>Answer:</strong> {item.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Essay Format Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Essay Format Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            These questions are designed for deeper reflection and analysis. Choose one and practice writing a detailed response.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-medium mb-2">1.</p>
              <p className="text-sm">
                Discuss how the shift from a "medical model" to a "social model" of neurodiversity fundamentally changes the approach to supporting neurodiverse individuals in educational and societal contexts. Provide specific examples from the text to illustrate this change.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-medium mb-2">2.</p>
              <p className="text-sm">
                Analyse how the concept of "reframing traits as strengths" applies to at least two specific neurodiverse conditions (e.g., dyslexia, ADHD, autism) as described in the source material. How do these reframed traits contribute to unique academic or professional "superpowers"?
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-medium mb-2">3.</p>
              <p className="text-sm">
                Evaluate the core learning strategies (structure and predictability, multisensory learning, self-advocacy) introduced in Lesson 2.1. Explain how each strategy addresses common challenges faced by neurodiverse learners and provides a personalised path to success.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-medium mb-2">4.</p>
              <p className="text-sm">
                FPK University positions itself as a platform "built for your brain." Discuss how its core features (customisable interface, flexible pacing, AI study coach) embody the principles of Universal Design for Learning (UDL) and actively support neurodiverse students beyond traditional educational models.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-medium mb-2">5.</p>
              <p className="text-sm">
                Drawing on the "Applying Your Strengths" unit, explain how neurodiverse cognitive styles are particularly well-suited for excelling in subjects like Economics and Logic & Critical Thinking. Provide examples of specific strengths and how they can be applied to master these fields.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card>
        <CardHeader>
          <CardTitle>Glossary of Key Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGlossary.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">{item.term}</h4>
                <p className="text-muted-foreground">{item.definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-6 h-6 mr-2" />
            Conclusion: Your Journey Begins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Welcome to FPK University. Your arrival here is not a coincidence, but the start of a new journey built just for you. For too long, you may have been told you need to change your mind to fit the world. We believe the opposite. We believe the world needs to change to fit your mind.
            </p>
            <p className="mt-4">
              Throughout this course, we've talked about what makes your brain unique—your attention to detail, your ability to see patterns, your capacity for deep focus. These are not just traits; they are the keys to a different kind of success. We want you to visualize where they can take you.
            </p>
            <p className="mt-4">
              You are not here to be fixed. You are here to learn how to harness your incredible potential. We know this journey can feel lonely, but you are not alone. This platform, and the community it is building, are here to support you. You have everything you need within you to succeed. Your journey begins now. Let's build a path to success together.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      {!isCompleted && (
        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleComplete}
            size="lg"
            className="px-8 py-3"
          >
            Complete Course
          </Button>
        </div>
      )}
    </div>
  );
};