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
  onAttachAndStartFresh?: (materialId: string) => void;
  disabled?: boolean;
}

export const AttachMaterialButton: React.FC<AttachMaterialButtonProps> = ({
  materials,
  attachedMaterialIds,
  onAttach,
  onAttachAndStartFresh,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const handleAttach = (materialId: string) => {
    onAttach(materialId);
    setOpen(false);
    setSelectedMaterialId(null);
  };

  const handleAttachAndStartFresh = (materialId: string) => {
    if (onAttachAndStartFresh) {
      onAttachAndStartFresh(materialId);
      setOpen(false);
      setSelectedMaterialId(null);
    }
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
            <>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {materials.map((material) => {
                    const isAttached = attachedMaterialIds.includes(material.id);
                    const isSelected = selectedMaterialId === material.id;
                    return (
                      <button
                        key={material.id}
                        onClick={() => {
                          if (!isAttached) {
                            setSelectedMaterialId(material.id);
                          }
                        }}
                        disabled={isAttached}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          isAttached 
                            ? "bg-purple-50 border-purple-200 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-blue-50 border-blue-300 shadow-sm"
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
              
              {/* PHASE 4: Attach options */}
              {selectedMaterialId && (
                <div className="space-y-2 pt-2 border-t">
                  <button
                    onClick={() => handleAttach(selectedMaterialId)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    📎 Attach to Current Chat
                  </button>
                  {onAttachAndStartFresh && attachedMaterialIds.length === 0 && (
                    <button
                      onClick={() => handleAttachAndStartFresh(selectedMaterialId)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      📄 Attach & Start New Chat
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
