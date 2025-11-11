import { useParams, useNavigate } from "react-router-dom";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { NewConversationDialog } from "@/components/messaging/NewConversationDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background/80">
      {/* Header */}
      <header className="border-b p-4 flex items-center gap-4 bg-background/60 shadow-xl shadow-primary/20 backdrop-blur-2xl border-border/40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => conversationId ? navigate('/messages') : navigate('/community')}
          title={conversationId ? "Back to conversations" : "Back to community"}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">Messages</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings/captions')}
          title="Caption Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden bg-muted/20">
        {/* Conversation List - Desktop */}
        <aside className="hidden md:flex w-80 border-r flex-col bg-background/30 backdrop-blur-2xl shadow-2xl shadow-black/10 border-border/30">
          <div className="p-4 border-b">
            <NewConversationDialog />
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationList activeConversationId={conversationId} />
          </div>
        </aside>

        {/* Conversation List - Mobile */}
        {!conversationId && (
          <div className="flex-1 md:hidden flex flex-col">
            <div className="p-4 border-b">
              <NewConversationDialog />
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationList activeConversationId={conversationId} />
            </div>
          </div>
        )}

        {/* Chat Window - Mobile (when conversation selected) */}
        {conversationId && (
          <div className="flex-1 md:hidden">
            <ChatWindow conversationId={conversationId} />
          </div>
        )}

        {/* Chat Window - Desktop */}
        <main className="hidden md:flex flex-1 flex-col bg-background/80">
          {conversationId ? (
            <ChatWindow conversationId={conversationId} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No conversation selected</p>
                <p className="text-sm">Select a conversation or start a new one</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;
