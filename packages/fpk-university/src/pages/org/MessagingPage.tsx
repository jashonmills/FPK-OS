import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { NewConversationDialog } from '@/components/messaging/NewConversationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagingPage() {
  const { currentOrg } = useOrgContext();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const { 
    conversations, 
    isLoading, 
    createConversation, 
    markAsRead,
    refetch 
  } = useConversations(currentOrg?.organization_id);

  const selectedConversation = conversations.find(c => c.id === conversationId);

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    navigate(`/org/${currentOrg?.organization_id}/messages/${id}`);
    markAsRead(id);
  };

  // Handle back button on mobile
  const handleBack = () => {
    navigate(`/org/${currentOrg?.organization_id}/messages`);
  };

  // Handle new conversation created
  const handleConversationCreated = (conversation: any) => {
    setShowNewDialog(false);
    if (conversation?.id) {
      navigate(`/org/${currentOrg?.organization_id}/messages/${conversation.id}`);
      markAsRead(conversation.id);
    }
    refetch();
  };

  // Show message thread on mobile when conversation selected
  const showThread = conversationId && (isMobile || selectedConversation);
  const showList = !isMobile || !conversationId;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-background rounded-lg shadow-lg border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {isMobile && conversationId && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">
            {isMobile && selectedConversation 
              ? selectedConversation.name || 'Direct Message'
              : 'Messages'
            }
          </h1>
        </div>
        {(!isMobile || !conversationId) && (
          <Button onClick={() => setShowNewDialog(true)} size="sm">
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        {showList && (
          <div className={cn(
            "border-r border-border/50 overflow-hidden flex flex-col bg-muted/30",
            isMobile ? "w-full" : "w-72 flex-shrink-0"
          )}>
            <ConversationList
              conversations={conversations}
              isLoading={isLoading}
              selectedId={conversationId}
              onSelect={handleSelectConversation}
              currentUserId={currentOrg?.organization_id}
            />
          </div>
        )}

        {/* Message Thread */}
        {!isMobile && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <MessageThread
                conversation={selectedConversation}
                onMarkAsRead={() => markAsRead(selectedConversation.id)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">or start a new chat</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Thread View */}
        {isMobile && showThread && selectedConversation && (
          <div className="absolute inset-0 bg-background z-10 flex flex-col">
            <MessageThread
              conversation={selectedConversation}
              onMarkAsRead={() => markAsRead(selectedConversation.id)}
            />
          </div>
        )}
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        orgId={currentOrg?.organization_id}
        onConversationCreated={handleConversationCreated}
        createConversation={createConversation}
      />
    </div>
  );
}
