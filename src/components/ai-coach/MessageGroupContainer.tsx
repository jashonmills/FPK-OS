import React from 'react';
import { MessageBubble } from './MessageBubble';
import { CollaborativeResponsePlayer } from './CollaborativeResponsePlayer';
import { MessageGroup } from '@/utils/messageGrouping';
import { CommandCenterMessage } from '@/hooks/useCommandCenterChat';
import { getGroupAudioPlaylist } from '@/utils/messageGrouping';

interface MessageGroupContainerProps {
  group: MessageGroup;
}

export function MessageGroupContainer({ group }: MessageGroupContainerProps) {
  const audioPlaylist = getGroupAudioPlaylist(group);

  return (
    <div 
      className="relative mb-4 p-3 rounded-2xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/40 dark:border-purple-700/40"
      data-group-id={group.groupId}
    >
      {/* Visual indicator that this is a collaborative response */}
      <div className="absolute -top-2 left-4 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full shadow-md">
        Collaborative Response
      </div>
      
      {/* Unified audio player for the entire group */}
      <div className="mt-2">
        <CollaborativeResponsePlayer 
          audioPlaylist={audioPlaylist}
          groupId={group.groupId}
        />
      </div>
      
      {/* Render each message in the group */}
      <div className="space-y-2 mt-2">
        {group.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message as CommandCenterMessage}
            hideAudioControls={true}
            isPartOfGroup={true}
          />
        ))}
      </div>
    </div>
  );
}
