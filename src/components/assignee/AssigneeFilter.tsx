import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/avatar-with-initials';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface AssigneeFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const AssigneeFilter = ({ value, onChange }: AssigneeFilterProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .order('full_name');
    
    if (data) {
      setUsers(data);
    }
  };

  const selectedUser = users.find(u => u.id === value);
  const filterLabel = value === 'unassigned' 
    ? 'Unassigned' 
    : value === user?.id 
    ? 'My Tasks'
    : selectedUser?.full_name || 'All Tasks';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>{filterLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-50 bg-popover">
          <DropdownMenuItem onClick={() => onChange(null)} className="cursor-pointer">
            All Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange(user?.id || null)} className="cursor-pointer">
            My Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('unassigned')} className="cursor-pointer">
            Unassigned
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {users.map(u => (
            <DropdownMenuItem 
              key={u.id} 
              onClick={() => onChange(u.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserAvatar 
                  name={u.full_name} 
                  avatarUrl={u.avatar_url}
                  size={20}
                />
                <span>{u.full_name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {value && (
        <Badge variant="secondary" className="gap-1">
          {filterLabel}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onChange(null)}
          />
        </Badge>
      )}
    </div>
  );
};
