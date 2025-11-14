import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { toast } from 'sonner';
import { Upload, Loader2, Sparkles, Eye, Download, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ReAnalysisButton } from '../ReAnalysisButton';
import { DocumentViewerModal } from '@/components/documents/DocumentViewerModal';

// Phase 3: Document categories for intelligent routing
const DOCUMENT_CATEGORIES = [
  { value: 'other', label: 'General Document (OCR)', description: 'Standard text extraction for most documents' },
  { value: 'form', label: 'Form or Table', description: 'Optimized for forms, tables, and structured data' },
  { value: 'layout', label: 'Layout Analysis', description: 'Preserves complex layouts and formatting' },
  { value: 'iep', label: 'IEP (Specialized)', description: 'Specialized processor for IEP documents' },
];

// Legacy categories for document classification (post-upload)
const LEGACY_CATEGORIES = [
  { value: 'iep', label: 'IEP (Individualized Education Program)' },
  { value: 'progress_report', label: 'Progress Report' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'other', label: 'Other' },
];

export function BedrockDocumentPage() {
  const { selectedFamily, selectedStudent } = useFamily();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [documentCategories, setDocumentCategories] = useState<Record<string, string>>({});
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState<string | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<any>(null);
  const [viewerDocument, setViewerDocument] = useState<any>(null);

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['bedrock-documents', selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase
        .from('bedrock_documents')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  const handleUpload = async (file: File) => {
    if (!selectedFamily?.id || !selectedStudent?.id) {
      toast.error('Please select a family and student first');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading and extracting text...');

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      // Call atomic upload function (v2 with intelligent routing)
      const { data, error } = await supabase.functions.invoke('bedrock-upload-v2', {
        body: {
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          file_name: file.name,
          file_data_base64: base64,
          category: selectedCategory
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Upload failed');

      toast.success(
        `✅ ${file.name} uploaded! Extracted ${data.extracted_length} characters.`,
        { id: toastId }
      );

      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });

    } catch (error: any) {
      toast.error(error.message || 'Upload failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (doc: any) => {
    setViewerDocument(doc);
  };

  const handleDownloadDocument = async (doc: any) => {
    try {
      setDownloadingDoc(doc.id);
      const { data, error } = await supabase.storage
        .from('bedrock-storage')
        .createSignedUrl(doc.file_path, 3600);
      
      if (error) throw error;
      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = doc.file_name || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      toast.error(error.message || 'Could not download document');
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleDeleteDocument = async (doc: any) => {
    try {
      setDeletingDoc(doc.id);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase.functions.invoke('bedrock-delete-document', {
        body: { document_id: doc.id },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;

      toast.success('Document deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });
      setDeleteConfirmDoc(null);
    } catch (error: any) {
      toast.error(error.message || 'Could not delete document');
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleReAnalyze = async (doc: any) => {
    try {
      setAnalyzingDoc(doc.id);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const newCategory = documentCategories[doc.id] || doc.category;

      await supabase.functions.invoke('bedrock-analyze', {
        body: { 
          document_id: doc.id,
          category: newCategory
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      toast.success(`Re-analysis started for "${newCategory}" category`);
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });
    } catch (error: any) {
      toast.error(error.message || 'Re-analysis failed');
    } finally {
      setAnalyzingDoc(null);
    }
  };

  if (!selectedFamily?.id || !selectedStudent?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          Please select a family and student to manage documents.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bedrock Documents</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage educational documents
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Document Type</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {DOCUMENT_CATEGORIES.find(c => c.value === selectedCategory)?.description}
            </p>
          </div>

          <Input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            disabled={uploading}
            className="cursor-pointer"
          />

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing document...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Documents</CardTitle>
            <ReAnalysisButton familyId={selectedFamily.id} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.file_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                      <span>{format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                      {doc.category && (
                        <>
                          <span>•</span>
                          <Badge variant="outline">{doc.category}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Category Selector */}
                    <Select 
                      value={documentCategories[doc.id] || doc.category || 'other'}
                      onValueChange={(value) => setDocumentCategories(prev => ({ ...prev, [doc.id]: value }))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label.split(' ')[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* View Button */}
                    <Button 
                      onClick={() => handleViewDocument(doc)} 
                      size="sm" 
                      variant="outline"
                      disabled={viewingDoc === doc.id}
                      title="View document"
                    >
                      {viewingDoc === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Download Button */}
                    <Button 
                      onClick={() => handleDownloadDocument(doc)} 
                      size="sm" 
                      variant="outline"
                      disabled={downloadingDoc === doc.id}
                      title="Download document"
                    >
                      {downloadingDoc === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Re-analyze Button */}
                    <Button 
                      onClick={() => handleReAnalyze(doc)} 
                      size="sm" 
                      variant="outline"
                      disabled={analyzingDoc === doc.id}
                      title="Re-analyze with selected category"
                    >
                      {analyzingDoc === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button 
                      onClick={() => setDeleteConfirmDoc(doc)} 
                      size="sm" 
                      variant="destructive"
                      disabled={deletingDoc === doc.id}
                      title="Delete document"
                    >
                      {deletingDoc === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Status Badge */}
                    <Badge variant={
                      doc.status === 'completed' ? 'default' :
                      doc.status === 'analyzing' ? 'secondary' :
                      doc.status === 'failed' ? 'destructive' : 'outline'
                    }>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No documents uploaded yet. Upload your first document above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmDoc} onOpenChange={(open) => !open && setDeleteConfirmDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{deleteConfirmDoc?.file_name}"? This action cannot be undone. 
              The document will be removed from both the database and storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmDoc && handleDeleteDocument(deleteConfirmDoc)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DocumentViewerModal
        open={!!viewerDocument}
        onOpenChange={(open) => !open && setViewerDocument(null)}
        document={viewerDocument}
      />
    </div>
  );
}
