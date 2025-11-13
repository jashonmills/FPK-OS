import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2, AlertCircle, CheckCircle2, BarChart3, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { V3AnalyzeButton } from './V3AnalyzeButton';
import { V3DeleteButton } from './V3DeleteButton';
import { DocumentViewerModal } from '../DocumentViewerModal';
import { V3DocumentReportModal } from './V3DocumentReportModal';

interface V3Document {
  id: string;
  file_name: string;
  file_path: string;
  category: string | null;
  status: string;
  file_size_kb: number;
  created_at: string;
  is_classified: boolean;
  classified_at: string | null;
  classified_by: string | null;
  error_message?: string | null;
  file_type?: string; // Computed from file_name
}

interface V3DocumentListProps {
  familyId: string;
  studentId?: string;
}

export function V3DocumentList({ familyId, studentId }: V3DocumentListProps) {
  const [documents, setDocuments] = useState<V3Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<V3Document | null>(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('v3-documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'v3_documents',
          filter: studentId 
            ? `family_id=eq.${familyId},student_id=eq.${studentId}`
            : `family_id=eq.${familyId}`
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [familyId, studentId]);

  const fetchDocuments = async () => {
    try {
      let query = supabase
        .from('v3_documents')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Add file_type based on file_name extension
      const documentsWithType = (data || []).map(doc => ({
        ...doc,
        file_type: doc.file_name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'
      }));
      
      setDocuments(documentsWithType);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      IEP: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      BIP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      FBA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Progress_Report: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Evaluation_Report: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      '504_Plan': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      Medical_Record: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Incident_Report: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      General_Document: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };

    const label = category.replace(/_/g, ' ');
    const colorClass = categoryColors[category] || categoryColors.General_Document;

    return (
      <Badge variant="outline" className={`${colorClass} border-0 font-medium`}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon?: React.ReactNode }> = {
      uploaded: { 
        variant: 'secondary', 
        label: 'Ready for Analysis',
      },
      extracting: { 
        variant: 'default', 
        label: 'Extracting Text...',
        icon: <Loader2 className="h-3 w-3 animate-spin" />
      },
      analyzing: { 
        variant: 'default', 
        label: 'AI Analysis in Progress...',
        icon: <Loader2 className="h-3 w-3 animate-spin" />
      },
      completed: { 
        variant: 'secondary', 
        label: 'Analysis Complete',
        icon: <CheckCircle2 className="h-3 w-3 text-green-600" />
      },
      failed: { 
        variant: 'destructive', 
        label: 'Analysis Failed',
        icon: <AlertCircle className="h-3 w-3" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.uploaded;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1.5">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const openReport = (doc: V3Document) => {
    setSelectedDocument(doc);
    setReportOpen(true);
  };

  const openViewer = (doc: V3Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  // Filter and search logic
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = doc.file_name.toLowerCase().includes(query);
      const matchesCategory = doc.category?.toLowerCase().includes(query);
      if (!matchesName && !matchesCategory) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && doc.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Get unique categories and statuses for filters
  const uniqueCategories = Array.from(new Set(documents.map(d => d.category).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(documents.map(d => d.status)));

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || statusFilter !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No documents yet</p>
            <p className="text-sm">Upload your first document to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category!}>
                    {category?.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No documents found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
        <Card key={doc.id} className={!doc.is_classified ? 'border-amber-200 dark:border-amber-800' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">{doc.file_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{doc.file_size_kb}KB</span>
                        {doc.is_classified && doc.category && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            {getCategoryBadge(doc.category)}
                          </>
                        )}
                      </div>

                      {/* Classification UI for unclassified documents */}
                      {!doc.is_classified && (
                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                Classification Required
                              </p>
                              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                                Please classify this document before analysis can begin
                              </p>
                            </div>
                          </div>
                          <DocumentTypeSelector 
                            documentId={doc.id} 
                            onClassified={fetchDocuments}
                          />
                        </div>
                      )}

                      {/* Action buttons for classified documents */}
                      {doc.is_classified && (
                        <div className="flex items-center gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openViewer(doc)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View PDF
                          </Button>
                          
                          <V3AnalyzeButton 
                            document={doc} 
                            onAnalysisStarted={fetchDocuments}
                          />
                          
                          {doc.status === 'completed' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => openReport(doc)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Report
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Error message for failed analyses */}
                      {doc.status === 'failed' && doc.error_message && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {doc.error_message}
                        </div>
                      )}

                      {/* Classified document info */}
                      {doc.is_classified && doc.classified_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Classified {format(new Date(doc.classified_at), 'MMM d, yyyy \'at\' h:mm a')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    {getStatusBadge(doc.status)}
                    <V3DeleteButton
                      documentId={doc.id}
                      documentName={doc.file_name}
                      onDeleted={fetchDocuments}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          document={selectedDocument}
        />
      )}

      {/* Report Modal */}
      {selectedDocument && (
        <V3DocumentReportModal
          open={reportOpen}
          onOpenChange={setReportOpen}
          documentId={selectedDocument.id}
          familyId={familyId}
          studentId={studentId}
          onOpenPdfViewer={() => {
            setReportOpen(false);
            setViewerOpen(true);
          }}
        />
      )}
    </div>
  );
}
