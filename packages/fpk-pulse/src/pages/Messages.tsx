import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { ConversationDetails } from '@/components/messages/ConversationDetails';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex overflow-x-hidden w-full">
        {/* Conversation List - 280px fixed width on desktop */}
        <div className={`
          ${isMobile && selectedConversationId ? 'hidden' : 'block'} 
          ${isMobile ? 'w-full' : 'w-[280px] flex-shrink-0'}
          border-r border-border/50 bg-muted/30 overflow-x-hidden
        `}>
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Window - flexible center panel */}
        <div className={`
          ${isMobile && !selectedConversationId ? 'hidden' : 'flex-1'} 
          flex flex-col min-w-0 bg-background overflow-x-hidden
        `}>
          <ChatWindow 
            conversationId={selectedConversationId}
            onBack={isMobile ? handleBackToList : undefined}
            onToggleDetails={() => setDetailsCollapsed(!detailsCollapsed)}
            detailsCollapsed={detailsCollapsed}
          />
        </div>

        {/* Conversation Details - 320px fixed width, collapsible on desktop */}
        {selectedConversationId && !isMobile && !detailsCollapsed && (
          <div className="w-[320px] flex-shrink-0 border-l border-border/50 bg-muted/30 overflow-x-hidden">
            <ConversationDetails 
              conversationId={selectedConversationId}
              onClose={() => setDetailsCollapsed(true)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
