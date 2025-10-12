import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Target, BookOpen, X } from 'lucide-react';
import VoiceInputButton from '@/components/notes/VoiceInputButton';

interface SocraticSessionPanelProps {
  onStartSession: (topic: string, objective: string) => void;
  onCancel: () => void;
}

export function SocraticSessionPanel({ onStartSession, onCancel }: SocraticSessionPanelProps) {
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');

  const handleStart = () => {
    if (topic.trim() && objective.trim()) {
      onStartSession(topic.trim(), objective.trim());
    }
  };

  return (
    <Card className="p-3 sm:p-6 space-y-3 sm:space-y-4 bg-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold truncate">Start Structured Learning Session</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Topic
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Fractions, Photosynthesis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-background text-sm flex-1"
              style={{ fontSize: '16px' }}
            />
            <VoiceInputButton
              onTranscription={(text) => setTopic(text)}
              placeholder="topic"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium">Learning Objective</label>
          <div className="space-y-2">
            <Textarea
              placeholder="What do you want to learn? e.g., 'Compare fractions with unlike denominators'"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              className="bg-background resize-none text-sm"
              style={{ fontSize: '16px' }}
            />
            <VoiceInputButton
              onTranscription={(text) => setObjective(text)}
              placeholder="learning objective"
            />
          </div>
        </div>

        <div className="bg-muted/50 p-2.5 sm:p-4 rounded-lg space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium">How it works:</p>
          <ul className="text-xs sm:text-sm space-y-0.5 sm:space-y-1 text-muted-foreground">
            <li>• I'll ask guided questions to help you discover the answer</li>
            <li>• Each response is scored to track your progress (0-3 scale)</li>
            <li>• You'll receive hints when needed, not direct answers</li>
            <li>• We progress as you demonstrate understanding</li>
          </ul>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={!topic.trim() || !objective.trim()}
          className="w-full min-h-[44px]"
        >
          Start Learning Session
        </Button>
      </div>
    </Card>
  );
}
