import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, Sparkles, BookOpen, Info, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAICoachFolders } from '@/hooks/useAICoachFolders';
import { cn } from '@/lib/utils';

interface SmartUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, folderId: string | null) => Promise<string | null>;
  onStartStudying?: (fileName: string, materialId: string) => void;
  onAssignToStudents?: (material: { title: string; id: string }) => void;
  userType?: 'student' | 'educator';
  orgId?: string;
}

export function SmartUploadModal({
  open,
  onOpenChange,
  onUpload,
  onStartStudying,
  onAssignToStudents,
  userType = 'student',
  orgId
}: SmartUploadModalProps) {
  const { folders } = useAICoachFolders('study_material', orgId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('none');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedMaterialId, setUploadedMaterialId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const materialId = await onUpload(
      selectedFile,
      selectedFolderId === 'none' ? null : selectedFolderId
    );

    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsUploading(false);

    if (materialId) {
      setUploadedMaterialId(materialId);
      setUploadSuccess(true);
    }
  };

  const handleStartStudying = () => {
    console.log('[SmartUploadModal] Starting study session with:', { title, uploadedMaterialId });
    if (onStartStudying && title && uploadedMaterialId) {
      onStartStudying(title, uploadedMaterialId);
      handleClose();
    } else {
      console.error('[SmartUploadModal] Cannot start studying - missing data:', { hasCallback: !!onStartStudying, title, uploadedMaterialId });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setTitle('');
    setSelectedFolderId('none');
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMaterialId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!uploadSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>
                Add a new document to your study materials
              </DialogDescription>
            </DialogHeader>

            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition",
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                )}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">
                  Drag and drop a file here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported: PDF, DOCX, TXT (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected File Display */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Folder Selection */}
                <div className="space-y-2">
                  <Label htmlFor="folder">Organize in Folder</Label>
                  <Select
                    value={selectedFolderId}
                    onValueChange={setSelectedFolderId}
                    disabled={isUploading}
                  >
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-xs text-center text-gray-500">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>✅ Upload Successful!</DialogTitle>
              <DialogDescription>
                Your document "{title}" has been uploaded successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>

              {/* Conditional Info Banner based on user type */}
              {userType === 'student' ? (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Start Studying This Now</p>
                      <p className="text-gray-600 text-xs">Opens chat with this document attached so Betty can reference and discuss its content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Done</p>
                      <p className="text-gray-600 text-xs">Save for later (you can attach it manually using the 📎 button in chat)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <UserPlus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Assign to Students</p>
                      <p className="text-gray-600 text-xs">Create an assignment with custom AI instructions to guide student learning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Later</p>
                      <p className="text-gray-600 text-xs">View in "Study Materials" tab or "Assignments" tab to assign later</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {userType === 'student' ? (
                <>
                  <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                  {onStartStudying && (
                    <Button 
                      onClick={handleStartStudying} 
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                      data-tour="upload-success-start-studying"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Studying This Now
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                  {onAssignToStudents && uploadedMaterialId && (
                    <Button 
                      onClick={() => {
                        onAssignToStudents({ title, id: uploadedMaterialId });
                        handleClose();
                      }} 
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Students
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
