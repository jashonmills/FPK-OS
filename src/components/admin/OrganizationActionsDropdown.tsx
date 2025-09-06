import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Ban, Download, Mail, Users, CreditCard, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Organization } from '@/types/organization';
import { EditOrganizationDialog } from './EditOrganizationDialog';
import { DeleteOrganizationDialog } from './DeleteOrganizationDialog';
import { SuspendOrganizationDialog } from './SuspendOrganizationDialog';
import { ExportDataDialog } from './ExportDataDialog';
import { SendNotificationDialog } from './SendNotificationDialog';
import { ManageMembersDialog } from './ManageMembersDialog';
import { ChangeSubscriptionDialog } from './ChangeSubscriptionDialog';

interface OrganizationActionsDropdownProps {
  organization: Organization;
}

export function OrganizationActionsDropdown({ organization }: OrganizationActionsDropdownProps) {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  const closeDialog = () => setDialogOpen(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-foreground';
      case 'suspended': return 'text-warning';
      case 'deleted': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const isActive = organization.status === 'active';
  const isSuspended = organization.status === 'suspended';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-muted"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
          <DropdownMenuItem onClick={() => setDialogOpen('edit')} className="cursor-pointer hover:bg-muted">
            <Edit className="mr-2 h-4 w-4" />
            Edit organization
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setDialogOpen('members')} className="cursor-pointer hover:bg-muted">
            <Users className="mr-2 h-4 w-4" />
            Manage members
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setDialogOpen('subscription')} className="cursor-pointer hover:bg-muted">
            <CreditCard className="mr-2 h-4 w-4" />
            Change subscription tier
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setDialogOpen('notification')} className="cursor-pointer hover:bg-muted">
            <Mail className="mr-2 h-4 w-4" />
            Send notifications
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setDialogOpen('export')} className="cursor-pointer hover:bg-muted">
            <Download className="mr-2 h-4 w-4" />
            Export data
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {isActive && (
            <DropdownMenuItem 
              onClick={() => setDialogOpen('suspend')} 
              className="cursor-pointer hover:bg-muted text-warning"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend organization
            </DropdownMenuItem>
          )}
          
          {isSuspended && (
            <DropdownMenuItem 
              onClick={() => setDialogOpen('reactivate')} 
              className="cursor-pointer hover:bg-muted text-success"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reactivate organization
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => setDialogOpen('delete')} 
            className="cursor-pointer hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <EditOrganizationDialog
        organization={organization}
        open={dialogOpen === 'edit'}
        onOpenChange={(open) => !open && closeDialog()}
      />
      
      <DeleteOrganizationDialog
        organization={organization}
        open={dialogOpen === 'delete'}
        onOpenChange={(open) => !open && closeDialog()}
      />
      
      <SuspendOrganizationDialog
        organization={organization}
        open={dialogOpen === 'suspend'}
        onOpenChange={(open) => !open && closeDialog()}
        mode="suspend"
      />
      
      <SuspendOrganizationDialog
        organization={organization}
        open={dialogOpen === 'reactivate'}
        onOpenChange={(open) => !open && closeDialog()}
        mode="reactivate"
      />
      
      <ExportDataDialog
        organization={organization}
        open={dialogOpen === 'export'}
        onOpenChange={(open) => !open && closeDialog()}
      />
      
      <SendNotificationDialog
        organization={organization}
        open={dialogOpen === 'notification'}
        onOpenChange={(open) => !open && closeDialog()}
      />
      
      <ManageMembersDialog
        organization={organization}
        open={dialogOpen === 'members'}
        onOpenChange={(open) => !open && closeDialog()}
      />
      
      <ChangeSubscriptionDialog
        organization={organization}
        open={dialogOpen === 'subscription'}
        onOpenChange={(open) => !open && closeDialog()}
      />
    </>
  );
}