import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const MentionTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  minHeight = "min-h-[80px]"
}: MentionTextareaProps) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');
    if (data) setUsers(data);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);

    // Check if @ was typed
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      
      // Only show mentions if there's no space after @
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt.toLowerCase());
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
        setSelectedIndex(0);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: Profile) => {
    const beforeMention = value.slice(0, mentionPosition);
    const afterMention = value.slice(mentionPosition + mentionSearch.length + 1);
    const mention = `@[${user.full_name}](${user.id})`;
    
    const newValue = beforeMention + mention + ' ' + afterMention;
    onChange(newValue);
    setShowMentions(false);
    setMentionSearch('');
    
    // Focus back on textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(mentionSearch) ||
    user.email.toLowerCase().includes(mentionSearch)
  ).slice(0, 5);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMentions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
    } else if (e.key === 'Enter' && filteredUsers.length > 0) {
      e.preventDefault();
      insertMention(filteredUsers[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowMentions(false);
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
      
      {showMentions && filteredUsers.length > 0 && (
        <div className="absolute z-50 w-64 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
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
        </div>
      )}
    </div>
  );
};
