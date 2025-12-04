import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Lightbulb } from 'lucide-react';
import { CoachPersona } from '@/hooks/useCoachSelection';

interface CoachSelectionModalProps {
  open: boolean;
  onSelect: (coach: CoachPersona) => void;
}

export function CoachSelectionModal({ open, onSelect }: CoachSelectionModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your AI Coach</DialogTitle>
          <DialogDescription className="text-base">
            Select the coaching style that works best for you. You can switch at any time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <button
            onClick={() => onSelect('BETTY')}
            className="group relative p-6 rounded-lg border-2 border-muted hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600">Betty - The Socratic Guide</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Betty helps you discover concepts through guided questioning. She never gives direct answers but guides you to think deeply and understand the "why" behind concepts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Deep Understanding
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Critical Thinking
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Guided Discovery
                  </span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect('AL')}
            className="group relative p-6 rounded-lg border-2 border-muted hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Al - The Direct Expert</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Al provides clear, factual answers quickly and concisely. He gets straight to the point with precise explanations and direct guidance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Quick Answers
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Clear Explanations
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Efficient Learning
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
