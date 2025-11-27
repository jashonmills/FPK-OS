import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Archive } from 'lucide-react';
import type { ConfirmModalData } from '@/types/enhanced-course-card';

interface ConfirmModalProps {
  isOpen: boolean;
  confirm: ConfirmModalData;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, confirm, onConfirm, onCancel }: ConfirmModalProps) {
  if (!confirm.kind) return null;

  const getIcon = () => {
    switch (confirm.kind) {
      case 'publish':
        return <CheckCircle className="h-6 w-6 text-emerald-600" />;
      case 'unpublish':
        return <Archive className="h-6 w-6 text-amber-600" />;
      case 'delete':
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (confirm.kind) {
      case 'publish':
        return 'Publish Course';
      case 'unpublish':
        return 'Unpublish Course';
      case 'delete':
        return 'Delete Course';
      default:
        return '';
    }
  };

  const getDescription = () => {
    const impactText = confirm.impactSummary
      ? `${confirm.impactSummary.groupCount} groups, ${confirm.impactSummary.studentCount} students`
      : 'No active assignments';

    switch (confirm.kind) {
      case 'publish':
        return (
          <div className="space-y-2">
            <p>
              Publish <strong>"{confirm.courseTitle}"</strong> and make it available for assignment?
            </p>
            <p className="text-sm text-muted-foreground">
              Current impact: {impactText}
            </p>
          </div>
        );
      case 'unpublish':
        return (
          <div className="space-y-2">
            <p>
              Unpublish <strong>"{confirm.courseTitle}"</strong>? Students will keep access until end of day.
            </p>
            <p className="text-sm text-muted-foreground">
              Current impact: {impactText}
            </p>
          </div>
        );
      case 'delete':
        return (
          <div className="space-y-2">
            <p>
              Permanently delete <strong>"{confirm.courseTitle}"</strong>? This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground">
              Assignments will be closed; analytics will be retained.
            </p>
            <p className="text-sm text-muted-foreground">
              Current impact: {impactText}
            </p>
          </div>
        );
      default:
        return '';
    }
  };

  const getButtonText = () => {
    if (confirm.busy) return 'Working...';
    
    switch (confirm.kind) {
      case 'publish':
        return 'Publish';
      case 'unpublish':
        return 'Unpublish';
      case 'delete':
        return 'Delete';
      default:
        return 'Confirm';
    }
  };

  const getButtonVariant = () => {
    switch (confirm.kind) {
      case 'delete':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{getTitle()}</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div>{getDescription()}</div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={confirm.busy}
          >
            Cancel
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={onConfirm}
            disabled={confirm.busy}
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}