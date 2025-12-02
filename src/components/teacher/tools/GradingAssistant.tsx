import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChatInterface from './AIChatInterface';

interface GradingAssistantProps {
  onBack: () => void;
}

const GradingAssistant: React.FC<GradingAssistantProps> = ({ onBack }) => {
  const [studentWork, setStudentWork] = useState('');
  
  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h3 className="font-semibold text-foreground">Student Submission</h3>
          </div>
        </div>
        <textarea
          value={studentWork}
          onChange={(e) => setStudentWork(e.target.value)}
          placeholder="Paste student text or essay here..."
          className="flex-1 p-6 resize-none focus:outline-none text-foreground font-mono text-sm bg-muted/30 border-none"
        />
      </div>

      <div className="w-[450px] flex flex-col gap-4">
        <AIChatInterface
          toolName="AI Grader"
          systemPrompt="I am your grading assistant. Paste student work and I will analyze it based on standard academic criteria, suggest a grade, and provide constructive feedback. I can also check for grammar issues and clarity."
          icon={PenTool}
          accentColor="from-green-500 to-emerald-600"
        />
      </div>
    </div>
  );
};

export default GradingAssistant;
