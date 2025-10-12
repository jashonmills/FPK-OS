
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Brain } from 'lucide-react';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { cn } from '@/lib/utils';
import ChatSheet from '@/components/chat/ChatSheet';

interface GlobalChatWidgetProps {
  onOpenChange?: (isOpen: boolean) => void;
}

const GlobalChatWidget = ({ onOpenChange }: GlobalChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasUnreadMessages } = useGlobalChat();

  // Notify parent when open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const trigger = (
    <Button
      size="icon"
      className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg relative pointer-events-auto"
    >
      <MessageCircle className="h-6 w-6 text-white" />
      {hasUnreadMessages && (
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      )}
    </Button>
  );

  return (
    <div className="fixed right-4 sm:right-6 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] sm:bottom-6 z-50 pointer-events-none">
      <ChatSheet 
        trigger={trigger}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isWidget={true}
      />
    </div>
  );
};

export default GlobalChatWidget;
