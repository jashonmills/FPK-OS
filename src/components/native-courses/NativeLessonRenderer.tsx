import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DOMPurify from 'isomorphic-dompurify';

interface QuizOption {
  id: string;
  text: string;
}

interface MCQAnswerKey {
  correct_answer: string;
  explanation?: string;
}

interface MultiAnswerKey {
  correct_answers: string[];
  explanation?: string;
}

interface NumericAnswerKey {
  correct_value: number;
  explanation?: string;
}

interface QuizItem {
  id: string;
  kind: 'mcq' | 'multi' | 'numeric';
  prompt: string;
  options_json: QuizOption[];
  answer_key_json: MCQAnswerKey | MultiAnswerKey | NumericAnswerKey;
  points: number;
  order_index: number;
}

interface BlockDataRichText {
  html: string;
}

interface BlockDataImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LessonBlock {
  id: string;
  type: 'rich-text' | 'image' | 'legacy-html' | 'quiz';
  order_index: number;
  data_json: BlockDataRichText | BlockDataImage | Record<string, unknown>;
  quiz_items?: QuizItem[];
}

interface LessonData {
  id: string;
  title: string;
  lesson_blocks: LessonBlock[];
}

interface NativeLessonRendererProps {
  lesson: LessonData;
}

export function NativeLessonRenderer({ lesson }: NativeLessonRendererProps) {
  // Sort blocks by order_index
  const sortedBlocks = lesson.lesson_blocks?.sort((a, b) => a.order_index - b.order_index) || [];

  const renderBlock = (block: LessonBlock) => {
    const data = block.data_json as Record<string, any>;
    switch (block.type) {
      case 'rich-text':
        return (
          <Card key={block.id} className="mb-6">
            <CardContent className="pt-6">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.html || '', {
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 'div', 'span', 'table', 'tbody', 'tr', 'td', 'th'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style']
                  })
                }}
              />
            </CardContent>
          </Card>
        );

      case 'image':
        return (
          <Card key={block.id} className="mb-6">
            <CardContent className="pt-6 text-center">
              <img
                src={data.src}
                alt={data.alt || 'Course image'}
                className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
              />
              {data.caption && (
                <p className="text-sm text-muted-foreground mt-2">
                  {data.caption}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 'legacy-html':
        const proxyUrl = `/native-content/${data.packageId}/${data.src}`;
        return (
          <Card key={block.id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                Interactive Content
                <Badge variant="secondary" className="ml-2">Legacy</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src={proxyUrl}
                className="w-full h-96 border rounded-lg"
                sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-popups"
                title="Interactive lesson content"
              />
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <Card key={block.id} className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                Knowledge Check
                <Badge variant="default" className="ml-2 fpk-gradient text-white">Quiz</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuizRenderer items={block.quiz_items || []} />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Badge variant="outline">{sortedBlocks.length} sections</Badge>
          <span>•</span>
          <span>Interactive Lesson</span>
        </div>
      </div>

      <div className="space-y-6">
        {sortedBlocks.map(renderBlock)}
      </div>
    </div>
  );
}

// Quiz renderer component
function QuizRenderer({ items }: { items: QuizItem[] }) {
  const [answers, setAnswers] = React.useState<{ [key: string]: string | string[] | number }>({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleAnswerChange = (itemId: string, value: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would typically send answers to the server
    console.log('Quiz answers:', answers);
  };

  const sortedItems = items.sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-6">
      {sortedItems.map((item, index) => (
        <div key={item.id} className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">
            Question {index + 1}: {item.prompt}
          </h4>

          {item.kind === 'mcq' && (
            <div className="space-y-2">
              {item.options_json.map((option: QuizOption) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${item.id}`}
                    value={option.id}
                    onChange={() => handleAnswerChange(item.id, option.id)}
                    disabled={submitted}
                    className="form-radio"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          )}

          {item.kind === 'multi' && (
            <div className="space-y-2">
              {item.options_json.map((option: QuizOption) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.id}
                    onChange={(e) => {
                      const current = (answers[item.id] as string[]) || [];
                      if (e.target.checked) {
                        handleAnswerChange(item.id, [...current, option.id]);
                      } else {
                        handleAnswerChange(item.id, current.filter((id: string) => id !== option.id));
                      }
                    }}
                    disabled={submitted}
                    className="form-checkbox"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          )}

          {item.kind === 'numeric' && (
            <input
              type="number"
              step="any"
              onChange={(e) => handleAnswerChange(item.id, parseFloat(e.target.value))}
              disabled={submitted}
              className="w-full max-w-xs p-2 border rounded"
              placeholder="Enter your answer"
            />
          )}

          {submitted && (
            <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant={
                  // Check if answers match for different quiz types
                  (() => {
                    const answerKey = item.answer_key_json as any;
                    const userAnswer = answers[item.id];
                    
                    if (item.kind === 'mcq') {
                      return userAnswer === answerKey?.correct_answer;
                    } else if (item.kind === 'multi') {
                      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                      const correctAnswers = answerKey?.correct_answers || [];
                      return JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort());
                    } else if (item.kind === 'numeric') {
                      const userNum = typeof userAnswer === 'number' ? userAnswer : 0;
                      const correctNum = answerKey?.correct_value || 0;
                      return Math.abs(userNum - correctNum) < 0.001;
                    }
                    return false;
                  })() ? 'default' : 'destructive'
                }>
                  {(() => {
                    const answerKey = item.answer_key_json as any;
                    const userAnswer = answers[item.id];
                    
                    if (item.kind === 'mcq') {
                      return userAnswer === answerKey?.correct_answer ? 'Correct' : 'Incorrect';
                    } else if (item.kind === 'multi') {
                      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                      const correctAnswers = answerKey?.correct_answers || [];
                      return JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort()) ? 'Correct' : 'Incorrect';
                    } else if (item.kind === 'numeric') {
                      const userNum = typeof userAnswer === 'number' ? userAnswer : 0;
                      const correctNum = answerKey?.correct_value || 0;
                      return Math.abs(userNum - correctNum) < 0.001 ? 'Correct' : 'Incorrect';
                    }
                    return 'Incorrect';
                  })()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.points} points
                </span>
              </div>
              {(item.answer_key_json as any)?.explanation && (
                <p className="text-sm text-muted-foreground">
                  <strong>Explanation:</strong> {(item.answer_key_json as any).explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}