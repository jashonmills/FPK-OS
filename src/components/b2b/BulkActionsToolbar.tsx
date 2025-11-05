import { Button } from '@/components/ui/button';
import { Download, Users, Power } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onExportCSV: () => void;
  onAssignStaff: () => void;
  onToggleStatus: () => void;
  onClearSelection: () => void;
}

export const BulkActionsToolbar = ({
  selectedCount,
  onExportCSV,
  onAssignStaff,
  onToggleStatus,
  onClearSelection,
}: BulkActionsToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border shadow-lg rounded-lg px-6 py-4 flex items-center gap-4">
        <Badge variant="secondary" className="text-base px-3 py-1">
          {selectedCount} selected
        </Badge>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          
          <Button variant="outline" size="sm" onClick={onAssignStaff}>
            <Users className="h-4 w-4" />
            Assign to Staff
          </Button>
          
          <Button variant="outline" size="sm" onClick={onToggleStatus}>
            <Power className="h-4 w-4" />
            Toggle Status
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear
        </Button>
      </div>
    </div>
  );
};
