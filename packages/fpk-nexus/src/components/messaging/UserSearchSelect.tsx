import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Persona {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

interface UserSearchSelectProps {
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
}

export const UserSearchSelect = ({ selectedUserIds, onChange }: UserSearchSelectProps) => {
  const [search, setSearch] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPersonas = async () => {
      let query = supabase
        .from('personas')
        .select('id, user_id, display_name, avatar_url')
        .neq('user_id', user?.id || '');

      if (search.trim()) {
        query = query.ilike('display_name', `%${search}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching personas:', error);
        return;
      }

      setPersonas(data || []);
    };

    fetchPersonas();
  }, [search, user]);

  const toggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-9"
        />
      </div>
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-2 space-y-1">
          {personas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {search ? 'No users found' : 'Start typing to search'}
            </p>
          ) : (
            personas.map((persona) => (
              <label
                key={persona.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  checked={selectedUserIds.includes(persona.user_id)}
                  onCheckedChange={() => toggleUser(persona.user_id)}
                />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={persona.avatar_url || undefined} />
                  <AvatarFallback>
                    {persona.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{persona.display_name}</span>
              </label>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
