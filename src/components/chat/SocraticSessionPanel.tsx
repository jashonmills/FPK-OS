import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Target, BookOpen, X } from 'lucide-react';

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
    <Card className="p-6 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Start Structured Learning Session</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Topic
          </label>
          <Input
            placeholder="e.g., Fractions, Photosynthesis, World War II"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Learning Objective</label>
          <Textarea
            placeholder="What specific skill or understanding do you want to develop? e.g., 'Understand how to compare fractions with unlike denominators'"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            className="bg-background resize-none"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">How it works:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• I'll ask guided questions to help you discover the answer</li>
            <li>• Each response is scored to track your progress (0-3 scale)</li>
            <li>• You'll receive hints when needed, not direct answers</li>
            <li>• We progress as you demonstrate understanding</li>
          </ul>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={!topic.trim() || !objective.trim()}
          className="w-full"
        >
          Start Learning Session
        </Button>
      </div>
    </Card>
  );
}
