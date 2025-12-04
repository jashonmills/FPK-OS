import { useNavigate } from 'react-router-dom';

interface MessageContentProps {
  content: string;
}

export const MessageContent = ({ content }: MessageContentProps) => {
  const navigate = useNavigate();

  const renderContent = () => {
    // Parse mentions: @[Name](id) and hashtags: #[Name](id)
    const mentionRegex = /@\[([^\]]+)\]\(([a-f0-9-]{36})\)/g;
    const hashtagRegex = /#\[([^\]]+)\]\(([a-f0-9-]{36})\)/g;
    
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    
    // Combine both regex patterns
    const combinedRegex = /(@\[([^\]]+)\]\(([a-f0-9-]{36})\)|#\[([^\]]+)\]\(([a-f0-9-]{36})\))/g;
    
    while ((match = combinedRegex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      
      if (match[0].startsWith('@')) {
        // It's a mention
        const name = match[2];
        const id = match[3];
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium cursor-default hover:bg-primary/20 transition-colors"
            title={`Mentioned user: ${name}`}
          >
            @{name}
          </span>
        );
      } else {
        // It's a hashtag
        const name = match[4];
        const id = match[5];
        parts.push(
          <span
            key={match.index}
            onClick={() => navigate(`/messages?conversation=${id}`)}
            className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-medium cursor-pointer hover:bg-accent/80 transition-colors"
            title={`Go to channel: ${name}`}
          >
            #{name}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="text-sm whitespace-pre-wrap break-words">
      {renderContent()}
    </div>
  );
};
