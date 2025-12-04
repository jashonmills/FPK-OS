import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Mail, 
  UserX, 
  UserCheck, 
  Download,
  CheckCircle2,
  ChevronDown,
  X
} from 'lucide-react';
import { OrgStudent } from '@/hooks/useOrgStudents';

interface BulkStudentActionsProps {
  selectedStudents: OrgStudent[];
  onClearSelection: () => void;
  onBulkDelete: (studentIds: string[]) => void;
  onBulkStatusChange: (studentIds: string[], status: 'active' | 'inactive') => void;
  onBulkExport: (studentIds: string[]) => void;
  onBulkEmail: (students: OrgStudent[]) => void;
  isProcessing?: boolean;
}

export function BulkStudentActions({
  selectedStudents,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
  onBulkEmail,
  isProcessing = false,
}: BulkStudentActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  if (selectedStudents.length === 0) return null;

  const handleBulkDelete = () => {
    const studentIds = selectedStudents.map(s => s.id);
    onBulkDelete(studentIds);
    setShowDeleteDialog(false);
  };

  const hasEmailStudents = selectedStudents.some(s => s.parent_email);
  const hasLinkedAccounts = selectedStudents.some(s => s.linked_user_id);
  const hasPendingActivations = selectedStudents.some(s => !s.linked_user_id);

  return (
    <>
      <div className="sticky top-0 z-40 bg-orange-600/95 backdrop-blur-sm border-b border-orange-400/50 shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-orange-900 border-white/30 px-3 py-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {selectedStudents.length} Selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkExport(selectedStudents.map(s => s.id))}
              disabled={isProcessing}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>

            {/* Email Button */}
            {hasEmailStudents && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkEmail(selectedStudents)}
                disabled={isProcessing}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email Selected
              </Button>
            )}

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  More Actions
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {hasPendingActivations && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => onBulkStatusChange(selectedStudents.map(s => s.id), 'active')}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {hasLinkedAccounts && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => onBulkStatusChange(selectedStudents.map(s => s.id), 'inactive')}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedStudents.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedStudents.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedStudents.length} Student{selectedStudents.length > 1 ? 's' : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {selectedStudents.slice(0, 5).map(student => (
                  <li key={student.id} className="text-sm">
                    {student.full_name || 'Unnamed Student'}
                  </li>
                ))}
                {selectedStudents.length > 5 && (
                  <li className="text-sm font-medium">
                    ...and {selectedStudents.length - 5} more
                  </li>
                )}
              </ul>
              <p className="mt-3 text-sm font-medium text-destructive">
                All associated data including progress, enrollments, and assignments will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete {selectedStudents.length} Student{selectedStudents.length > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
