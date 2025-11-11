import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, CheckCheck } from "lucide-react";

interface ReadReceiptsProps {
  messageId: string;
  senderId: string;
  conversationId: string;
  currentUserPersonaId: string | null;
}

export const ReadReceipts = ({ messageId, senderId, conversationId, currentUserPersonaId }: ReadReceiptsProps) => {
  const [readByCount, setReadByCount] = useState(0);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    // Only show read receipts for own messages
    if (senderId !== currentUserPersonaId) return;

    const fetchReadReceipts = async () => {
      // Get total participants minus sender
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

      if (!participants) return;

      // Get read receipts for this message
      const { data: receipts } = await supabase
        .from('message_read_receipts')
        .select('user_id')
        .eq('message_id', messageId);

      if (!receipts) return;

      // Count how many others have read (excluding sender)
      const otherParticipantsCount = participants.length - 1;
      const readCount = receipts.length;
      
      setReadByCount(readCount);
      setIsRead(readCount > 0 && readCount >= otherParticipantsCount);
    };

    fetchReadReceipts();

    // Subscribe to realtime updates for read receipts
    const channel = supabase
      .channel(`read_receipts:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_read_receipts',
          filter: `message_id=eq.${messageId}`,
        },
        () => {
          fetchReadReceipts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, senderId, conversationId, currentUserPersonaId]);

  // Don't show receipts for messages from others
  if (senderId !== currentUserPersonaId) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      {isRead ? (
        <CheckCheck className="w-3 h-3 text-primary" />
      ) : readByCount > 0 ? (
        <CheckCheck className="w-3 h-3 text-muted-foreground" />
      ) : (
        <Check className="w-3 h-3 text-muted-foreground" />
      )}
    </div>
  );
};
