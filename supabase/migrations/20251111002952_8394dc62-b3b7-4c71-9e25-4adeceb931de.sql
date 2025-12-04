-- Add reply_to_message_id column to messages table
ALTER TABLE public.messages
ADD COLUMN reply_to_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- Create index for better performance when fetching replies
CREATE INDEX idx_messages_reply_to ON public.messages(reply_to_message_id);

-- Add comment for documentation
COMMENT ON COLUMN public.messages.reply_to_message_id IS 'References the message this message is replying to, enabling threaded conversations';