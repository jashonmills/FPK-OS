import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminKBManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRunningIngestion, setIsRunningIngestion] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch knowledge base documents
  const { data: kbDocuments, isLoading: loadingDocs } = useQuery({
    queryKey: ["knowledge-base"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  const runIngestionMutation = useMutation({
    mutationFn: async () => {
      setIsRunningIngestion(true);
      const { data, error } = await supabase.functions.invoke("ingest-pubmed", {
        body: { focus_areas: ["autism", "adhd"] },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast.success("Knowledge base ingestion completed successfully");
    },
    onError: (error: any) => {
      toast.error("Ingestion failed: " + error.message);
    },
    onSettled: () => {
      setIsRunningIngestion(false);
    },
  });

  if (checkingAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access this page.
          </p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base Manager</h1>
            <p className="text-muted-foreground">Admin-only area for managing evidence-based resources</p>
          </div>
          <Button
            onClick={() => runIngestionMutation.mutate()}
            disabled={isRunningIngestion}
          >
            {isRunningIngestion ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Ingestion...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Run PubMed Ingestion
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Knowledge Base Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : !kbDocuments || kbDocuments.length === 0 ? (
              <div className="text-center py-12">
                <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No documents in knowledge base yet</p>
                <Button onClick={() => runIngestionMutation.mutate()}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run First Ingestion
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Focus Areas</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Publication Date</TableHead>
                    <TableHead>Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kbDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {doc.title || "—"}
                      </TableCell>
                      <TableCell className="text-sm">{doc.source_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {doc.focus_areas?.map((area: string) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.document_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {doc.publication_date
                          ? format(new Date(doc.publication_date), "MMM yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(doc.created_at), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
