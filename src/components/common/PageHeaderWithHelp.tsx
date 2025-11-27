/**
 * Page Header With Help
 * Reusable page header component with contextual help button
 */

import React from 'react';
import { ContextualHelpButton } from './ContextualHelpButton';

interface PageHeaderWithHelpProps {
  title: string;
  description?: string;
  section?: string;
  viewMode?: 'org-owner' | 'student';
  children?: React.ReactNode; // For additional header actions
}

export function PageHeaderWithHelp({
  title,
  description,
  section,
  viewMode = 'org-owner',
  children
}: PageHeaderWithHelpProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <ContextualHelpButton section={section} viewMode={viewMode} size="icon" variant="ghost" />
        </div>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
