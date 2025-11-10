import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AttachMaterialButtonProps {
  materials: Array<{ id: string; title: string; file_type: string; created_at: string }>;
  attachedMaterialIds: string[];
  onAttach: (materialId: string) => void;
  disabled?: boolean;
}

export const AttachMaterialButton: React.FC<AttachMaterialButtonProps> = ({
  materials,
  attachedMaterialIds,
  onAttach,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);

  const handleAttach = (materialId: string) => {
    onAttach(materialId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || materials.length === 0}
          className="shrink-0"
          title={materials.length === 0 ? "No materials uploaded" : "Attach a document"}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Attach Study Material</h4>
          {materials.length === 0 ? (
            <p className="text-sm text-muted-foreground">No materials uploaded yet</p>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {materials.map((material) => {
                  const isAttached = attachedMaterialIds.includes(material.id);
                  return (
                    <button
                      key={material.id}
                      onClick={() => !isAttached && handleAttach(material.id)}
                      disabled={isAttached}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        isAttached 
                          ? "bg-purple-50 border-purple-200 cursor-not-allowed opacity-60"
                          : "hover:bg-accent border-border cursor-pointer"
                      )}
                    >
                      <p className="text-sm font-medium line-clamp-1">{material.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{material.file_type || 'FILE'}</span>
                        <span>•</span>
                        <span>{new Date(material.created_at).toLocaleDateString()}</span>
                        {isAttached && (
                          <>
                            <span>•</span>
                            <span className="text-purple-600 font-medium">Attached</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
