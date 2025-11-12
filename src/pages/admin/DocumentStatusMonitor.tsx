import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Play,
  Trash2,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Download
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { DocumentStatusCard } from "@/components/admin/DocumentStatusCard";
import { PipelineHealthCheck } from "@/components/admin/PipelineHealthCheck";

export default function DocumentStatusMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [liveDocuments, setLiveDocuments] = useState<any[]>([]);

  // Fetch all documents with status
  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ["admin-documents", statusFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select(`
          id,
          file_name,
          file_size_kb,
          file_type,
          category,
          created_at,
          updated_at,
          extracted_content,
          metadata,
          family_id,
          families (
            family_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (statusFilter !== "all") {
        query = query.eq("metadata->>extraction_status", statusFilter);
      }

      if (searchQuery) {
        query = query.ilike("file_name", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Real-time subscription to document updates
  useEffect(() => {
    const channel = supabase
      .channel('document-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('📡 Real-time update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setLiveDocuments(prev => {
              const updated = prev.map(doc => 
                doc.id === payload.new.id ? { ...doc, ...payload.new } : doc
              );
              if (!updated.find(doc => doc.id === payload.new.id)) {
                updated.unshift(payload.new);
              }
              return updated;
            });
            
            // Show toast for status changes
            const newStatus = payload.new.metadata?.extraction_status;
            if (newStatus) {
              const statusMessages: Record<string, string> = {
                completed: '✅ Extraction completed',
                failed: '❌ Extraction failed',
                processing: '⏳ Processing started',
                analyzing: '🧠 Analysis in progress'
              };
              
              if (statusMessages[newStatus]) {
                toast.success(statusMessages[newStatus], {
                  description: payload.new.file_name
                });
              }
            }
          }
          
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Merge real-time updates with query data
  const displayDocuments = documents || liveDocuments;

  // Calculate statistics
  const stats = {
    total: displayDocuments.length,
    pending: displayDocuments.filter(d => !d.metadata?.extraction_status || d.metadata.extraction_status === 'pending').length,
    processing: displayDocuments.filter(d => ['triggering', 'retrying', 'processing'].includes(d.metadata?.extraction_status)).length,
    completed: displayDocuments.filter(d => d.metadata?.extraction_status === 'completed').length,
    failed: displayDocuments.filter(d => d.metadata?.extraction_status === 'failed').length,
  };

  const handleRetry = async (documentId: string) => {
    try {
      toast.loading('Retrying extraction...', { id: documentId });
      
      const { error } = await supabase.functions.invoke('extract-text-with-vision', {
        body: { document_id: documentId, force_re_extract: true }
      });

      if (error) throw error;
      
      toast.success('Extraction retry initiated', { id: documentId });
      refetch();
    } catch (error) {
      console.error('Retry error:', error);
      toast.error('Failed to retry extraction', { id: documentId });
    }
  };

  const handleAnalyze = async (documentId: string) => {
    try {
      toast.loading('Starting analysis...', { id: `analyze-${documentId}` });
      
      const { error } = await supabase.functions.invoke('analyze-document', {
        body: { document_id: documentId }
      });

      if (error) throw error;
      
      toast.success('Analysis started', { id: `analyze-${documentId}` });
      refetch();
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to start analysis', { id: `analyze-${documentId}` });
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast.success('Document deleted');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const getStatusBadge = (metadata: any) => {
    const status = metadata?.extraction_status || 'pending';
    const variants: Record<string, any> = {
      pending: { variant: "outline", icon: Clock, text: "Pending" },
      triggering: { variant: "secondary", icon: Activity, text: "Triggering" },
      retrying: { variant: "secondary", icon: RefreshCw, text: "Retrying" },
      completed: { variant: "default", icon: CheckCircle2, text: "Completed" },
      failed: { variant: "destructive", icon: XCircle, text: "Failed" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Status Monitor</h1>
          <p className="text-muted-foreground">Real-time extraction and analysis tracking</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Pipeline Health Check */}
      <PipelineHealthCheck />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="triggering">Triggering</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Showing {displayDocuments.length} documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[300px]">{doc.file_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.families?.family_name || 'N/A'}</TableCell>
                  <TableCell>{doc.file_size_kb} KB</TableCell>
                  <TableCell>{getStatusBadge(doc.metadata)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {doc.metadata?.extraction_attempts && (
                        <div>Attempts: {doc.metadata.extraction_attempts}</div>
                      )}
                      {doc.metadata?.extraction_final_error && (
                        <div className="text-red-600 truncate max-w-[200px]">
                          {doc.metadata.extraction_final_error}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {doc.metadata?.extraction_status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(doc.id)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      {doc.metadata?.extraction_status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAnalyze(doc.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {displayDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
