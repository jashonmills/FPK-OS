import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { toast } from 'sonner';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { LegacyDataMigrationPanel } from '../LegacyDataMigrationPanel';
import { ReAnalysisButton } from '../ReAnalysisButton';

const DOCUMENT_CATEGORIES = [
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

      // Call atomic upload function (v2 with fresh environment)
      const { data, error } = await supabase.functions.invoke('bedrock-upload-v2', {
        body: {
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          file_name: file.name,
          file_data_base64: base64
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
      // Check for page limit error
      if (error.message?.includes('PAGE_LIMIT_EXCEEDED')) {
        const userMessage = error.message.replace('PAGE_LIMIT_EXCEEDED: ', '');
        toast.error(userMessage, { 
          id: toastId,
          duration: 8000 // Show longer for important message
        });
      } else {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${error.message}`, { id: toastId });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClassify = async (documentId: string, category: string) => {
    try {
      const { error } = await supabase
        .from('bedrock_documents')
        .update({ category })
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Document classified!');
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });
    } catch (error: any) {
      toast.error('Classification failed: ' + error.message);
    }
  };

  const handleAnalyze = async (documentId: string) => {
    const toastId = toast.loading('Analyzing document...');

    try {
      const { data, error } = await supabase.functions.invoke('bedrock-analyze', {
        body: { document_id: documentId }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Analysis failed');

      toast.success('✅ Analysis complete!', { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(`Analysis failed: ${error.message}`, { id: toastId });
    }
  };

  if (!selectedFamily || !selectedStudent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please select a family and student</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload, classify, and analyze your documents
          </p>
        </div>
        
        {/* Upload Button */}
        <div>
          <Input
            type="file"
            accept=".pdf"
            className="hidden"
            id="bedrock-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = ''; // Reset input
            }}
            disabled={uploading}
          />
          <Button
            onClick={() => document.getElementById('bedrock-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Legacy Data Migration Panel */}
      {selectedFamily?.id && (
        <LegacyDataMigrationPanel familyId={selectedFamily.id} />
      )}

      {/* Re-Analysis Button */}
      {selectedFamily?.id && selectedStudent?.id && (
        <div className="flex justify-end">
          <ReAnalysisButton 
            familyId={selectedFamily.id} 
            studentId={selectedStudent.id}
          />
        </div>
      )}

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No documents yet. Upload your first document above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Document Info */}
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.file_name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{doc.file_size_kb} KB</span>
                        {doc.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline">
                              {DOCUMENT_CATEGORIES.find(c => c.value === doc.category)?.label}
                            </Badge>
                          </>
                        )}
                      </div>
                      {doc.error_message && (
                        <p className="text-sm text-destructive mt-1">{doc.error_message}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      {doc.status === 'uploaded' && !doc.category && (
                        <Badge variant="secondary">Needs Classification</Badge>
                      )}
                      {doc.status === 'uploaded' && doc.category && (
                        <Badge variant="default">Ready for Analysis</Badge>
                      )}
                      {doc.status === 'analyzing' && (
                        <Badge variant="default">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Analyzing...
                        </Badge>
                      )}
                      {doc.status === 'completed' && (
                        <Badge variant="default" className="bg-green-500">
                          ✓ Completed
                        </Badge>
                      )}
                      {doc.status === 'failed' && (
                        <Badge variant="destructive">Failed</Badge>
                      )}

                      {/* Classify Selector (only if not classified) */}
                      {!doc.category && doc.status === 'uploaded' && (
                        <Select
                          onValueChange={(value) => handleClassify(doc.id, value)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {/* Analyze Button (only if classified and not completed) */}
                      {doc.category && doc.status !== 'analyzing' && doc.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => handleAnalyze(doc.id)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      )}

                      {/* Re-analyze if failed or completed */}
                      {doc.category && (doc.status === 'failed' || doc.status === 'completed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAnalyze(doc.id)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
