import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, User } from 'lucide-react';

export const FamilyStudentSelector = () => {
  const {
    selectedFamily,
    selectedStudent,
    families,
    students,
    setSelectedFamily,
    setSelectedStudent,
  } = useFamily();

  // Fetch family members for the dropdown
  const { data: familyMembers } = useQuery({
    queryKey: ['family-members-selector', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return [];
      
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          id,
          user_id,
          role,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('family_id', selectedFamily.id)
        .order('role', { ascending: true }); // Owner first

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  if (!selectedFamily) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Family Members Selector - show owner and members */}
      {familyMembers && familyMembers.length > 0 && (
        <Select value="current" disabled>
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{selectedFamily.family_name}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {familyMembers.map((member) => {
              const profile = member.profiles as any;
              return (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {profile?.full_name?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <span>{profile?.full_name || 'No name set'}</span>
                    {member.role === 'owner' && (
                      <span className="text-xs text-muted-foreground ml-1">(Owner)</span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}

      {/* Student Selector */}
      {students.length > 0 && (
        <Select
          value={selectedStudent?.id || ''}
          onValueChange={(id) => {
            const student = students.find(s => s.id === id);
            if (student) setSelectedStudent(student);
          }}
        >
          <SelectTrigger className="w-64">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={selectedStudent?.photo_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {selectedStudent?.student_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{selectedStudent?.student_name || 'Select student'}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={student.photo_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {student.student_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {student.student_name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
