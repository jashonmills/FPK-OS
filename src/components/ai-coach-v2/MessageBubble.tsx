import React from 'react';
import { cn } from '@/lib/utils';
import { CommandCenterMessage } from '@/hooks/useCommandCenterChat';
import { MessageCircle, Lightbulb, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: CommandCenterMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.persona === 'USER';
  const isBetty = message.persona === 'BETTY';
  const isAl = message.persona === 'AL';

  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4" />;
    if (isBetty) return <MessageCircle className="h-4 w-4" />;
    if (isAl) return <Lightbulb className="h-4 w-4" />;
    return null;
  };

  const getStyles = () => {
    if (isUser) {
      return {
        container: 'justify-end',
        bubble: 'bg-primary text-primary-foreground',
        icon: 'bg-primary text-primary-foreground'
      };
    }
    if (isBetty) {
      return {
        container: 'justify-start',
        bubble: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
        icon: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
      };
    }
    if (isAl) {
      return {
        container: 'justify-start',
        bubble: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white',
        icon: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
      };
    }
    return {
      container: 'justify-start',
      bubble: 'bg-muted',
      icon: 'bg-muted'
    };
  };

  const styles = getStyles();

  return (
    <div className={cn('flex gap-3 mb-4', styles.container)}>
      {!isUser && (
        <div className={cn('flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center', styles.icon)}>
          {getIcon()}
        </div>
      )}
      
      <div className={cn('max-w-[70%] rounded-2xl px-4 py-3', styles.bubble)}>
        {!isUser && (
          <div className="font-semibold text-sm mb-1">
            {isBetty ? 'Betty' : isAl ? 'Al' : 'System'}
          </div>
        )}
        <div className={cn('text-sm prose prose-sm max-w-none', isUser ? 'prose-invert' : '')}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>

      {isUser && (
        <div className={cn('flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center', styles.icon)}>
          {getIcon()}
        </div>
      )}
    </div>
  );
}
