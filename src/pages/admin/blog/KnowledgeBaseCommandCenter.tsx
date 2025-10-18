import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, FileText, Brain, Building, Sparkles, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
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
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Knowledge Base Command Center</h1>
        <p className="text-muted-foreground">
          Ingest content from academic databases, clinical resources, and institutional sources to power AI blog generation
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Total Embeddings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEmbeddings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearKB} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear KB
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Academic Databases Ingestion */}
      <Card>
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
          <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor={`academic-${source.name}`} className="text-sm cursor-pointer">
                  {source.name}
                  <span className="text-muted-foreground ml-2 text-xs">{source.description}</span>
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic-queries">Search Queries (comma-separated)</Label>
            <Input
              id="academic-queries"
              placeholder="autism social skills, adhd executive function, iep strategies"
              value={academicQueries}
              onChange={(e) => setAcademicQueries(e.target.value)}
            />
          </div>

          <Button onClick={handleAcademicIngestion} disabled={academicLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {academicLoading ? 'Ingesting...' : 'Start Academic Ingestion'}
          </Button>
        </CardContent>
      </Card>

      {/* Clinical Resources */}
      <Card>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          <Button onClick={handleClinicalIngestion} disabled={clinicalLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {clinicalLoading ? 'Scraping...' : 'Start Clinical Resource Scraping'}
          </Button>
        </CardContent>
      </Card>

      {/* Institutional Resources */}
      <Card>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          <Button onClick={() => {/* TODO */}} disabled={institutionalLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {institutionalLoading ? 'Scraping...' : 'Start Institutional Scraping'}
          </Button>
        </CardContent>
      </Card>

      {/* Specialized Resources */}
      <Card>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          <Button onClick={() => {/* TODO */}} disabled={specializedLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {specializedLoading ? 'Scraping...' : 'Start Specialized Scraping'}
          </Button>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Focus Areas</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No documents found. Start ingesting content from the sources above.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{doc.source_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.document_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {doc.focus_areas.slice(0, 3).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
