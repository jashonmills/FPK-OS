import React, { useState, useMemo } from 'react';
import { BookOpen, Upload as UploadIcon, Trash2, Paperclip, Search, Sparkles, Check, MoreVertical, FolderOpen, X, FileText, FileSpreadsheet, File, CheckCircle2, Plus, Eye, UserPlus } from 'lucide-react';
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
import { StudyMaterialAssignmentDialog } from '@/components/assignments/StudyMaterialAssignmentDialog';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';

interface MaterialsSubTabProps {
  orgId?: string;
  onStartStudying?: (materialTitle: string, materialId: string) => void;
  onViewDocument?: (material: any) => void;
  attachedMaterialIds?: string[];
  onAttachToChat?: (materialId: string) => void;
}

export function MaterialsSubTab({ orgId, onStartStudying, onViewDocument, attachedMaterialIds = [], onAttachToChat }: MaterialsSubTabProps) {
  const { studyMaterials, isLoadingMaterials, uploadMaterial, deleteMaterial, assignToFolder } = useAICoachStudyMaterials(orgId);
  const { folders, refetchFolders } = useAICoachFolders('study_material', orgId);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [draggedMaterialId, setDraggedMaterialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [studyingMaterialId, setStudyingMaterialId] = useState<string | null>(null);
  const [selectedMaterialForAssignment, setSelectedMaterialForAssignment] = useState<any | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  
  // Bulk selection state
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Check if user is an educator using proper role permissions
  const { isOrgOwner, isOrgInstructor } = useOrgPermissions();
  const isEducator = isOrgOwner() || isOrgInstructor();

  // Fetch enrolled and assigned courses
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['ai-coach-materials-courses', orgId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const courseIds = new Set<string>();

      // Get assigned courses if in org context
      if (orgId) {
        const { data: assignedTargets } = await supabase
          .from('org_assignment_targets')
          .select(`
            assignment_id,
            org_assignments!inner (
              resource_id,
              type
            )
          `)
          .eq('target_id', user.id)
          .eq('target_type', 'member');

        (assignedTargets || []).forEach(target => {
          const assignment = target.org_assignments;
          if (assignment.type === 'course') {
            courseIds.add(assignment.resource_id);
          }
        });
      }

      // Get enrolled courses
      const { data: regularEnrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      (regularEnrollments || []).forEach(e => courseIds.add(e.course_id));

      const { data: interactiveEnrollments } = await supabase
        .from('interactive_course_enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      (interactiveEnrollments || []).forEach(e => courseIds.add(e.course_id));

      // Fetch course details
      const allCourseIds = Array.from(courseIds);
      if (allCourseIds.length === 0) return [];

      const { data: courses } = await supabase
        .from('courses')
        .select('id, slug, title, thumbnail_url, description')
        .in('id', allCourseIds);

      return courses || [];
    },
  });

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

  const handleToggleAttachment = (materialId: string) => {
    if (onAttachToChat) {
      onAttachToChat(materialId);
    }
  };

  const handleViewMaterial = (material: any) => {
    if (onViewDocument) {
      onViewDocument(material);
    } else {
      toast({
        title: 'View Material',
        description: `Opening ${material.file_name}...`,
      });
    }
  };

  const handleMoveToFolder = (materialId: string) => {
    toast({
      title: 'Move to Folder',
      description: 'Drag and drop materials onto folders to move them',
    });
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const material = studyMaterials.find((m: any) => m.id === materialId);
    if (!material) return;
    
    try {
      await deleteMaterial(materialId, material.file_url || '');
      toast({
        title: 'Material deleted',
        description: 'Study material has been removed',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete material',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleAssignMaterial = (material: any) => {
    setSelectedMaterialForAssignment(material);
    setIsAssignmentDialogOpen(true);
  };

  const handleAssignFromUpload = (material: { title: string; id: string }) => {
    const fullMaterial = studyMaterials.find((m: any) => m.id === material.id);
    if (fullMaterial) {
      handleAssignMaterial(fullMaterial);
    }
  };

  // Bulk selection handlers
  const handleToggleSelectMaterial = (materialId: string) => {
    setSelectedMaterialIds(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMaterialIds.length === filteredMaterials.length) {
      setSelectedMaterialIds([]);
    } else {
      setSelectedMaterialIds(filteredMaterials.map((m: any) => m.id));
    }
  };

  const handleBulkAssign = () => {
    const selectedMaterials = studyMaterials.filter((m: any) => 
      selectedMaterialIds.includes(m.id)
    );
    setSelectedMaterialForAssignment(selectedMaterials);
    setIsAssignmentDialogOpen(true);
  };

  const handleCancelBulkMode = () => {
    setIsBulkMode(false);
    setSelectedMaterialIds([]);
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
          <ScrollArea className={cn(isMobile ? "h-[120px]" : "max-h-[300px]")}>
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
          "flex-1 min-h-0 overflow-hidden flex flex-col"
        )}>
        <div className="bg-white rounded-lg border p-3 md:p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0 gap-2">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              {selectedFolderId === null ? 'All Materials' : 'Folder Contents'}
              {isBulkMode && selectedMaterialIds.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({selectedMaterialIds.length} selected)
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {isEducator && (
                <>
                  {isBulkMode ? (
                    <>
                      <Button
                        onClick={handleBulkAssign}
                        size="sm"
                        disabled={selectedMaterialIds.length === 0}
                        className={cn(isMobile && "h-9 px-3 text-xs")}
                      >
                        <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Assign ({selectedMaterialIds.length})
                      </Button>
                      <Button
                        onClick={handleCancelBulkMode}
                        size="sm"
                        variant="outline"
                        className={cn(isMobile && "h-9 px-3 text-xs")}
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsBulkMode(true)}
                      size="sm"
                      variant="outline"
                      className={cn(isMobile && "h-9 px-3 text-xs")}
                    >
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Bulk Assign</span>
                    </Button>
                  )}
                </>
              )}
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
          </div>

          {/* Search Bar and Bulk Actions */}
          <div className="space-y-2 mb-3 md:mb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 md:h-10 text-sm"
              />
            </div>
            
            {isBulkMode && filteredMaterials.length > 0 && (
              <Button
                onClick={handleSelectAll}
                size="sm"
                variant="outline"
                className="w-full h-8 text-xs"
              >
                {selectedMaterialIds.length === filteredMaterials.length ? (
                  <>
                    <X className="w-3 h-3 mr-1.5" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    Select All ({filteredMaterials.length})
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2">
            <div className="space-y-2">
              {isLoadingMaterials ? (
                <p className="text-sm text-gray-500 italic animate-pulse">Loading materials...</p>
              ) : (
                <>
                  {/* Render Courses */}
                  {enrolledCourses.map((course: any) => (
                    <div
                      key={`course-${course.id}`}
                      className="group flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        {course.thumbnail_url && (
                          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border overflow-hidden">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-xs md:text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-500">Course • Available for study</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewMaterial({ ...course, type: 'course' })}
                          className="h-8"
                        >
                          <Eye className="w-4 h-4 md:mr-1.5" />
                          <span className="hidden md:inline text-xs">View</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Render Uploaded Materials */}
                  {filteredMaterials.map((material: any) => {
                const isAttached = attachedMaterialIds.includes(material.id);
                const isSelected = selectedMaterialIds.includes(material.id);
                return (
                  <div
                    key={material.id}
                    className={cn(
                      "group flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors",
                      isAttached && "bg-blue-50 border-blue-200 hover:bg-blue-100",
                      isSelected && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      {isBulkMode && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectMaterial(material.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      )}
                      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                        {material.file_type === 'pdf' && <FileText className="w-4 h-4 md:w-5 md:h-5 text-red-500" />}
                        {material.file_type === 'txt' && <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />}
                        {material.file_type === 'docx' && <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />}
                        {material.file_type === 'csv' && <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 text-green-600" />}
                        {material.file_type === 'md' && <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />}
                        {!['pdf', 'txt', 'docx', 'csv', 'md'].includes(material.file_type) && <File className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-xs md:text-sm">
                    {material.title || material.file_name}
                  </p>
                        <p className="text-xs text-gray-500">
                          {material.file_size ? `${(material.file_size / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                          {material.uploaded_at ? ` ${new Date(material.uploaded_at).toLocaleDateString()}` : ' Date unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isAttached ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleAttachment(material.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
                        >
                          <CheckCircle2 className="w-4 h-4 md:mr-1.5" />
                          <span className="hidden md:inline text-xs">Attached</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAttachment(material.id)}
                          className="h-8"
                        >
                          <Plus className="w-4 h-4 md:mr-1.5" />
                          <span className="hidden md:inline text-xs">Attach</span>
                        </Button>
                      )}
                      <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 z-50 bg-white">
                          <DropdownMenuItem onClick={() => handleViewMaterial(material)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Content
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMoveToFolder(material.id)}>
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Move to Folder
                          </DropdownMenuItem>
                          {isEducator && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAssignMaterial(material)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Assign to Students
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMaterial(material.id)}
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
              })}
              
              {/* Empty State */}
              {enrolledCourses.length === 0 && filteredMaterials.length === 0 && !isLoadingMaterials && (
                <p className="text-sm text-gray-500 italic">
                  {searchQuery ? 'No materials match your search.' : (selectedFolderId === null ? 'No materials or courses available yet' : 'This folder is empty')}
                </p>
              )}
            </>
            )}
            </div>
          </div>
        </div>
      </div>

      <SmartUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUpload}
        onStartStudying={!isEducator ? onStartStudying : undefined}
        onAssignToStudents={isEducator ? handleAssignFromUpload : undefined}
        userType={isEducator ? 'educator' : 'student'}
        orgId={orgId}
      />

      {isEducator && selectedMaterialForAssignment && (
        <StudyMaterialAssignmentDialog
          open={isAssignmentDialogOpen}
          onOpenChange={setIsAssignmentDialogOpen}
          material={selectedMaterialForAssignment}
        />
      )}
    </div>
  );
}
