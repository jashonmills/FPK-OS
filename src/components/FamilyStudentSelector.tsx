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
  const { data: familyMembers, error: membersError } = useQuery({
    queryKey: ['family-members-selector', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return [];
      
      console.log('🔍 [Header] Fetching family members for:', selectedFamily.id);
      
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

      console.log('🔍 [Header] Family members result:', { data, error });
      console.log('🔍 [Header] Number of members:', data?.length || 0);

      if (error) {
        console.error('❌ [Header] Error fetching family members:', error);
        throw error;
      }
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  // Log any query errors
  if (membersError) {
    console.error('❌ [Header] Query error:', membersError);
  }

  console.log('📊 [Header] FamilyStudentSelector render:', {
    hasFamilyMembers: !!familyMembers,
    memberCount: familyMembers?.length,
    selectedFamily: selectedFamily?.family_name
  });

  if (!selectedFamily) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
      {/* Family Switcher - Only show if user is in multiple families */}
      {families.length > 1 && (
        <Select
          value={selectedFamily.id}
          onValueChange={(id) => {
            const family = families.find(f => f.id === id);
            if (family) setSelectedFamily(family);
          }}
        >
          <SelectTrigger className="w-32 sm:w-44 md:w-56 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
              <span className="font-medium truncate">{selectedFamily.family_name}</span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {families.map((family) => (
              <SelectItem key={family.id} value={family.id}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{family.family_name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Family Members Viewer */}
      <Select value="view-members">
        <SelectTrigger className="w-24 sm:w-32 md:w-48 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">{familyMembers?.length || 0} members</span>
              <span className="sm:hidden">{familyMembers?.length || 0}</span>
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {familyMembers && familyMembers.length > 0 ? (
            familyMembers.map((member) => {
              const profile = member.profiles as any;
              return (
                <SelectItem key={member.id} value={member.id} disabled>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {profile?.full_name?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile?.full_name || 'No name set'}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })
          ) : (
            <SelectItem value="no-members" disabled>
              {membersError ? 'Error loading members' : 'No members found'}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Student Selector */}
      {students.length > 0 && (
        <Select
          value={selectedStudent?.id || ''}
          onValueChange={(id) => {
            const student = students.find(s => s.id === id);
            if (student) setSelectedStudent(student);
          }}
        >
          <SelectTrigger className="w-36 sm:w-48 md:w-64 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Avatar className="w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                <AvatarImage src={selectedStudent?.photo_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {selectedStudent?.student_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedStudent?.student_name || 'Select student'}</span>
            </div>
          </SelectTrigger>
          <SelectContent className="z-50">
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
