import React from 'react';
import { RequireRole } from '@/components/guards/RequireRole';
import { ScormStudio } from '@/scorm/studio/ScormStudio';

export default function ScormStudioPage() {
  return (
    <RequireRole roles={['admin', 'instructor']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SCORM Studio</h1>
          <p className="text-muted-foreground">
            Manage and analyze your SCORM packages
          </p>
        </div>
        <ScormStudio />
      </div>
    </RequireRole>
  );
}