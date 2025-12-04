import React, { useState } from 'react';
import { Download, Check, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

interface QuizGeneratorProps {
  onBack: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onBack }) => {
  const [config, setConfig] = useState({
    topic: '',
    count: 5,
    difficulty: 'Medium',
    type: 'Multiple Choice'
  });
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQuiz = () => {
    if (!config.topic) return;
    setLoading(true);
    setTimeout(() => {
      setQuiz(Array(config.count).fill(null).map((_, i) => ({
        id: i + 1,
        question: `Sample Question ${i + 1} about ${config.topic}?`,
        options: ['Correct Answer', 'Wrong Option A', 'Wrong Option B', 'Wrong Option C'],
        correct: 0
      })));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex gap-6">
      <div className="w-[350px] bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          <h2 className="font-bold text-foreground">Quiz Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Topic or Content</Label>
            <Textarea 
              className="mt-1 h-24 resize-none"
              placeholder="Paste text or enter a topic..."
              value={config.topic}
              onChange={e => setConfig({...config, topic: e.target.value})}
            />
          </div>

          <div>
            <Label className="flex justify-between">
              Question Count <span className="text-muted-foreground">{config.count}</span>
            </Label>
            <Slider 
              className="mt-2"
              value={[config.count]}
              min={1} max={20} step={1}
              onValueChange={([val]) => setConfig({...config, count: val})}
            />
          </div>

          <div>
            <Label>Difficulty</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['Easy', 'Medium', 'Hard'].map(level => (
                <button
                  key={level}
                  onClick={() => setConfig({...config, difficulty: level})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.difficulty === level 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
            onClick={generateQuiz}
            disabled={loading || !config.topic}
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        {quiz ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{config.topic} Quiz</h2>
                <p className="text-muted-foreground">{config.difficulty} Difficulty • {config.count} Questions</p>
              </div>
              <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
            </div>

            <div className="space-y-8">
              {quiz.map((q) => (
                <div key={q.id} className="p-6 bg-muted/50 rounded-xl border border-border">
                  <h3 className="font-semibold text-lg text-foreground mb-4">
                    {q.id}. {q.question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border flex items-center gap-3 ${idx === q.correct ? 'bg-green-500/10 border-green-500/20' : 'bg-card border-border'}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${idx === q.correct ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'}`}>
                          {idx === q.correct && <Check className="h-3 w-3" />}
                        </div>
                        <span className={idx === q.correct ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ListChecks className="h-16 w-16 opacity-20 mb-4" />
            <p>Configure settings to generate a quiz</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
