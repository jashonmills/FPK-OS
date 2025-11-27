import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Upload, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'platform' | 'organization';
  onCreateCourse?: () => void;
  onUploadScorm?: () => void;
}

export function EmptyState({ type, onCreateCourse, onUploadScorm }: EmptyStateProps) {
  if (type === 'platform') {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Platform Courses</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Platform courses will appear here when they become available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Organization Courses</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          Create your first course or upload SCORM content to get started.
        </p>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Convert SCORM to micro-lessons or build from scratch.
        </p>
        
        <div className="flex gap-3">
          {onCreateCourse && (
            <Button onClick={onCreateCourse} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          )}
          
          {onUploadScorm && (
            <Button onClick={onUploadScorm} variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload SCORM/ZIP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}