import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface V3Document {
  id: string;
  file_name: string;
  category: string;
  status: string;
  file_size_kb: number;
  created_at: string;
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      uploaded: { variant: 'secondary', label: 'Uploaded' },
      extracting: { variant: 'default', label: 'Extracting...' },
      analyzing: { variant: 'default', label: 'Analyzing...' },
      completed: { variant: 'default', label: 'Completed' },
      failed: { variant: 'destructive', label: 'Failed' }
    };

    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
        <Card key={doc.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <CardTitle className="text-base font-medium">{doc.file_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(doc.created_at), 'MMM d, yyyy')}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{doc.file_size_kb}KB</span>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                  </div>
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
