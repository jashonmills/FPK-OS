import React, { useState, useMemo } from 'react';
import { BookOpen, Upload as UploadIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FolderManager } from './FolderManager';
import { SmartUploadModal } from './SmartUploadModal';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';

interface MaterialsSubTabProps {
  orgId?: string;
  onStartStudying?: (materialTitle: string, materialId: string) => void;
}

export function MaterialsSubTab({ orgId, onStartStudying }: MaterialsSubTabProps) {
  const { studyMaterials, isLoadingMaterials, uploadMaterial, deleteMaterial, assignToFolder } = useAICoachStudyMaterials(orgId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [draggedMaterialId, setDraggedMaterialId] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    if (selectedFolderId === null) return studyMaterials;
    return studyMaterials.filter((m: any) => m.folder_id === selectedFolderId);
  }, [studyMaterials, selectedFolderId]);

  const handleUpload = async (file: File, folderId: string | null): Promise<string | null> => {
    const materialId = await uploadMaterial(file);
    if (materialId && folderId) {
      await assignToFolder(materialId, folderId);
    }
    return materialId;
  };

  const handleDragStart = (materialId: string) => {
    setDraggedMaterialId(materialId);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    
    if (draggedMaterialId) {
      await assignToFolder(draggedMaterialId, targetFolderId);
      setDraggedMaterialId(null);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Left: Folder Navigation */}
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5" />
            Folders
          </h3>
          <div
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
          >
            <FolderManager
              folderType="study_material"
              orgId={orgId}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          </div>
        </div>
      </div>

      {/* Right: Materials List */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              {selectedFolderId === null ? 'All Materials' : 'Folder Contents'}
            </h3>
            <Button onClick={() => setIsUploadModalOpen(true)} size="sm">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </div>

          <div className="space-y-2">
            {isLoadingMaterials ? (
              <p className="text-sm text-gray-500 italic animate-pulse">Loading materials...</p>
            ) : filteredMaterials.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                {selectedFolderId === null ? 'No materials uploaded yet' : 'This folder is empty'}
              </p>
            ) : (
              filteredMaterials.map((material: any) => (
                <div
                  key={material.id}
                  draggable
                  onDragStart={() => handleDragStart(material.id)}
                  className="p-3 bg-purple-50/80 rounded border border-purple-200/60 hover:bg-purple-100/80 cursor-move transition group relative"
                >
                  <p className="text-sm font-medium text-gray-800">{material.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {material.file_type || 'FILE'} • {new Date(material.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => deleteMaterial(material.id, material.file_url)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SmartUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUpload}
        onStartStudying={onStartStudying}
        orgId={orgId}
      />
    </div>
  );
}
