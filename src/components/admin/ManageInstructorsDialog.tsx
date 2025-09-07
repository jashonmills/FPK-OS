import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  UserMinus, 
  MoreHorizontal,
  Plus,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Organization, OrgMember } from '@/types/organization';

// Explicit interface to avoid deep type instantiation
interface InstructorRow {
  id: string;
  org_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  joined_at: string | null;
  access_revoked_at: string | null;
  access_revoked_reason: string | null;
  invitation_link: string | null;
  profiles: {
    full_name: string | null;
    display_name: string | null;
  } | null;
}

interface ManageInstructorsDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageInstructorsDialog({ 
  organization, 
  open, 
  onOpenChange 
}: ManageInstructorsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch instructors for this organization
  const { data: instructors, isLoading } = useQuery({
    queryKey: ['org-instructors', organization.id],
    queryFn: async (): Promise<InstructorRow[]> => {
      const { data, error } = await supabase
        .from('org_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            display_name
          )
        `)
        .eq('org_id', organization.id)
        .eq('role', 'instructor')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: open,
  });

  // Remove instructor mutation
  const removeInstructorMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('org_members')
        .update({ 
          status: 'removed',
          removed_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-instructors', organization.id] });
      queryClient.invalidateQueries({ queryKey: ['organization', organization.id] });
      toast({
        title: 'Instructor removed',
        description: 'The instructor has been removed from the organization.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing instructor',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredInstructors = instructors?.filter(instructor =>
    instructor.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'removed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Instructors - {organization.name}
          </DialogTitle>
        <DialogDescription>
          Manage instructors for this organization. Current usage: {organization.instructors_used || 0}/{organization.instructor_limit || 1}
        </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={(organization.instructors_used || 0) >= (organization.instructor_limit || 1)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Instructor
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="text-center py-8">Loading instructors...</div>
          ) : filteredInstructors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No instructors found matching your search.' : 'No instructors found.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {instructor.profiles?.full_name || instructor.profiles?.display_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Instructor
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(instructor.status)}>
                        {instructor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {instructor.joined_at 
                        ? format(new Date(instructor.joined_at), 'MMM d, yyyy')
                        : 'Unknown'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => removeInstructorMutation.mutate(instructor.id)}
                            className="text-destructive"
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove instructor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredInstructors.length} instructor(s)
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}