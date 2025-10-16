import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload, FileText, File, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentUploadModal({ open, onOpenChange }: DocumentUploadModalProps) {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("general");
  const [documentDate, setDocumentDate] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const MAX_FILES = 10;

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (files.length === 0 || !selectedFamily?.id || !user?.id || !selectedStudent?.id) {
        throw new Error("Missing required data");
      }

      const results = { success: 0, failed: 0, failedFiles: [] as string[] };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length });

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('family_id', selectedFamily.id);
          formData.append('student_id', selectedStudent.id);
          formData.append('category', category);
          formData.append('document_date', documentDate || '');
          formData.append('uploaded_by', user.id);

          const { data, error } = await supabase.functions.invoke('upload-document', {
            body: formData,
          });

          if (error) throw error;
          if (!data?.success) throw new Error(data?.error || 'Upload failed');

          results.success++;
        } catch (error: any) {
          console.error(`Failed to upload ${file.name}:`, error);
          results.failed++;
          results.failedFiles.push(file.name);
        }
      }

      return { familyId: selectedFamily.id, results };
    },
    onSuccess: async ({ familyId, results }) => {
      setUploadProgress(null);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      // Show comprehensive results toast
      if (results.failed === 0) {
        toast.success(`✅ ${results.success} document${results.success > 1 ? 's' : ''} uploaded successfully. Analysis starting in background.`);
      } else if (results.success === 0) {
        toast.error(`❌ All ${results.failed} uploads failed.`);
      } else {
        toast.warning(`✅ ${results.success} uploaded, ⚠️ ${results.failed} failed: ${results.failedFiles.join(', ')}`);
      }
      
      // Check if we now have 3+ documents and should show analysis button
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("family_id", familyId);

      if (count && count >= 3) {
        const { data: familyData } = await supabase
          .from("families")
          .select("initial_doc_analysis_status")
          .eq("id", familyId)
          .single();

        if (familyData?.initial_doc_analysis_status === "pending") {
          toast.info("You now have enough documents for AI analysis! Check the 'Analyze My Documents' button.");
        }
      }

      onOpenChange(false);
      setFiles([]);
      setCategory("general");
      setDocumentDate("");
    },
    onError: (error: any) => {
      setUploadProgress(null);
      toast.error("Upload failed: " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValidType = file.type === 'application/pdf' || 
                           file.type === 'application/msword' ||
                           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB
        
        if (!isValidType) {
          toast.error(`${file.name}: Invalid file type. Please upload PDF or DOC files.`);
          return false;
        }
        if (!isValidSize) {
          toast.error(`${file.name}: File too large. Max size is 20MB.`);
          return false;
        }
        return true;
      });

      const totalFiles = files.length + validFiles.length;
      if (totalFiles > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed. Selecting first ${MAX_FILES - files.length} files.`);
        setFiles([...files, ...validFiles.slice(0, MAX_FILES - files.length)]);
      } else {
        setFiles([...files, ...validFiles]);
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          {selectedStudent && (
            <p className="text-sm text-muted-foreground">
              Uploading for: <span className="font-semibold text-foreground">{selectedStudent.student_name}</span>
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">`
          <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select Files</Label>
            {files.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to select files
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, or DOCX • Max 20MB each • Up to {MAX_FILES} files
                  </p>
                </label>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <Card key={index} className="p-3 border-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {file.type === 'application/pdf' ? (
                            <FileText className="h-8 w-8 text-destructive" />
                          ) : (
                            <File className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium truncate pr-2">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                {files.length < MAX_FILES && (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors mt-3">
                    <Input
                      id="file-more"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    <label htmlFor="file-more" className="cursor-pointer block">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Add more files ({files.length}/{MAX_FILES})
                      </p>
                    </label>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iep">IEP</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="progress_report">Progress Report</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_date">Document Date (Optional)</Label>
            <Input
              id="document_date"
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
            />
          </div>
        </div>
      </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => uploadMutation.mutate()}
            disabled={files.length === 0 || !selectedStudent || uploadMutation.isPending}
          >
            {uploadMutation.isPending && uploadProgress
              ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`
              : uploadMutation.isPending
              ? "Uploading..."
              : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
