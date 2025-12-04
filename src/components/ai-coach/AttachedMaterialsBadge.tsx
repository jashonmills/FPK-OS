import React from 'react';
import { Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AttachedMaterialsBadgeProps {
  materialIds: string[];
  materials: Array<{ id: string; title: string }>;
  onRemove: (materialId: string) => void;
  className?: string;
}

export const AttachedMaterialsBadge: React.FC<AttachedMaterialsBadgeProps> = ({
  materialIds,
  materials,
  onRemove,
  className
}) => {
  const isMobile = useIsMobile();
  
  if (materialIds.length === 0) return null;

  const attachedMaterials = materialIds
    .map(id => materials.find(m => m.id === id))
    .filter(Boolean);

  return (
    <div className={cn("flex flex-wrap gap-2 mb-2", className)}>
      {attachedMaterials.map((material) => (
        <div
          key={material!.id}
          className={cn(
            "inline-flex items-center gap-2 bg-purple-100 text-purple-800 rounded-full border border-purple-300 hover:bg-purple-200 transition-colors",
            isMobile ? "px-3 py-2 text-sm" : "px-3 py-1.5 text-sm"
          )}
        >
          <Paperclip className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
          <span className={cn(
            "truncate",
            isMobile ? "max-w-[180px]" : "max-w-[200px]"
          )}>{material!.title}</span>
          <button
            onClick={() => onRemove(material!.id)}
            className={cn(
              "hover:bg-purple-300 rounded-full transition-colors",
              isMobile ? "p-1 min-h-[28px] min-w-[28px]" : "p-0.5"
            )}
            aria-label={`Remove ${material!.title}`}
          >
            <X className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
          </button>
        </div>
      ))}
    </div>
  );
};
