import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Conversation {
  id: string;
  name: string;
  type: string;
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const MentionTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  minHeight = "min-h-[80px]",
  onKeyDown: externalKeyDown
}: MentionTextareaProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'mention' | 'hashtag'>('mention');
  const [search, setSearch] = useState('');
  const [triggerPosition, setTriggerPosition] = useState(0);
  const [users, setUsers] = useState<Profile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');
    if (data) setUsers(data);
  };

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('id, name, type')
      .eq('type', 'channel')
      .order('name');
    if (data) setConversations(data);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);

    const textBeforeCursor = newValue.slice(0, cursorPos);
    
    // Check for @ mentions
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');
    
    // Determine which trigger is more recent
    const atIsRecent = lastAtIndex > lastHashIndex;
    const hashIsRecent = lastHashIndex > lastAtIndex;
    
    if (atIsRecent && lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('#')) {
        setSearch(textAfterAt.toLowerCase());
        setTriggerPosition(lastAtIndex);
        setSuggestionType('mention');
        setShowSuggestions(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    if (hashIsRecent && lastHashIndex !== -1) {
      const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1);
      if (!textAfterHash.includes(' ') && !textAfterHash.includes('@')) {
        setSearch(textAfterHash.toLowerCase());
        setTriggerPosition(lastHashIndex);
        setSuggestionType('hashtag');
        setShowSuggestions(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    setShowSuggestions(false);
  };

  const insertMention = (user: Profile) => {
    const before = value.slice(0, triggerPosition);
    const after = value.slice(triggerPosition + search.length + 1);
    const mention = `@[${user.full_name}](${user.id})`;
    
    const newValue = before + mention + ' ' + after;
    onChange(newValue);
    setShowSuggestions(false);
    setSearch('');
    
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const insertHashtag = (conversation: Conversation) => {
    const before = value.slice(0, triggerPosition);
    const after = value.slice(triggerPosition + search.length + 1);
    const hashtag = `#[${conversation.name}](${conversation.id})`;
    
    const newValue = before + hashtag + ' ' + after;
    onChange(newValue);
    setShowSuggestions(false);
    setSearch('');
    
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  ).slice(0, 5);

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(search)
  ).slice(0, 5);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      externalKeyDown?.(e);
      return;
    }

    const items = suggestionType === 'mention' ? filteredUsers : filteredConversations;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter' && items.length > 0) {
      e.preventDefault();
      if (suggestionType === 'mention') {
        insertMention(filteredUsers[selectedIndex]);
      } else {
        insertHashtag(filteredConversations[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else {
      externalKeyDown?.(e);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(minHeight, className)}
      />
      
      {showSuggestions && (
        <div className="absolute z-50 w-64 bottom-full mb-2 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestionType === 'mention' && filteredUsers.length > 0 && (
            <>
              {filteredUsers.map((user, index) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => insertMention(user)}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-accent transition-colors",
                    index === selectedIndex && "bg-accent"
                  )}
                >
                  <div className="font-medium text-sm">{user.full_name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </button>
              ))}
            </>
          )}
          {suggestionType === 'hashtag' && filteredConversations.length > 0 && (
            <>
              {filteredConversations.map((conv, index) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => insertHashtag(conv)}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-accent transition-colors",
                    index === selectedIndex && "bg-accent"
                  )}
                >
                  <div className="font-medium text-sm">#{conv.name}</div>
                  <div className="text-xs text-muted-foreground">Channel</div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
