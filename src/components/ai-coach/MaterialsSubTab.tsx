import React, { useState, useMemo } from 'react';
import { BookOpen, Upload as UploadIcon, Trash2, Paperclip, Search, Sparkles, Check, MoreVertical, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FolderManager } from './FolderManager';
import { SmartUploadModal } from './SmartUploadModal';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { useAICoachFolders } from '@/hooks/useAICoachFolders';
import { cn } from '@/lib/utils';

interface MaterialsSubTabProps {
  orgId?: string;
  onStartStudying?: (materialTitle: string, materialId: string) => void;
  attachedMaterialIds?: string[];
  onAttachToChat?: (materialId: string) => void;
}

export function MaterialsSubTab({ orgId, onStartStudying, attachedMaterialIds = [], onAttachToChat }: MaterialsSubTabProps) {
  const { studyMaterials, isLoadingMaterials, uploadMaterial, deleteMaterial, assignToFolder } = useAICoachStudyMaterials(orgId);
  const { folders, refetchFolders } = useAICoachFolders('study_material', orgId);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [draggedMaterialId, setDraggedMaterialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [studyingMaterialId, setStudyingMaterialId] = useState<string | null>(null);

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

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null, folderName?: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    
    if (draggedMaterialId) {
      await assignToFolder(draggedMaterialId, targetFolderId, folderName);
      setDraggedMaterialId(null);
    }
  };

  const handleStartStudying = async (materialTitle: string, materialId: string) => {
    if (!onStartStudying) return;
    
    setStudyingMaterialId(materialId);
    
    toast({
      title: 'Opening study session',
      description: `Starting to study "${materialTitle}"`,
      duration: 2000
    });

    try {
      await onStartStudying(materialTitle, materialId);
    } catch (error) {
      console.error('Failed to start study session:', error);
      toast({
        title: 'Failed to start study session',
        description: 'Please try again',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setTimeout(() => setStudyingMaterialId(null), 1000);
    }
  };

  return (
    <div className={cn(
      "flex gap-4",
      isMobile ? "flex-col h-full overflow-hidden" : "flex-row h-full"
    )}>
      {/* Left: Folder Navigation */}
      <div className={cn(
        "flex-shrink-0",
        isMobile ? "w-full flex-none" : "md:w-64"
      )}>
        <div className="bg-white rounded-lg border p-3 md:p-4 flex flex-col">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3 md:mb-4 text-sm md:text-base">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
            Folders
          </h3>
          <ScrollArea className={cn(isMobile ? "h-[150px]" : "max-h-[300px]")}>
            <FolderManager
              folderType="study_material"
              orgId={orgId}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onDrop={async (folderId, folderName) => {
                if (draggedMaterialId) {
                  const success = await assignToFolder(draggedMaterialId, folderId, folderName);
                  if (success) {
                    await refetchFolders();
                  }
                  setDraggedMaterialId(null);
                }
              }}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Right: Materials List */}
      <div className={cn(
        "flex-1 overflow-hidden",
        isMobile ? "flex flex-col" : "min-h-0"
      )}>
        <div className="bg-white rounded-lg border p-3 md:p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              {selectedFolderId === null ? 'All Materials' : 'Folder Contents'}
            </h3>
            <Button 
              onClick={() => setIsUploadModalOpen(true)} 
              size="sm"
              className={cn(isMobile && "h-9 px-3 text-xs")}
            >
              <UploadIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className={cn(isMobile && "hidden sm:inline")}>Upload</span>
              <span className={cn(!isMobile && "hidden sm:inline")}> Material</span>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3 md:mb-4 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 md:h-10 text-sm"
            />
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-2 pr-2 md:pr-4">
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
                      "rounded border cursor-move transition group relative",
                      isMobile ? "p-4" : "p-3",
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
                      <div className="flex flex-col gap-2 mt-3">
                        {onStartStudying && (
                          <Button
                            variant="default"
                            size="sm"
                            className={cn(
                              "w-full bg-purple-600 hover:bg-purple-700 text-white",
                              isMobile ? "h-9" : "h-8"
                            )}
                            onClick={() => handleStartStudying(material.title, material.id)}
                            disabled={studyingMaterialId === material.id}
                          >
                            {studyingMaterialId === material.id ? (
                              <>
                                <div className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Opening...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 mr-2" />
                                Start Studying
                              </>
                            )}
                          </Button>
                        )}
                        {onAttachToChat && (
                          isAttached ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full border-purple-300 bg-purple-50 text-purple-700",
                                isMobile ? "h-9" : "h-8"
                              )}
                              disabled
                            >
                              <Check className="w-3 h-3 mr-2" />
                              Attached
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAttachToChat(material.id)}
                              className={cn(
                                "w-full border-purple-200 text-purple-700 hover:bg-purple-50",
                                isMobile ? "h-9" : "h-8"
                              )}
                            >
                              <Paperclip className="w-3 h-3 mr-2" />
                              Attach to Chat
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Three-dot dropdown menu */}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-purple-100"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Move to Folder
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {folders.length === 0 ? (
                                <div className="px-2 py-1.5 text-sm text-gray-500 italic">
                                  No folders yet
                                </div>
                              ) : (
                                folders.map((folder) => (
                                  <DropdownMenuItem
                                    key={folder.id}
                                    onClick={async () => {
                                      const success = await assignToFolder(material.id, folder.id, folder.name);
                                      if (success) {
                                        await refetchFolders();
                                      }
                                    }}
                                  >
                                    {folder.name}
                                  </DropdownMenuItem>
                                ))
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          
                          {material.folder_id && (
                            <DropdownMenuItem
                              onClick={async () => {
                                const success = await assignToFolder(material.id, null);
                                if (success) {
                                  await refetchFolders();
                                }
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove from Folder
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={async () => {
                              await deleteMaterial(material.id, material.file_url);
                              await refetchFolders();
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Material
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </ScrollArea>
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
