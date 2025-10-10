import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/contexts/FamilyContext";
import { UserProfileCard } from "./UserProfileCard";
import { StudentProfileCard } from "./StudentProfileCard";
import { Users } from "lucide-react";

export const ProfileTab = () => {
  const { user } = useAuth();
  const { students, refreshStudents } = useFamily();

  return (
    <div className="space-y-6">
      <UserProfileCard user={user || { id: '', email: '' }} />
      
      {students.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Student Profiles</h3>
          </div>
          {students.map((student) => (
            <StudentProfileCard
              key={student.id}
              student={student}
              onUpdate={refreshStudents}
            />
          ))}
        </div>
      )}
    </div>
  );
};
