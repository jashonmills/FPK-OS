import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const runPubMedMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("ingest-pubmed", {
        body: { focus_areas: ["autism", "adhd"] },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast.success("PubMed ingestion completed successfully");
    },
    onError: (error: any) => {
      toast.error("PubMed ingestion failed: " + error.message);
    },
  });

  const runCDCMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-cdc-content");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast.success("CDC content scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("CDC scraping failed: " + error.message);
    },
  });

  const runAAPMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-aap-content");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast.success("AAP content scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("AAP scraping failed: " + error.message);
    },
  });

  const runWWCMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-wwc-content");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast.success("WWC content scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("WWC scraping failed: " + error.message);
    },
  });

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const isAnyRunning = runPubMedMutation.isPending || runCDCMutation.isPending || 
                       runAAPMutation.isPending || runWWCMutation.isPending;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base Manager</h1>
        <p className="text-muted-foreground">Admin-only area for managing evidence-based resources</p>
      </div>

      {/* Ingestion Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => runPubMedMutation.mutate()}
          disabled={isAnyRunning}
          variant="outline"
        >
          {runPubMedMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          PubMed
        </Button>
        
        <Button
          onClick={() => runCDCMutation.mutate()}
          disabled={isAnyRunning}
          variant="outline"
        >
          {runCDCMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          CDC
        </Button>

        <Button
          onClick={() => runAAPMutation.mutate()}
          disabled={isAnyRunning}
          variant="outline"
        >
          {runAAPMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          AAP
        </Button>

        <Button
          onClick={() => runWWCMutation.mutate()}
          disabled={isAnyRunning}
          variant="outline"
        >
          {runWWCMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          WWC
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
              <p className="text-sm text-muted-foreground">
                Click one of the buttons above to start ingesting content
              </p>
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
  );
}
