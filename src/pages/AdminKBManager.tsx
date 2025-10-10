import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, PlayCircle, Loader2, Book, Brain, Plus, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 15;

export default function AdminKBManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Academic sources state
  const [selectedAcademicSources, setSelectedAcademicSources] = useState<string[]>(["pubmed"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueries, setSearchQueries] = useState<string[]>(["autism", "adhd"]);

  // Web scraping state
  const [selectedWebSources, setSelectedWebSources] = useState<string[]>([]);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>("all");

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

  // Fetch total documents count
  const { data: documentsCount = 0 } = useQuery({
    queryKey: ["kb-documents-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin === true,
  });

  // Fetch total embeddings count
  const { data: embeddingsCount = 0 } = useQuery({
    queryKey: ["kb-chunks-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("kb_chunks")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin === true,
  });

  // Fetch knowledge base documents with filters
  const { data: kbDocuments, isLoading: loadingDocs } = useQuery({
    queryKey: ["knowledge-base", sourceFilter, focusAreaFilter],
    queryFn: async () => {
      let query = supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false });

      if (sourceFilter !== "all") {
        query = query.eq("source_name", sourceFilter);
      }

      if (focusAreaFilter !== "all") {
        query = query.contains("focus_areas", [focusAreaFilter]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Get unique sources and focus areas for filters
  const uniqueSources = [...new Set(kbDocuments?.map(doc => doc.source_name) || [])];
  const uniqueFocusAreas = [
    ...new Set(kbDocuments?.flatMap(doc => doc.focus_areas || []) || [])
  ];

  // Pagination
  const totalPages = Math.ceil((kbDocuments?.length || 0) / ITEMS_PER_PAGE);
  const paginatedDocuments = kbDocuments?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Academic ingestion mutation
  const runAcademicIngestionMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("ingest-academic-sources", {
        body: {
          sources: selectedAcademicSources,
          queries: searchQueries,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      queryClient.invalidateQueries({ queryKey: ["kb-documents-count"] });
      queryClient.invalidateQueries({ queryKey: ["kb-chunks-count"] });
      toast.success("Academic sources ingestion completed successfully");
    },
    onError: (error: any) => {
      toast.error("Academic ingestion failed: " + error.message);
    },
  });

  // Web scraping mutation
  const runWebScrapingMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-web-sources", {
        body: { sources: selectedWebSources },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      queryClient.invalidateQueries({ queryKey: ["kb-documents-count"] });
      queryClient.invalidateQueries({ queryKey: ["kb-chunks-count"] });
      toast.success("Web scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("Web scraping failed: " + error.message);
    },
  });

  const addSearchQuery = () => {
    if (searchQuery.trim() && !searchQueries.includes(searchQuery.trim())) {
      setSearchQueries([...searchQueries, searchQuery.trim()]);
      setSearchQuery("");
    }
  };

  const removeSearchQuery = (query: string) => {
    setSearchQueries(searchQueries.filter(q => q !== query));
  };

  const toggleAcademicSource = (source: string) => {
    setSelectedAcademicSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const toggleWebSource = (source: string) => {
    setSelectedWebSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

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

  const isAnyRunning = runAcademicIngestionMutation.isPending || runWebScrapingMutation.isPending;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Knowledge Base Command Center
        </h1>
        <p className="text-muted-foreground">
          Manage and ingest evidence-based resources from academic and clinical sources
        </p>
      </div>

      {/* Section 1: Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Knowledge Base Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Documents */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-3xl font-bold">{documentsCount.toLocaleString()}</p>
              </div>
            </div>

            {/* Total Embeddings */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Embeddings</p>
                <p className="text-3xl font-bold">{embeddingsCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Academic Databases */}
      <Card>
        <CardHeader>
          <CardTitle>Ingest from Academic Databases</CardTitle>
          <CardDescription>
            Search and import research articles from academic sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Source Selection */}
          <div>
            <Label className="mb-2 block">Academic Sources</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pubmed"
                  checked={selectedAcademicSources.includes("pubmed")}
                  onCheckedChange={() => toggleAcademicSource("pubmed")}
                />
                <label htmlFor="pubmed" className="text-sm font-medium cursor-pointer">
                  PubMed
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="semantic-scholar"
                  checked={selectedAcademicSources.includes("semantic-scholar")}
                  onCheckedChange={() => toggleAcademicSource("semantic-scholar")}
                  disabled
                />
                <label htmlFor="semantic-scholar" className="text-sm font-medium text-muted-foreground cursor-not-allowed">
                  Semantic Scholar (Coming Soon)
                </label>
              </div>
            </div>
          </div>

          {/* Search Queries */}
          <div>
            <Label htmlFor="search-query">Search Queries</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="search-query"
                placeholder="e.g., autism social skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSearchQuery()}
              />
              <Button onClick={addSearchQuery} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Query List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQueries.map((query) => (
                <Badge key={query} variant="secondary" className="gap-2">
                  {query}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSearchQuery(query)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Start Ingestion Button */}
          <Button
            onClick={() => runAcademicIngestionMutation.mutate()}
            disabled={isAnyRunning || selectedAcademicSources.length === 0 || searchQueries.length === 0}
            className="w-full"
          >
            {runAcademicIngestionMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Start Academic Ingestion
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: Web Scraping */}
      <Card>
        <CardHeader>
          <CardTitle>Scrape Clinical Guidelines & Educational Resources</CardTitle>
          <CardDescription>
            Import content from government agencies and professional organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Government & Educational Agencies */}
          <div>
            <Label className="mb-2 block font-semibold">Government & Educational Agencies</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["cdc", "idea", "osep", "wwc"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={selectedWebSources.includes(source)}
                    onCheckedChange={() => toggleWebSource(source)}
                    disabled={source !== "cdc" && source !== "wwc" && source !== "aap"}
                  />
                  <label
                    htmlFor={source}
                    className={`text-sm font-medium cursor-pointer ${
                      source !== "cdc" && source !== "wwc" && source !== "aap"
                        ? "text-muted-foreground cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {source.toUpperCase()}
                    {source !== "cdc" && source !== "wwc" && source !== "aap" && " (Coming Soon)"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Organizations */}
          <div>
            <Label className="mb-2 block font-semibold">Professional Organizations</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["bacb", "nas", "aap", "cec"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={selectedWebSources.includes(source)}
                    onCheckedChange={() => toggleWebSource(source)}
                    disabled={source !== "cdc" && source !== "wwc" && source !== "aap"}
                  />
                  <label
                    htmlFor={source}
                    className={`text-sm font-medium cursor-pointer ${
                      source !== "cdc" && source !== "wwc" && source !== "aap"
                        ? "text-muted-foreground cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {source.toUpperCase()}
                    {source !== "cdc" && source !== "wwc" && source !== "aap" && " (Coming Soon)"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Start Scraping Button */}
          <Button
            onClick={() => runWebScrapingMutation.mutate()}
            disabled={isAnyRunning || selectedWebSources.length === 0}
            className="w-full"
          >
            {runWebScrapingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Start Web Scraping
          </Button>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Knowledge Base Documents
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label htmlFor="source-filter" className="text-sm">Filter by Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger id="source-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="focus-filter" className="text-sm">Filter by Focus Area</Label>
              <Select value={focusAreaFilter} onValueChange={setFocusAreaFilter}>
                <SelectTrigger id="focus-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Focus Areas</SelectItem>
                  {uniqueFocusAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingDocs ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          ) : !kbDocuments || kbDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No documents match your filters</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or start ingesting content
              </p>
            </div>
          ) : (
            <>
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
                  {paginatedDocuments?.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{doc.title || "—"}</div>
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
                      <TableCell className="text-sm">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, kbDocuments.length)} of{" "}
                    {kbDocuments.length} documents
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}