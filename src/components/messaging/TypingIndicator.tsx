import React from "react";

interface TypingIndicatorProps {
  typingUsers: Array<{ display_name: string }>;
}

export const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;

  const typingText = typingUsers.length === 1
    ? `${typingUsers[0].display_name} is typing`
    : typingUsers.length === 2
    ? `${typingUsers[0].display_name} and ${typingUsers[1].display_name} are typing`
    : `${typingUsers.length} people are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
      <span>{typingText}...</span>
    </div>
  );
};
