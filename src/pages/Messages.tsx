import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { ConversationDetails } from '@/components/messages/ConversationDetails';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <ChatWindow conversationId={selectedConversationId} />
        {selectedConversationId && (
          <ConversationDetails conversationId={selectedConversationId} />
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
