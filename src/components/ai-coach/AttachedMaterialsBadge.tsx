import React from 'react';
import { Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  if (materialIds.length === 0) return null;

  const attachedMaterials = materialIds
    .map(id => materials.find(m => m.id === id))
    .filter(Boolean);

  return (
    <div className={cn("flex flex-wrap gap-2 mb-2", className)}>
      {attachedMaterials.map((material) => (
        <div
          key={material!.id}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm border border-purple-300 hover:bg-purple-200 transition-colors"
        >
          <Paperclip className="w-3 h-3" />
          <span className="max-w-[200px] truncate">{material!.title}</span>
          <button
            onClick={() => onRemove(material!.id)}
            className="hover:bg-purple-300 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${material!.title}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
