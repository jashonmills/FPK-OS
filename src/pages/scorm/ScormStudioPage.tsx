import React from 'react';
import PortalShell from '@/layouts/PortalShell';
import { RequireRole } from '@/components/guards/RequireRole';
import { ScormStudio } from '@/scorm/studio/ScormStudio';

export default function ScormStudioPage() {
  return (
    <RequireRole roles={['admin', 'instructor']}>
      <PortalShell
        title="SCORM Studio"
        breadcrumb={[
          { label: 'Admin', href: '/dashboard' },
          { label: 'SCORM Studio' }
        ]}
      >
        <ScormStudio />
      </PortalShell>
    </RequireRole>
  );
}