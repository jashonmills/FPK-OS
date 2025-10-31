import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { ConversationDetails } from '@/components/messages/ConversationDetails';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversation List - hidden on mobile when chat is open */}
        <div className={`${isMobile && selectedConversationId ? 'hidden' : 'block'} ${isMobile ? 'w-full' : ''}`}>
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Window - hidden on mobile when no conversation selected */}
        <div className={`${isMobile && !selectedConversationId ? 'hidden' : 'flex-1'}`}>
          <ChatWindow 
            conversationId={selectedConversationId}
            onBack={isMobile ? handleBackToList : undefined}
          />
        </div>

        {/* Conversation Details - hidden on mobile and tablet */}
        {selectedConversationId && !isMobile && (
          <div className="hidden lg:block">
            <ConversationDetails conversationId={selectedConversationId} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
