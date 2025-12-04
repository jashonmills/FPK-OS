import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentionedUsersChange: (userIds: string[]) => void;
  placeholder?: string;
  familyId: string;
  compact?: boolean;
}

interface FamilyMember {
  user_id: string;
  profiles: {
    display_name: string | null;
  } | null;
}

export function MentionInput({
  value,
  onChange,
  onMentionedUsersChange,
  placeholder = "Type @ to mention someone...",
  familyId,
  compact = false,
}: MentionInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch family members for mentions
  const { data: familyMembers = [] } = useQuery({
    queryKey: ['family-members', familyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          user_id,
          profiles:user_id (
            display_name
          )
        `)
        .eq('family_id', familyId);

      if (error) throw error;
      return data as FamilyMember[];
    },
    enabled: !!familyId,
  });

  // Detect @ mentions
  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    const cursorPos = textareaRef.current?.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Check if we're typing after an @
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionSearch(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionSearch('');
    }

    // Extract all @mentions and update mentioned users
    const allMentions = newValue.match(/@(\w+)/g) || [];
    const mentionedUserIds = allMentions
      .map(mention => {
        const displayName = mention.substring(1);
        const member = familyMembers.find(
          m => m.profiles?.display_name?.toLowerCase() === displayName.toLowerCase()
        );
        return member?.user_id;
      })
      .filter((id): id is string => id !== undefined);

    onMentionedUsersChange(mentionedUserIds);
  };

  const insertMention = (displayName: string, userId: string) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Replace the @search with @displayName
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const mentionStart = textBeforeCursor.lastIndexOf('@');
      const newText = 
        textBeforeCursor.substring(0, mentionStart) + 
        `@${displayName} ` + 
        textAfterCursor;
      
      onChange(newText);
      setShowMentions(false);
      setMentionSearch('');

      // Update mentioned users
      const allMentions = newText.match(/@(\w+)/g) || [];
      const mentionedUserIds = allMentions
        .map(mention => {
          const name = mention.substring(1);
          const member = familyMembers.find(
            m => m.profiles?.display_name?.toLowerCase() === name.toLowerCase()
          );
          return member?.user_id;
        })
        .filter((id): id is string => id !== undefined);

      onMentionedUsersChange(mentionedUserIds);

      // Focus back on textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const filteredMembers = familyMembers.filter(member => {
    const displayName = member.profiles?.display_name || '';
    return displayName.toLowerCase().includes(mentionSearch.toLowerCase());
  });

  return (
    <Popover open={showMentions} onOpenChange={setShowMentions}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            rows={compact ? 2 : 3}
            className={compact ? 'text-xs' : ''}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-0" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No team members found.</CommandEmpty>
            <CommandGroup heading="Mention Team Member">
              {filteredMembers.map((member) => (
                <CommandItem
                  key={member.user_id}
                  onSelect={() => {
                    const displayName = member.profiles?.display_name || 'Unknown';
                    insertMention(displayName, member.user_id);
                  }}
                >
                  @{member.profiles?.display_name || 'Unknown User'}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
