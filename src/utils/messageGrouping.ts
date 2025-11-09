import { OrgChatMessage } from '@/hooks/useOrgAIChat';

export interface MessageGroup {
  groupId: string;
  messages: OrgChatMessage[];
}

/**
 * Groups consecutive messages that share the same groupId
 */
export function groupConsecutiveMessages(messages: OrgChatMessage[]): (OrgChatMessage | MessageGroup)[] {
  const result: (OrgChatMessage | MessageGroup)[] = [];
  let currentGroup: MessageGroup | null = null;

  for (const message of messages) {
    if (message.groupId) {
      // Check if this continues the current group
      if (currentGroup && currentGroup.groupId === message.groupId) {
        currentGroup.messages.push(message);
      } else {
        // Start a new group
        if (currentGroup) result.push(currentGroup);
        currentGroup = {
          groupId: message.groupId,
          messages: [message]
        };
      }
    } else {
      // Not part of a group - flush current group and add standalone message
      if (currentGroup) {
        result.push(currentGroup);
        currentGroup = null;
      }
      result.push(message);
    }
  }

  // Flush any remaining group
  if (currentGroup) {
    result.push(currentGroup);
  }

  return result;
}

/**
 * Gets all audio URLs from a message group in display order
 */
export function getGroupAudioPlaylist(group: MessageGroup): string[] {
  return group.messages
    .map(msg => msg.audioUrl)
    .filter((url): url is string => !!url);
}
