import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgCan } from '@/hooks/useOrgCan';
import { useAdminCopilot } from '@/hooks/useAdminCopilot';
import { AdminCopilotWidget } from './AdminCopilotWidget';
import { AdminCopilotModal } from './AdminCopilotModal';

/**
 * Container component that manages the Admin AI Co-pilot.
 * Only renders for Admin/Owner roles in organization context.
 */
export function AdminCopilotContainer() {
  const orgContext = useOrgContext();
  const { isOwner, isAdmin } = useOrgCan();
  
  const orgId = orgContext?.currentOrg?.organizations?.id;
  const orgName = orgContext?.currentOrg?.organizations?.name;
  
  const {
    messages,
    isLoading,
    isOpen,
    setIsOpen,
    toggleOpen,
    sendMessage,
    clearMessages
  } = useAdminCopilot(orgId);

  // Only show for Admin or Owner roles
  if (!orgId || (!isOwner && !isAdmin)) {
    return null;
  }

  return (
    <>
      <AdminCopilotWidget 
        onClick={toggleOpen}
        hasUnread={false}
      />
      <AdminCopilotModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
        onClear={clearMessages}
        orgName={orgName}
      />
    </>
  );
}
