import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
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

  if (!selectedFamily) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Family Selector (show only if multiple families) */}
      {families.length > 1 && (
        <Select
          value={selectedFamily.id}
          onValueChange={(id) => {
            const family = families.find(f => f.id === id);
            if (family) setSelectedFamily(family);
          }}
        >
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {families.map((family) => (
              <SelectItem key={family.id} value={family.id}>
                {family.family_name}
              </SelectItem>
            ))}
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
              <SelectValue placeholder="Select student" />
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
