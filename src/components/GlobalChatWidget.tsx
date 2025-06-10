
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Brain } from 'lucide-react';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { cn } from '@/lib/utils';
import ChatSheet from '@/components/chat/ChatSheet';

const GlobalChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasUnreadMessages } = useGlobalChat();

  const trigger = (
    <Button
      size="icon"
      className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg relative"
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
    <div className="fixed bottom-6 right-6 z-50">
      <ChatSheet 
        trigger={trigger}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
};

export default GlobalChatWidget;
