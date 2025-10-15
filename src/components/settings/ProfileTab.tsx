import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/contexts/FamilyContext";
import { UserProfileCard } from "./UserProfileCard";
import { StudentProfileCard } from "./StudentProfileCard";
import { AddStudentDialog } from "./AddStudentDialog";
import { TourPreferencesCard } from "./TourPreferencesCard";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProfileTab = () => {
  const { user } = useAuth();
  const { students, refreshStudents, familyMembership, selectedFamily } = useFamily();
  const isOwner = familyMembership?.role === 'owner';

  const { data: familyData } = useQuery({
    queryKey: ['family-limits', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase
        .from('families')
        .select('max_students')
        .eq('id', selectedFamily.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  const maxStudents = familyData?.max_students || 1;

  return (
    <div className="space-y-6">
      <UserProfileCard user={user || { id: '', email: '' }} />
      
      <TourPreferencesCard />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Student Profiles</h3>
          </div>
          {isOwner && (
            <AddStudentDialog
              onStudentAdded={refreshStudents}
              currentStudentCount={students.length}
              maxStudents={maxStudents}
            />
          )}
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No students added yet</p>
            {isOwner && <p className="text-sm mt-1">Click "Add Student" to get started</p>}
          </div>
        ) : (
          students.map((student) => (
            <StudentProfileCard
              key={student.id}
              student={student}
              onUpdate={refreshStudents}
              canEdit={isOwner}
            />
          ))
        )}
      </div>
    </div>
  );
};
