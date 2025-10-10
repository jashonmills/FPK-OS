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
      // Configure worker with reliable CDN
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

      return { familyId: selectedFamily.id };
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded successfully");
      
      // Check if we now have 5 documents and should trigger analysis
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("family_id", data.familyId);

      if (count === 5) {
        // Check if analysis hasn't been run yet
        const { data: familyData } = await supabase
          .from("families")
          .select("initial_doc_analysis_status")
          .eq("id", data.familyId)
          .single();

        if (familyData?.initial_doc_analysis_status === "pending") {
          toast.info("Analyzing your documents to personalize your dashboard...");
          
          // Trigger the first-look-analysis
          const { error: analysisError } = await supabase.functions.invoke(
            "first-look-analysis",
            { body: { family_id: data.familyId } }
          );

          if (analysisError) {
            console.error("Analysis error:", analysisError);
            toast.error("Document analysis failed. You can retry from Settings.");
          } else {
            toast.success("Analysis complete! Check out your personalized charts in Analytics.");
            queryClient.invalidateQueries({ queryKey: ["families"] });
          }
        }
      }

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
