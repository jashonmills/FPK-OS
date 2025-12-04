import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { UserX } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface AssigneeSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export const AssigneeSelect = ({ value, onChange, disabled }: AssigneeSelectProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .order('full_name');
    
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const selectedUser = users.find(u => u.id === value);

  return (
    <Select 
      value={value || 'unassigned'} 
      onValueChange={(val) => onChange(val === 'unassigned' ? null : val)}
      disabled={disabled || loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {value && selectedUser ? (
            <div className="flex items-center gap-2">
              <UserAvatar 
                fullName={selectedUser.full_name} 
                avatarUrl={selectedUser.avatar_url}
                size={20}
              />
              <span>{selectedUser.full_name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserX className="h-4 w-4" />
              <span>Unassigned</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-50 bg-popover">
        <SelectItem value="unassigned">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            <span>Unassigned</span>
          </div>
        </SelectItem>
        {users.map(user => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <UserAvatar 
                fullName={user.full_name} 
                avatarUrl={user.avatar_url}
                size={20}
              />
              <div className="flex flex-col">
                <span className="font-medium">{user.full_name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
