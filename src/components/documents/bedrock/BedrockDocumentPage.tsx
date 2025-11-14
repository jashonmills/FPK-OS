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
import { Upload, Loader2, Sparkles, Eye, Download, Trash2, RefreshCw, CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';
import { ReAnalysisButton } from '../ReAnalysisButton';
import { DocumentViewerModal } from '@/components/documents/DocumentViewerModal';
import { DocumentStatistics } from './DocumentStatistics';
import { Checkbox } from '@/components/ui/checkbox';
// import { ProcessingHistoryTimeline } from './ProcessingHistoryTimeline';
import { DocumentFilters } from './DocumentFilters';
import { useMemo } from 'react';
import { OracleRecommendation } from './OracleRecommendation';

// Elite Classification System - Full Catalog
export const DOCUMENT_TYPE_CATEGORIES = {
  educational_planning: {
    label: "📚 Educational & Planning",
    types: [
      { value: 'iep', label: 'IEP (Individualized Education Program)', processorKey: 'IEP' },
      { value: 'iep_amendment', label: 'IEP Amendment', processorKey: 'IEP' },
      { value: 'iep_annual_review', label: 'IEP Annual Review', processorKey: 'IEP' },
      { value: '504_plan', label: '504 Plan', processorKey: 'General' },
      { value: 'transition_plan', label: 'Transition Plan', processorKey: 'General' },
      { value: 'rti', label: 'RTI/MTSS Document', processorKey: 'General' },
    ]
  },
  behavioral: {
    label: "🧠 Behavioral",
    types: [
      { value: 'bip', label: 'Behavior Intervention Plan (BIP)', processorKey: 'BIP' },
      { value: 'fba', label: 'Functional Behavior Assessment (FBA)', processorKey: 'FBA' },
      { value: 'incident_log', label: 'Incident/Behavior Log', processorKey: 'General' },
    ]
  },
  assessments: {
    label: "📊 Assessments & Evaluations",
    types: [
      { value: 'psych_eval', label: 'Psychoeducational Evaluation', processorKey: 'Evaluation_Report' },
      { value: 'triennial_eval', label: 'Triennial Evaluation', processorKey: 'Evaluation_Report' },
      { value: 'speech_eval', label: 'Speech-Language Evaluation', processorKey: 'General' },
      { value: 'ot_eval', label: 'Occupational Therapy Evaluation', processorKey: 'General' },
      { value: 'pt_eval', label: 'Physical Therapy Evaluation', processorKey: 'General' },
      { value: 'vision_eval', label: 'Vision Therapy Assessment', processorKey: 'General' },
      { value: 'audiology', label: 'Audiology Report', processorKey: 'General' },
      { value: 'assistive_tech', label: 'Assistive Technology Evaluation', processorKey: 'General' },
    ]
  },
  medical_insurance: {
    label: "🏥 Medical & Insurance",
    types: [
      { value: 'eob', label: 'Explanation of Benefits (EOB)', processorKey: 'EOB' },
      { value: 'medical_justification', label: 'Letter of Medical Necessity', processorKey: 'Medical_Justification' },
      { value: 'hospital_discharge', label: 'Hospital Discharge Summary', processorKey: 'General' },
      { value: 'medication_log', label: 'Medication Log', processorKey: 'General' },
    ]
  },
  progress_tracking: {
    label: "📈 Progress & Reports",
    types: [
      { value: 'progress_report', label: 'Progress Report', processorKey: 'General' },
      { value: 'report_card', label: 'Report Card', processorKey: 'General' },
      { value: 'standardized_test', label: 'Standardized Test Results', processorKey: 'General' },
      { value: 'classroom_observation', label: 'Classroom Observation', processorKey: 'General' },
    ]
  },
  general: {
    label: "📄 General & Forms",
    types: [
      { value: 'other', label: 'General Document (OCR)', processorKey: 'General' },
      { value: 'form', label: 'Form or Table', processorKey: 'Form/Table' },
      { value: 'layout', label: 'Complex Layout Document', processorKey: 'Layout' },
    ]
  }
};

// Google Cloud Document AI Processor Mapping
const PROCESSOR_MAPPING: Record<string, string> = {
  // --- General & Foundational Processors ---
  'General': 'projects/729195776641/locations/us/processors/9a2c8ed98e2c75bc', // bedrock-ocr-v2
  'Form/Table': 'projects/729195776641/locations/us/processors/67a01c2d52e6af65', // bedrock-form-parser
  'Layout': 'projects/729195776641/locations/us/processors/cb205a77bf9a675e', // bedrock-layouts-parser

  // --- Elite Specialist Processors ---
  'IEP': 'projects/729195776641/locations/us/processors/e0dcf69b05bd5c40', // bedrock-iep-extractor
  'BIP': 'projects/729195776641/locations/us/processors/3246c7dc6daa6b21', // BIP-Extractor
  'FBA': 'projects/729195776641/locations/us/processors/d9afe8adcd9cc5a1', // FBA-Extractor
  'Evaluation_Report': 'projects/729195776641/locations/us/processors/e1dda0d5caba1c9c', // Evaluation-Report-Extractor
  'EOB': 'projects/729195776641/locations/us/processors/32106d0a847a365e', // EOB-Extractor

  // --- Fireteam (Shared) Processors ---
  'Medical_Justification': 'projects/729195776641/locations/us/processors/4e3b8ad1ca4959c5', // Medical-Justification-Parser
};

// Helper function to resolve processor ID from document type
function getProcessorId(docType: string): string | undefined {
  for (const category of Object.values(DOCUMENT_TYPE_CATEGORIES)) {
    const typeConfig = category.types.find(t => t.value === docType);
    if (typeConfig?.processorKey) {
      return PROCESSOR_MAPPING[typeConfig.processorKey];
    }
  }
  return PROCESSOR_MAPPING['General'];
}

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
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [batchCategory, setBatchCategory] = useState('');
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);
  
  // Filters and sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
      const processorId = getProcessorId(newCategory);

      console.log('🔄 Re-analyzing:', {
        documentId: doc.id,
        oldCategory: doc.category,
        newCategory: newCategory,
        processorId: processorId
      });

      await supabase.functions.invoke('bedrock-analyze', {
        body: { 
          document_id: doc.id,
          category: newCategory,
          processor_id: processorId,
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      toast.success(`Re-analyzing as "${newCategory}"`);
      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });
    } catch (error: any) {
      toast.error(error.message || 'Re-analysis failed');
    } finally {
      setAnalyzingDoc(null);
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.size === documents?.length) {
      setSelectedDocIds(new Set());
    } else {
      setSelectedDocIds(new Set(documents?.map(d => d.id) || []));
    }
  };

  const handleBatchReAnalyze = async () => {
    if (selectedDocIds.size === 0) {
      toast.error('Please select documents to re-classify');
      return;
    }
    if (!batchCategory) {
      toast.error('Please select a category for re-classification');
      return;
    }

    setBatchAnalyzing(true);
    const toastId = toast.loading(`Re-classifying ${selectedDocIds.size} documents...`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const processorId = getProcessorId(batchCategory);
      let successCount = 0;
      let failCount = 0;

      for (const docId of selectedDocIds) {
        try {
          await supabase.functions.invoke('bedrock-analyze', {
            body: { 
              document_id: docId,
              category: batchCategory,
              processor_id: processorId,
            },
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to re-analyze ${docId}:`, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Re-classified ${successCount} document${successCount > 1 ? 's' : ''} as "${batchCategory}"`,
          { id: toastId }
        );
      }
      if (failCount > 0) {
        toast.error(`${failCount} document${failCount > 1 ? 's' : ''} failed`, { id: toastId });
      }

      queryClient.invalidateQueries({ queryKey: ['bedrock-documents'] });
      setSelectedDocIds(new Set());
      setBatchCategory('');
    } catch (error: any) {
      toast.error(error.message || 'Batch re-classification failed', { id: toastId });
    } finally {
      setBatchAnalyzing(false);
    }
  };

  // Apply filters and sorting
  const filteredAndSortedDocuments = useMemo(() => {
    if (!documents) return [];

    let filtered = [...documents];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    // Apply date range filter
    if (dateFromFilter) {
      filtered = filtered.filter(doc => 
        new Date(doc.created_at) >= new Date(dateFromFilter)
      );
    }
    if (dateToFilter) {
      filtered = filtered.filter(doc => 
        new Date(doc.created_at) <= new Date(dateToFilter)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle null values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Convert to comparable values
      if (sortBy === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, statusFilter, categoryFilter, dateFromFilter, dateToFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFromFilter('');
    setDateToFilter('');
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

      {/* Statistics Dashboard */}
      {documents && documents.length > 0 && (
        <DocumentStatistics documents={documents} />
      )}

      {/* Processing History Timeline - Temporarily disabled due to type issues */}
      {/* {selectedFamily?.id && selectedStudent?.id && (
        <ProcessingHistoryTimeline 
          familyId={selectedFamily.id}
          studentId={selectedStudent.id}
        />
      )} */}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* FPK-X Oracle Recommendation */}
          <OracleRecommendation
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              toast.success('✨ Oracle selected category for you!');
            }}
            currentCategory={selectedCategory}
          />

          <div>
            <label className="text-sm font-medium mb-2 block">Document Type</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {Object.entries(DOCUMENT_TYPE_CATEGORIES).map(([categoryKey, category]) => (
                  <div key={categoryKey}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category.label}
                    </div>
                    {category.types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Your Documents</CardTitle>
            <div className="flex items-center gap-2">
              <ReAnalysisButton familyId={selectedFamily.id} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {documents && documents.length > 0 && (
            <div className="mb-4">
              <DocumentFilters
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                dateFromFilter={dateFromFilter}
                dateToFilter={dateToFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onStatusFilterChange={setStatusFilter}
                onCategoryFilterChange={setCategoryFilter}
                onDateFromFilterChange={setDateFromFilter}
                onDateToFilterChange={setDateToFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredAndSortedDocuments && filteredAndSortedDocuments.length > 0 ? (
            <div className="space-y-3">
              {/* Batch Actions Bar */}
              {selectedDocIds.size > 0 && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedDocIds.size} selected</Badge>
                  </div>
                  <Select value={batchCategory} onValueChange={setBatchCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select new category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {Object.entries(DOCUMENT_TYPE_CATEGORIES).map(([categoryKey, category]) => (
                        <div key={categoryKey}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {category.label}
                          </div>
                          {category.types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleBatchReAnalyze}
                    disabled={batchAnalyzing || !batchCategory}
                    size="sm"
                  >
                    {batchAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Re-classifying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-classify Selected
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setSelectedDocIds(new Set())}
                    variant="ghost"
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}

              {/* Select All Header */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Checkbox
                  checked={selectedDocIds.size === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all documents"
                />
                <span className="text-sm font-medium">
                  {selectedDocIds.size === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0 
                    ? 'Deselect All' 
                    : 'Select All'}
                </span>
              </div>

              {filteredAndSortedDocuments.map((doc: any) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={selectedDocIds.has(doc.id)}
                    onCheckedChange={() => toggleDocSelection(doc.id)}
                    aria-label={`Select ${doc.file_name}`}
                  />
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
                      <SelectContent className="max-h-[400px]">
                        {Object.entries(DOCUMENT_TYPE_CATEGORIES).map(([categoryKey, category]) => (
                          <div key={categoryKey}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {category.label}
                            </div>
                            {category.types.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </div>
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
