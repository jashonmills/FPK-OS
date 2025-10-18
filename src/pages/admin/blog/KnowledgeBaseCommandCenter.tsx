import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, FileText, Brain, Building, Sparkles, Trash2, Search, Filter, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KB_SOURCES } from '@/lib/knowledgeBase/sourceCatalog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface KBStats {
  totalDocuments: number;
  totalEmbeddings: number;
}

interface KBDocument {
  id: string;
  title: string;
  source_name: string;
  source_type: string;
  document_type: string;
  publication_date: string | null;
  focus_areas: string[];
  created_at: string;
}

export default function KnowledgeBaseCommandCenter() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<KBStats>({ totalDocuments: 0, totalEmbeddings: 0 });
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Academic ingestion state
  const [academicSources, setAcademicSources] = useState<string[]>([]);
  const [academicQueries, setAcademicQueries] = useState<string>('');
  const [academicLoading, setAcademicLoading] = useState(false);

  // Clinical ingestion state
  const [clinicalSources, setClinicalSources] = useState<string[]>([]);
  const [clinicalLoading, setClinicalLoading] = useState(false);

  // Institutional ingestion state
  const [institutionalSources, setInstitutionalSources] = useState<string[]>([]);
  const [institutionalLoading, setInstitutionalLoading] = useState(false);

  // Specialized ingestion state
  const [specializedSources, setSpecializedSources] = useState<string[]>([]);
  const [specializedLoading, setSpecializedLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadDocuments();
    
    // Subscribe to real-time updates
    const documentsChannel = supabase
      .channel('kb_documents_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kb_documents'
        },
        () => {
          loadStats();
          loadDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentsChannel);
    };
  }, []);

  const loadStats = async () => {
    const [docsResult, embeddingsResult] = await Promise.all([
      supabase.from('kb_documents').select('id', { count: 'exact', head: true }),
      supabase.from('kb_embeddings').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      totalDocuments: docsResult.count || 0,
      totalEmbeddings: embeddingsResult.count || 0
    });
  };

  const loadDocuments = async () => {
    let query = supabase
      .from('kb_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,source_name.ilike.%${searchQuery}%`);
    }

    if (filterSource !== 'all') {
      query = query.eq('source_name', filterSource);
    }

    if (filterType !== 'all') {
      query = query.eq('source_type', filterType);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      toast({
        title: 'Error loading documents',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    setDocuments(data || []);
  };

  useEffect(() => {
    loadDocuments();
  }, [searchQuery, filterSource, filterType]);

  const handleAcademicIngestion = async () => {
    if (academicSources.length === 0) {
      toast({
        title: 'No sources selected',
        description: 'Please select at least one academic database',
        variant: 'destructive'
      });
      return;
    }

    if (!academicQueries.trim()) {
      toast({
        title: 'No search queries',
        description: 'Please enter at least one search query',
        variant: 'destructive'
      });
      return;
    }

    setAcademicLoading(true);

    try {
      const queries = academicQueries.split(',').map(q => q.trim()).filter(q => q);
      
      const { data, error } = await supabase.functions.invoke('ingest-academic-papers', {
        body: {
          sources: academicSources,
          queries
        }
      });

      if (error) throw error;

      toast({
        title: 'Academic ingestion started',
        description: `Searching ${academicSources.length} databases for ${queries.length} queries`
      });
    } catch (error) {
      toast({
        title: 'Ingestion failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setAcademicLoading(false);
    }
  };

  const handleClinicalIngestion = async () => {
    if (clinicalSources.length === 0) {
      toast({
        title: 'No sources selected',
        description: 'Please select at least one clinical resource',
        variant: 'destructive'
      });
      return;
    }

    setClinicalLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { sources: clinicalSources }
      });

      if (error) throw error;

      toast({
        title: 'Clinical resource scraping started',
        description: `Scraping ${clinicalSources.length} sources`
      });
    } catch (error) {
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setClinicalLoading(false);
    }
  };

  const handleInstitutionalIngestion = async () => {
    if (institutionalSources.length === 0) {
      toast({
        title: 'No sources selected',
        description: 'Please select at least one institutional resource',
        variant: 'destructive'
      });
      return;
    }

    setInstitutionalLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { 
          sources: institutionalSources,
          source_type: 'institutional' 
        }
      });

      if (error) throw error;

      toast({
        title: 'Institutional scraping started',
        description: `Scraping ${institutionalSources.length} institutional sources`
      });
    } catch (error) {
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setInstitutionalLoading(false);
    }
  };

  const handleSpecializedIngestion = async () => {
    if (specializedSources.length === 0) {
      toast({
        title: 'No sources selected',
        description: 'Please select at least one specialized resource',
        variant: 'destructive'
      });
      return;
    }

    setSpecializedLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { 
          sources: specializedSources,
          source_type: 'specialized' 
        }
      });

      if (error) throw error;

      toast({
        title: 'Specialized scraping started',
        description: `Scraping ${specializedSources.length} specialized sources`
      });
    } catch (error) {
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setSpecializedLoading(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    if (stats.totalDocuments === 0) {
      toast({
        title: 'No documents found',
        description: 'Please ingest some content first',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('regenerate-kb-embeddings');

      if (error) throw error;

      toast({
        title: 'Embeddings generated successfully',
        description: data?.stats ? 
          `Processed ${data.stats.total} documents. ${data.stats.success} successful, ${data.stats.failed} failed.` :
          'All embeddings generated successfully'
      });

      loadStats();
    } catch (error) {
      toast({
        title: 'Embedding generation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearKB = async () => {
    if (!confirm('Are you sure you want to clear the entire knowledge base? This cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      await supabase.from('kb_documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      toast({
        title: 'Knowledge base cleared',
        description: 'All documents and embeddings have been removed'
      });

      loadStats();
      loadDocuments();
    } catch (error) {
      toast({
        title: 'Clear failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 pt-12 pb-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/blog')} className="bg-background/50 backdrop-blur-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>

      {/* Header */}
      <TransparentTile className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Knowledge Base Command Center</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ingest content from academic databases, clinical resources, and institutional sources to power AI blog generation
        </p>
      </TransparentTile>

      {/* Statistics */}
      <TransparentTile className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-background/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalDocuments}</div>
            </CardContent>
          </Card>

          <Card className="bg-background/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Total Embeddings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalEmbeddings}</div>
            </CardContent>
          </Card>

          <Card className="bg-background/40 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={loadStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="default" size="sm" onClick={handleGenerateEmbeddings} disabled={loading}>
                <Brain className="h-4 w-4 mr-2" />
                Generate Embeddings
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearKB} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear KB
              </Button>
            </CardContent>
          </Card>
        </div>
      </TransparentTile>

      {/* Academic Databases Ingestion */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tier 1: Academic Databases
          </CardTitle>
          <CardDescription>
            Search academic databases for research papers and studies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {KB_SOURCES.academic_databases.map((source) => (
              <div key={source.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`academic-${source.name}`}
                  checked={academicSources.includes(source.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAcademicSources([...academicSources, source.name]);
                    } else {
                      setAcademicSources(academicSources.filter(s => s !== source.name));
                    }
                  }}
                />
                <Label htmlFor={`academic-${source.name}`} className="text-sm cursor-pointer flex-1">
                  {source.name}
                  <span className="text-muted-foreground ml-2 text-xs block sm:inline">{source.description}</span>
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic-queries">Search Queries (comma-separated)</Label>
            <Input
              id="academic-queries"
              placeholder="autism social skills, adhd executive function"
              value={academicQueries}
              onChange={(e) => setAcademicQueries(e.target.value)}
              className="w-full"
            />
          </div>

          <Button onClick={handleAcademicIngestion} disabled={academicLoading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            {academicLoading ? 'Ingesting...' : 'Start Academic Ingestion'}
          </Button>
        </CardContent>
        </Card>
      </TransparentTile>

      {/* Clinical Resources */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tier 2: Clinical & Educational Resources
          </CardTitle>
          <CardDescription>
            Scrape guidelines and resources from authoritative organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {KB_SOURCES.clinical_resources.map((source) => (
              <div key={source.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`clinical-${source.name}`}
                  checked={clinicalSources.includes(source.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setClinicalSources([...clinicalSources, source.name]);
                    } else {
                      setClinicalSources(clinicalSources.filter(s => s !== source.name));
                    }
                  }}
                />
                <Label htmlFor={`clinical-${source.name}`} className="text-sm cursor-pointer">
                  {source.name}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleClinicalIngestion} disabled={clinicalLoading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            {clinicalLoading ? 'Scraping...' : 'Start Clinical Resource Scraping'}
          </Button>
        </CardContent>
        </Card>
      </TransparentTile>

      {/* Institutional Resources */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tier 3: Institutional Resources
          </CardTitle>
          <CardDescription>
            Advanced resources from leading research institutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {KB_SOURCES.institutional_resources.map((source) => (
              <div key={source.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`institutional-${source.name}`}
                  checked={institutionalSources.includes(source.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setInstitutionalSources([...institutionalSources, source.name]);
                    } else {
                      setInstitutionalSources(institutionalSources.filter(s => s !== source.name));
                    }
                  }}
                />
                <Label htmlFor={`institutional-${source.name}`} className="text-sm cursor-pointer">
                  {source.name}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleInstitutionalIngestion} disabled={institutionalLoading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            {institutionalLoading ? 'Scraping...' : 'Start Institutional Scraping'}
          </Button>
        </CardContent>
        </Card>
      </TransparentTile>

      {/* Specialized Resources */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tier 4: Specialized Resources
          </CardTitle>
          <CardDescription>
            Specialized methodologies and educational resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {KB_SOURCES.specialized_resources.map((source) => (
              <div key={source.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialized-${source.name}`}
                  checked={specializedSources.includes(source.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSpecializedSources([...specializedSources, source.name]);
                    } else {
                      setSpecializedSources(specializedSources.filter(s => s !== source.name));
                    }
                  }}
                />
                <Label htmlFor={`specialized-${source.name}`} className="text-sm cursor-pointer">
                  {source.name}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleSpecializedIngestion} disabled={specializedLoading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            {specializedLoading ? 'Scraping...' : 'Start Specialized Scraping'}
          </Button>
        </CardContent>
        </Card>
      </TransparentTile>

      {/* Documents Table */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Knowledge Base Documents
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
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
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {KB_SOURCES.academic_databases.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
                {KB_SOURCES.clinical_resources.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="academic_database">Academic</SelectItem>
                <SelectItem value="clinical_resource">Clinical</SelectItem>
                <SelectItem value="institutional">Institutional</SelectItem>
                <SelectItem value="specialized">Specialized</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead className="w-[15%]">Source</TableHead>
                  <TableHead className="w-[15%]">Focus Areas</TableHead>
                  <TableHead className="w-[12%]">Type</TableHead>
                  <TableHead className="w-[10%]">Pub Date</TableHead>
                  <TableHead className="w-[8%]">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No documents found. Start ingesting content from the sources above.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate" title={doc.title}>{doc.title}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                          {doc.source_name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {doc.focus_areas.slice(0, 2).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{doc.document_type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {doc.publication_date ? 
                          new Date(doc.publication_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
                          '-'
                        }
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </TransparentTile>
    </div>
  );
}
