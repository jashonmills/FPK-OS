import React, { useState, useMemo } from 'react';
import { BookOpen, Upload as UploadIcon, Trash2, Paperclip, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderManager } from './FolderManager';
import { SmartUploadModal } from './SmartUploadModal';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { cn } from '@/lib/utils';

interface MaterialsSubTabProps {
  orgId?: string;
  onStartStudying?: (materialTitle: string, materialId: string) => void;
  attachedMaterialIds?: string[];
  onAttachToChat?: (materialId: string) => void;
}

export function MaterialsSubTab({ orgId, onStartStudying, attachedMaterialIds = [], onAttachToChat }: MaterialsSubTabProps) {
  const { studyMaterials, isLoadingMaterials, uploadMaterial, deleteMaterial, assignToFolder } = useAICoachStudyMaterials(orgId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [draggedMaterialId, setDraggedMaterialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('[MaterialsSubTab] Rendered:', { 
    orgId, 
    materialsCount: studyMaterials.length,
    isLoading: isLoadingMaterials
  });

  const filteredMaterials = useMemo(() => {
    return studyMaterials.filter((m: any) => {
      // Filter by folder
      if (selectedFolderId !== null && m.folder_id !== selectedFolderId) {
        return false;
      }
      // Filter by search query
      if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [studyMaterials, selectedFolderId, searchQuery]);

  const handleUpload = async (file: File, folderId: string | null): Promise<string | null> => {
    console.log('[MaterialsSubTab] handleUpload:', { fileName: file.name, folderId });
    const materialId = await uploadMaterial(file);
    console.log('[MaterialsSubTab] Upload completed:', { materialId });
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

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            {isLoadingMaterials ? (
              <p className="text-sm text-gray-500 italic animate-pulse">Loading materials...</p>
            ) : filteredMaterials.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                {searchQuery ? 'No materials match your search.' : (selectedFolderId === null ? 'No materials uploaded yet' : 'This folder is empty')}
              </p>
            ) : (
              filteredMaterials.map((material: any) => {
                const isAttached = attachedMaterialIds.includes(material.id);
                return (
                  <div
                    key={material.id}
                    draggable
                    onDragStart={() => handleDragStart(material.id)}
                    className={cn(
                      "p-3 rounded border cursor-move transition group relative",
                      isAttached 
                        ? "bg-purple-100 border-purple-400 ring-2 ring-purple-500" 
                        : "bg-purple-50/80 border-purple-200/60 hover:bg-purple-100/80"
                    )}
                  >
                    <div className="pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-800">{material.title}</p>
                        {isAttached && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                            Attached
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {material.file_type || 'FILE'} • {new Date(material.created_at).toLocaleDateString()}
                        {material.file_size && ` • ${(material.file_size / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                      {onAttachToChat && !isAttached && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAttachToChat(material.id)}
                          className="mt-2 h-7 text-xs"
                        >
                          <Paperclip className="w-3 h-3 mr-1" />
                          Attach to Chat
                        </Button>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMaterial(material.id, material.file_url)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                );
              })
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
