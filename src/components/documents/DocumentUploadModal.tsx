import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import * as pdfjs from "pdfjs-dist";

// Configure PDF.js worker - use unpkg instead of cdnjs for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentUploadModal({ open, onOpenChange }: DocumentUploadModalProps) {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("general");
  const [documentDate, setDocumentDate] = useState("");

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("PDF text extraction error:", error);
      return "";
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !selectedFamily?.id || !user?.id) {
        throw new Error("Missing required data");
      }

      // Extract text from PDF first
      let extractedContent = "";
      if (file.type === "application/pdf") {
        toast.info("Extracting text from PDF...");
        extractedContent = await extractTextFromPDF(file);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const filePath = `${selectedFamily.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("family-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert metadata into database with extracted content
      const { error: dbError } = await supabase.from("documents").insert({
        family_id: selectedFamily.id,
        student_id: selectedStudent?.id || null,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
        category,
        document_date: documentDate || null,
        extracted_content: extractedContent || null,
      });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded successfully");
      onOpenChange(false);
      setFile(null);
      setCategory("general");
      setDocumentDate("");
    },
    onError: (error: any) => {
      toast.error("Upload failed: " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to select a file"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, or DOCX (max 20MB)
                </p>
              </label>
            </div>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => uploadMutation.mutate()}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
