import React, { useState, useMemo } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { FolderManager } from './FolderManager';
import { useAICoachConversations } from '@/hooks/useAICoachConversations';

interface SavedChatsSubTabProps {
  orgId?: string;
  onLoadChat: (chatId: string) => void;
}

export function SavedChatsSubTab({ orgId, onLoadChat }: SavedChatsSubTabProps) {
  const { conversations, isLoadingConversations, deleteConversation, assignToFolder } = useAICoachConversations(orgId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [draggedChatId, setDraggedChatId] = useState<string | null>(null);

  const filteredChats = useMemo(() => {
    if (selectedFolderId === null) return conversations;
    return conversations.filter((c: any) => c.folder_id === selectedFolderId);
  }, [conversations, selectedFolderId]);

  const handleDragStart = (chatId: string) => {
    setDraggedChatId(chatId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    
    if (draggedChatId) {
      await assignToFolder(draggedChatId, targetFolderId);
      setDraggedChatId(null);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Left: Folder Navigation */}
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            Folders
          </h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
          >
            <FolderManager
              folderType="saved_chat"
              orgId={orgId}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          </div>
        </div>
      </div>

      {/* Right: Chats List */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              {selectedFolderId === null ? 'All Saved Chats' : 'Folder Contents'}
            </h3>
          </div>

          <div className="space-y-2">
            {isLoadingConversations ? (
              <p className="text-sm text-gray-500 italic animate-pulse">Loading chats...</p>
            ) : filteredChats.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                {selectedFolderId === null ? 'No saved chats yet' : 'This folder is empty'}
              </p>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  draggable
                  onDragStart={() => handleDragStart(chat.id)}
                  className="p-3 bg-blue-50/80 rounded border border-blue-200/60 hover:bg-blue-100/80 transition group relative cursor-move"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => onLoadChat(chat.id)}
                    >
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{chat.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{chat.last_message_preview || 'No preview'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {chat.message_count} messages • {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded flex-shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
