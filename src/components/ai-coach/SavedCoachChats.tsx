import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  History, 
  MessageCircle, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Clock,
  Search,
  Archive
} from 'lucide-react';
import { useSavedCoachChats } from '@/hooks/useSavedCoachChats';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface SavedCoachChatsProps {
  onToggleHistory?: () => void;
  onLoadChat?: (chatId: string, messages: any[]) => void;
  onNewChat?: () => void;
  className?: string;
}

export const SavedCoachChats: React.FC<SavedCoachChatsProps> = ({
  onLoadChat,
  className
}) => {
  const {
    savedChats,
    isLoading,
    loadChatMessages,
    deleteSavedChat,
    renameSavedChat
  } = useSavedCoachChats();

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = savedChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (chat: any) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async () => {
    if (editingChatId && editTitle.trim()) {
      await renameSavedChat(editingChatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleLoadChat = async (chatId: string) => {
    if (onLoadChat) {
      const messages = await loadChatMessages(chatId);
      onLoadChat(chatId, messages);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Saved Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Saved Chats
            {savedChats.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {savedChats.length}
              </Badge>
            )}
          </CardTitle>
        </div>
        
        {savedChats.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {filteredChats.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {savedChats.length === 0 
                ? "No saved chats yet" 
                : "No chats match your search"
              }
            </p>
            <p className="text-xs mt-1">
              {savedChats.length === 0 
                ? "Save your conversations to access them later"
                : "Try a different search term"
              }
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    {editingChatId === chat.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-7 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="h-7 px-2"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-7 px-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleLoadChat(chat.id)}
                          className="text-left w-full hover:text-primary transition-colors"
                        >
                          <h4 className="font-medium text-sm truncate">
                            {chat.title}
                          </h4>
                        </button>
                        
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.preview}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(chat.updated_at)}
                          <span>•</span>
                          <span>{chat.message_count} messages</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingChatId !== chat.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => handleLoadChat(chat.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Load Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStartEdit(chat)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteSavedChat(chat.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};