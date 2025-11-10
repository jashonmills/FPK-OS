import React, { useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FolderManager } from './FolderManager';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { cn } from '@/lib/utils';

interface AttachContextButtonProps {
  orgId?: string;
  selectedMaterialIds: string[];
  onMaterialsChange: (materialIds: string[]) => void;
}

export function AttachContextButton({
  orgId,
  selectedMaterialIds,
  onMaterialsChange
}: AttachContextButtonProps) {
  const { studyMaterials } = useAICoachStudyMaterials(orgId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredMaterials = selectedFolderId === null
    ? studyMaterials
    : studyMaterials.filter((m: any) => m.folder_id === selectedFolderId);

  const toggleMaterial = (materialId: string) => {
    if (selectedMaterialIds.includes(materialId)) {
      onMaterialsChange(selectedMaterialIds.filter(id => id !== materialId));
    } else {
      onMaterialsChange([...selectedMaterialIds, materialId]);
    }
  };

  const getSelectedMaterials = () => {
    return studyMaterials.filter((m: any) => selectedMaterialIds.includes(m.id));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Selected Materials Tags */}
      {getSelectedMaterials().map((material: any) => (
        <Badge key={material.id} variant="secondary" className="gap-1">
          {material.title}
          <button
            onClick={() => toggleMaterial(material.id)}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {/* Attach Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4" align="start">
          <h4 className="font-semibold mb-4">Attach Study Materials</h4>
          
          <div className="flex gap-4">
            {/* Folder Navigation */}
            <div className="w-40 flex-shrink-0">
              <FolderManager
                folderType="study_material"
                orgId={orgId}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
              />
            </div>

            {/* Materials List */}
            <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2">
              {filteredMaterials.map((material: any) => (
                <div
                  key={material.id}
                  onClick={() => toggleMaterial(material.id)}
                  className={cn(
                    "p-2 rounded border cursor-pointer transition",
                    selectedMaterialIds.includes(material.id)
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50"
                  )}
                >
                  <p className="text-sm font-medium">{material.title}</p>
                  <p className="text-xs text-gray-500">
                    {material.file_type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
