import React from 'react';
import { HelpCircle } from 'lucide-react';

interface PageHelpTriggerProps {
  onOpen: () => void;
  label?: string;
}

export function PageHelpTrigger({ onOpen, label = "How this page works" }: PageHelpTriggerProps) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-1 text-sm text-white hover:text-white/80 transition-colors underline-offset-4 hover:underline"
      aria-label={`Watch video guide about ${label.toLowerCase()}`}
    >
      <HelpCircle className="h-4 w-4" />
      {label}
    </button>
  );
}