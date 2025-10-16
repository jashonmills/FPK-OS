import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  attendance: 'present' | 'excused' | 'absent';
}

export const TeamMembersStep = ({ data, onUpdate }: WizardStepProps) => {
  const teamMembers: TeamMember[] = data.teamMembers || [];

  const addMember = () => {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      attendance: 'present',
    };
    onUpdate({ ...data, teamMembers: [...teamMembers, newMember] });
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    const updated = teamMembers.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    onUpdate({ ...data, teamMembers: updated });
  };

  const removeMember = (id: string) => {
    onUpdate({ ...data, teamMembers: teamMembers.filter((m) => m.id !== id) });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="The IEP Team includes everyone who contributes to your child's education plan."
        why="Federal law requires specific team members (parent, general ed teacher, special ed teacher, district representative, etc.). Documenting attendance ensures legal compliance and shows who participated in decisions."
        how="Add all team members who attended or should have attended this IEP meeting. Include their role and attendance status."
      />

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Name</Label>
              <Input
                value={member.name}
                onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                placeholder="Team member name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={member.role}
                onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                placeholder="e.g., Special Ed Teacher"
              />
            </div>
            <div>
              <Label>Attendance</Label>
              <Select
                value={member.attendance}
                onValueChange={(value) => updateMember(member.id, 'attendance', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMember(member.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addMember} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>
    </div>
  );
};
