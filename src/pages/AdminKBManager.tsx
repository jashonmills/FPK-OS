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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, PlayCircle, Loader2, Book, Brain, Plus, X, TrendingUp, LayoutGrid, List, Table as TableIcon, ChevronDown, School, Users, Trash2, TestTube } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ScrapedResourcesModal } from "@/components/admin/ScrapedResourcesModal";
import { ClearKnowledgeBaseDialog } from "@/components/admin/ClearKnowledgeBaseDialog";

const ITEMS_PER_PAGE = 25;

// Color mapping for focus areas
const FOCUS_AREA_COLORS: Record<string, string> = {
  autism: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  adhd: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "evidence-based-interventions": "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  "special-education": "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
};

type ViewMode = "table" | "list" | "grid";

export default function AdminKBManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Academic sources state
  const [selectedAcademicSources, setSelectedAcademicSources] = useState<string[]>(["pubmed"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueries, setSearchQueries] = useState<string[]>(["autism", "adhd"]);

  // Web scraping state - split by tier
  const [selectedWebSources, setSelectedWebSources] = useState<string[]>([]); // Tier 1
  const [selectedTier2Sources, setSelectedTier2Sources] = useState<string[]>([]); // Tier 2
  const [selectedTier3Sources, setSelectedTier3Sources] = useState<string[]>([]); // Tier 3

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [documentsOpen, setDocumentsOpen] = useState(true);
  
  // Modal state for viewing scraped resources
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false);
  
  // Clear KB dialog state
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

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

  // Fetch total documents count - SCOPED TO FAMILY OR GLOBAL FOR ADMINS
  const { data: documentsCount = 0 } = useQuery({
    queryKey: ["kb-documents-count"],
    queryFn: async () => {
      // Admins see global count, families see only their own
      let query = supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true });
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin === true,
  });

  // Fetch total embeddings count - SCOPED TO FAMILY OR GLOBAL FOR ADMINS
  const { data: embeddingsCount = 0 } = useQuery({
    queryKey: ["kb-chunks-count"],
    queryFn: async () => {
      // Admins see global count, families see only their own
      let query = supabase
        .from("kb_chunks")
        .select("*", { count: "exact", head: true });
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin === true,
  });

  // Fetch knowledge base documents with filters - SCOPED TO FAMILY OR GLOBAL FOR ADMINS
  const { data: kbDocuments, isLoading: loadingDocs } = useQuery({
    queryKey: ["knowledge-base", sourceFilter, focusAreaFilter],
    queryFn: async () => {
      let query = supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false });

      // Admins see all, families see only their own (handled by RLS)
      
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

  // Web scraping mutation - Tier 1
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
      toast.success("Tier 1 web scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("Tier 1 web scraping failed: " + error.message);
    },
  });

  // Web scraping mutation - Tier 2
  const runTier2ScrapingMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-web-sources", {
        body: { sources: selectedTier2Sources },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      queryClient.invalidateQueries({ queryKey: ["kb-documents-count"] });
      queryClient.invalidateQueries({ queryKey: ["kb-chunks-count"] });
      toast.success("Tier 2 advanced resource scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("Tier 2 advanced resource scraping failed: " + error.message);
    },
  });

  // Web scraping mutation - Tier 3
  const runTier3ScrapingMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-web-sources", {
        body: { sources: selectedTier3Sources },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      queryClient.invalidateQueries({ queryKey: ["kb-documents-count"] });
      queryClient.invalidateQueries({ queryKey: ["kb-chunks-count"] });
      toast.success("Tier 3 specialized resource scraping completed successfully");
    },
    onError: (error: any) => {
      toast.error("Tier 3 specialized resource scraping failed: " + error.message);
    },
  });

  // Clear knowledge base mutation
  const clearKnowledgeBaseMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("clear-knowledge-base");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      queryClient.invalidateQueries({ queryKey: ["kb-documents-count"] });
      queryClient.invalidateQueries({ queryKey: ["kb-chunks-count"] });
      toast.success("Knowledge base cleared successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to clear knowledge base: " + error.message);
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

  const toggleTier2Source = (source: string) => {
    setSelectedTier2Sources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const toggleTier3Source = (source: string) => {
    setSelectedTier3Sources(prev =>
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

  const isAnyRunning = runAcademicIngestionMutation.isPending || 
                       runWebScrapingMutation.isPending || 
                       runTier2ScrapingMutation.isPending || 
                       runTier3ScrapingMutation.isPending;

  return (
    <div className="container mx-auto py-4 px-4 space-y-4 md:py-6 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 md:h-8 md:w-8" />
            <span className="hidden sm:inline">Knowledge Base Command Center</span>
            <span className="sm:hidden">KB Manager</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage and ingest evidence-based resources
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/kb-diagnostics")}
          className="w-full sm:w-auto"
        >
          <TestTube className="mr-2 h-4 w-4" />
          Run Diagnostics
        </Button>
      </div>

      {/* Section 1: Statistics */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
              KB Statistics
            </CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              disabled={clearKnowledgeBaseMutation.isPending}
              className="w-full sm:w-auto"
            >
              {clearKnowledgeBaseMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear & Reset KB
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Total Documents */}
            <div className="flex items-center gap-3 p-3 md:p-4 border rounded-lg">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                <Book className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl md:text-3xl font-bold">{documentsCount.toLocaleString()}</p>
              </div>
            </div>

            {/* Total Embeddings */}
            <div className="flex items-center gap-3 p-3 md:p-4 border rounded-lg">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Embeddings</p>
                <p className="text-2xl md:text-3xl font-bold">{embeddingsCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Academic Databases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Ingest from Academic Databases</CardTitle>
          <CardDescription className="text-sm">
            Search and import research articles from academic sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Source Selection */}
          <div>
            <Label className="mb-2 block text-sm">Academic Sources</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                />
                <label htmlFor="semantic-scholar" className="text-sm font-medium cursor-pointer">
                  Semantic Scholar
                </label>
              </div>
            </div>
          </div>

          {/* Search Queries */}
          <div>
            <Label htmlFor="search-query" className="text-sm">Search Queries</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="search-query"
                placeholder="e.g., autism social skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSearchQuery()}
                className="text-sm"
              />
              <Button onClick={addSearchQuery} size="icon" variant="outline" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Query List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQueries.map((query) => (
                <Badge key={query} variant="secondary" className="gap-2 text-xs">
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
          <CardTitle className="text-lg md:text-xl">Scrape Clinical Guidelines & Educational Resources</CardTitle>
          <CardDescription className="text-sm">
            Import content from government agencies and professional organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Government & Educational Agencies */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Government & Educational Agencies</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {["cdc", "idea", "osep", "wwc"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={selectedWebSources.includes(source)}
                    onCheckedChange={() => toggleWebSource(source)}
                  />
                  <label
                    htmlFor={source}
                    className="text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    {source.toUpperCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Organizations */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Professional Organizations</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {["bacb", "nas", "aap", "cec"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={selectedWebSources.includes(source)}
                    onCheckedChange={() => toggleWebSource(source)}
                  />
                  <label
                    htmlFor={source}
                    className="text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    {source.toUpperCase()}
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

      {/* Tier 2: Advanced Institutional & Community Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <School className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Scrape Advanced Institutional & Community Resources (Tier 2)</span>
            <span className="sm:hidden">Advanced Resources (Tier 2)</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Import practical strategies from leading research institutions and advocacy organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Research Institutions */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Leading Research Institutions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kennedy-krieger"
                  checked={selectedTier2Sources.includes("kennedy-krieger")}
                  onCheckedChange={() => toggleTier2Source("kennedy-krieger")}
                />
                <label htmlFor="kennedy-krieger" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Kennedy Krieger Institute
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ucdavis-mind"
                  checked={selectedTier2Sources.includes("ucdavis-mind")}
                  onCheckedChange={() => toggleTier2Source("ucdavis-mind")}
                />
                <label htmlFor="ucdavis-mind" className="text-xs sm:text-sm font-medium cursor-pointer">
                  UC Davis MIND Institute
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vanderbilt-kennedy"
                  checked={selectedTier2Sources.includes("vanderbilt-kennedy")}
                  onCheckedChange={() => toggleTier2Source("vanderbilt-kennedy")}
                />
                <label htmlFor="vanderbilt-kennedy" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Vanderbilt Kennedy Center
                </label>
              </div>
            </div>
          </div>

          {/* Advocacy Organizations */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Advocacy Organizations</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autism-speaks"
                  checked={selectedTier2Sources.includes("autism-speaks")}
                  onCheckedChange={() => toggleTier2Source("autism-speaks")}
                />
                <label htmlFor="autism-speaks" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Autism Speaks
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chadd"
                  checked={selectedTier2Sources.includes("chadd")}
                  onCheckedChange={() => toggleTier2Source("chadd")}
                />
                <label htmlFor="chadd" className="text-xs sm:text-sm font-medium cursor-pointer">
                  CHADD
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="understood"
                  checked={selectedTier2Sources.includes("understood")}
                  onCheckedChange={() => toggleTier2Source("understood")}
                />
                <label htmlFor="understood" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Understood.org
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aane"
                  checked={selectedTier2Sources.includes("aane")}
                  onCheckedChange={() => toggleTier2Source("aane")}
                />
                <label htmlFor="aane" className="text-xs sm:text-sm font-medium cursor-pointer">
                  AANE
                </label>
              </div>
            </div>
          </div>

          {/* State DOE Resources */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">State Department of Education Handbooks</Label>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="state-doe"
                  checked={selectedTier2Sources.includes("state-doe")}
                  onCheckedChange={() => toggleTier2Source("state-doe")}
                />
                <label htmlFor="state-doe" className="text-xs sm:text-sm font-medium cursor-pointer">
                  State DOE (CA, TX, NY)
                </label>
              </div>
            </div>
          </div>

          {/* Start Tier 2 Scraping Button */}
          <Button
            onClick={() => runTier2ScrapingMutation.mutate()}
            disabled={isAnyRunning || selectedTier2Sources.length === 0}
            className="w-full"
          >
            {runTier2ScrapingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Start Advanced Resource Scraping
          </Button>
        </CardContent>
      </Card>

      {/* Tier 3: Specialized & Lived Experience Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Scrape Specialized Therapeutic Models & Community Voices (Tier 3)</span>
            <span className="sm:hidden">Specialized Resources (Tier 3)</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Import specialized intervention frameworks and lived experience perspectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Therapeutic Models */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Therapeutic Models</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prt-resources"
                  checked={selectedTier3Sources.includes("prt-resources")}
                  onCheckedChange={() => toggleTier3Source("prt-resources")}
                />
                <label htmlFor="prt-resources" className="text-xs sm:text-sm font-medium cursor-pointer">
                  PRT (Pivotal Response Treatment)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="esdm-resources"
                  checked={selectedTier3Sources.includes("esdm-resources")}
                  onCheckedChange={() => toggleTier3Source("esdm-resources")}
                />
                <label htmlFor="esdm-resources" className="text-xs sm:text-sm font-medium cursor-pointer">
                  ESDM (Early Start Denver Model)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="social-thinking"
                  checked={selectedTier3Sources.includes("social-thinking")}
                  onCheckedChange={() => toggleTier3Source("social-thinking")}
                />
                <label htmlFor="social-thinking" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Social Thinking®
                </label>
              </div>
            </div>
          </div>

          {/* Community & Academic */}
          <div>
            <Label className="mb-2 block font-semibold text-sm">Community & Academic Resources</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autistic-blogs"
                  checked={selectedTier3Sources.includes("autistic-blogs")}
                  onCheckedChange={() => toggleTier3Source("autistic-blogs")}
                />
                <label htmlFor="autistic-blogs" className="text-xs sm:text-sm font-medium cursor-pointer">
                  Curated Autistic Blogs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="opencourseware"
                  checked={selectedTier3Sources.includes("opencourseware")}
                  onCheckedChange={() => toggleTier3Source("opencourseware")}
                />
                <label htmlFor="opencourseware" className="text-xs sm:text-sm font-medium cursor-pointer">
                  MIT OpenCourseWare
                </label>
              </div>
            </div>
          </div>

          {/* Start Tier 3 Scraping Button */}
          <Button
            onClick={() => runTier3ScrapingMutation.mutate()}
            disabled={isAnyRunning || selectedTier3Sources.length === 0}
            className="w-full"
          >
            {runTier3ScrapingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Start Specialized Resource Scraping
          </Button>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Collapsible open={documentsOpen} onOpenChange={setDocumentsOpen}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent w-fit">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Database className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">Knowledge Base Documents</span>
                    <span className="sm:hidden">KB Documents</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${documentsOpen ? "" : "-rotate-90"}`} />
                  </CardTitle>
                </Button>
              </CollapsibleTrigger>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="flex-1 sm:flex-none"
                >
                  <TableIcon className="h-4 w-4" />
                  <span className="ml-1 sm:hidden">Table</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1 sm:flex-none"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-1 sm:hidden">List</span>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 sm:flex-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="ml-1 sm:hidden">Grid</span>
                </Button>
              </div>
            </div>
            <CollapsibleContent>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="source-filter" className="text-sm">Filter by Source</Label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger id="source-filter" className="mt-1">
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
                    <SelectTrigger id="focus-filter" className="mt-1">
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
            </CollapsibleContent>
          </CardHeader>
        <CollapsibleContent>
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
              {/* Table View */}
              {viewMode === "table" && (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Title</TableHead>
                          <TableHead className="min-w-[120px]">Source</TableHead>
                          <TableHead className="min-w-[150px]">Focus Areas</TableHead>
                          <TableHead className="min-w-[100px]">Type</TableHead>
                          <TableHead className="min-w-[100px]">Pub Date</TableHead>
                          <TableHead className="min-w-[100px]">Added</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedDocuments?.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[250px] truncate text-sm">{doc.title || "—"}</div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <button
                                onClick={() => {
                                  setSelectedSource(doc.source_name);
                                  setResourcesModalOpen(true);
                                }}
                                className="text-primary hover:underline font-medium cursor-pointer"
                              >
                                {doc.source_name}
                              </button>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap max-w-[180px]">
                                {doc.focus_areas?.map((area: string) => (
                                  <span
                                    key={area}
                                    className={`px-1.5 py-0.5 text-[10px] sm:text-xs font-medium rounded-md border ${
                                      FOCUS_AREA_COLORS[area] || "bg-muted text-muted-foreground border-border"
                                    }`}
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-md text-xs">{doc.document_type}</Badge>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {doc.publication_date
                                ? format(new Date(doc.publication_date), "MMM yyyy")
                                : "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs sm:text-sm">
                              {format(new Date(doc.created_at), "MMM dd, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-2">
                  {paginatedDocuments?.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.title || "—"}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <button
                            onClick={() => {
                              setSelectedSource(doc.source_name);
                              setResourcesModalOpen(true);
                            }}
                            className="text-primary hover:underline font-medium cursor-pointer"
                          >
                            {doc.source_name}
                          </button>
                          <span>•</span>
                          <span>{doc.document_type}</span>
                          {doc.publication_date && (
                            <>
                              <span>•</span>
                              <span>{format(new Date(doc.publication_date), "MMM yyyy")}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap items-center">
                        {doc.focus_areas?.map((area: string) => (
                          <span
                            key={area}
                            className={`px-2 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap ${
                              FOCUS_AREA_COLORS[area] || "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedDocuments?.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3">
                      <div className="space-y-1.5">
                        <div className="font-medium line-clamp-2">{doc.title || "—"}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="font-medium">{doc.source_name}</span>
                          <span>•</span>
                          <span>{doc.document_type}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {doc.focus_areas?.map((area: string) => (
                          <span
                            key={area}
                            className={`px-2 py-0.5 text-xs font-medium rounded-md border ${
                              FOCUS_AREA_COLORS[area] || "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                      {doc.publication_date && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(doc.publication_date), "MMM yyyy")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
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
        </CollapsibleContent>
      </Card>
      </Collapsible>
      
      {/* Scraped Resources Modal */}
      <ScrapedResourcesModal
        open={resourcesModalOpen}
        onOpenChange={setResourcesModalOpen}
        sourceName={selectedSource || ""}
        resources={
          selectedSource
            ? (kbDocuments || []).filter(doc => doc.source_name === selectedSource)
            : []
        }
      />
      
      {/* Clear Knowledge Base Dialog */}
      <ClearKnowledgeBaseDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={() => clearKnowledgeBaseMutation.mutate()}
      />
    </div>
  );
}