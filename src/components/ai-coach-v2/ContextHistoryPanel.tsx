import React from 'react';
import FileUploadCard from '@/components/ai-coach/FileUploadCard';
import { SavedCoachChats } from '@/components/ai-coach/SavedCoachChats';
import { CommandCenterMessage } from '@/hooks/useCommandCenterChat';

interface ContextHistoryPanelProps {
  onLoadChat?: (chatId: string, messages: CommandCenterMessage[]) => void;
}

export function ContextHistoryPanel({ onLoadChat }: ContextHistoryPanelProps) {
  return (
    <div className="space-y-4">
      <FileUploadCard />
      <SavedCoachChats 
        onLoadChat={onLoadChat as any}
      />
    </div>
  );
}
