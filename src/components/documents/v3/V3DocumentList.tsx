import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { V3AnalyzeButton } from './V3AnalyzeButton';

interface V3Document {
  id: string;
  file_name: string;
  category: string | null;
  status: string;
  file_size_kb: number;
  created_at: string;
  is_classified: boolean;
  classified_at: string | null;
  classified_by: string | null;
  error_message?: string | null;
}

interface V3DocumentListProps {
  familyId: string;
  studentId?: string;
}

export function V3DocumentList({ familyId, studentId }: V3DocumentListProps) {
  const [documents, setDocuments] = useState<V3Document[]>([]);
  const [loading, setLoading] = useState(true);

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
      setDocuments(data || []);
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
    <div className="space-y-3">
      {documents.map((doc) => (
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

                  {/* Analyze button for classified documents */}
                  {doc.is_classified && (
                    <div className="mt-3">
                      <V3AnalyzeButton 
                        document={doc} 
                        onAnalysisStarted={fetchDocuments}
                      />
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
              {getStatusBadge(doc.status)}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
