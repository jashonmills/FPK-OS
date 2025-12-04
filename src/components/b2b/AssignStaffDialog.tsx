import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StaffMember {
  id: string;
  user_id: string;
  role: string;
  caseload_student_ids: string[];
  profiles: {
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface AssignStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  selectedStudentIds: string[];
  onSuccess: () => void;
}

export const AssignStaffDialog = ({
  open,
  onOpenChange,
  organizationId,
  selectedStudentIds,
  onSuccess,
}: AssignStaffDialogProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStaffMembers();
    }
  }, [open, organizationId]);

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          caseload_student_ids,
          profiles:user_id (
            full_name,
            display_name,
            avatar_url
          )
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .in('role', ['teacher', 'therapist', 'specialist', 'support_staff'])
        .order('role');

      if (error) throw error;
      setStaffMembers(data as unknown as StaffMember[]);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast.error('Failed to load staff members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleAssign = async () => {
    if (selectedStaffIds.length === 0) {
      toast.error('Please select at least one staff member');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update each selected staff member's caseload
      for (const staffId of selectedStaffIds) {
        const staffMember = staffMembers.find(s => s.id === staffId);
        if (!staffMember) continue;

        const updatedCaseload = Array.from(
          new Set([...staffMember.caseload_student_ids, ...selectedStudentIds])
        );

        const { error } = await supabase
          .from('organization_members')
          .update({ caseload_student_ids: updatedCaseload })
          .eq('id', staffId);

        if (error) throw error;
      }

      toast.success(`Assigned ${selectedStudentIds.length} student(s) to ${selectedStaffIds.length} staff member(s)`);
      onSuccess();
      onOpenChange(false);
      setSelectedStaffIds([]);
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error('Failed to assign students to staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStaffDisplayName = (staff: StaffMember) => {
    return staff.profiles?.display_name || staff.profiles?.full_name || 'Unnamed Staff';
  };

  const getRoleLabel = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign to Staff Members</DialogTitle>
          <DialogDescription>
            Select staff members to assign the {selectedStudentIds.length} selected student(s) to their caseload
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No staff members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={staff.id}
                  checked={selectedStaffIds.includes(staff.id)}
                  onCheckedChange={() => handleToggleStaff(staff.id)}
                />
                <Label htmlFor={staff.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={staff.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {getStaffDisplayName(staff).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{getStaffDisplayName(staff)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getRoleLabel(staff.role)} • {staff.caseload_student_ids.length} students
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isSubmitting || selectedStaffIds.length === 0}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign Students
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
