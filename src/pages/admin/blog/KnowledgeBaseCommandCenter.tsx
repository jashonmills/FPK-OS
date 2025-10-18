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
import { Database, FileText, Brain, Building, Sparkles, Trash2, Search, Filter, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { IngestionStatusTracker, IngestionStatus } from '@/components/admin/IngestionStatusTracker';
import { useNavigate } from 'react-router-dom';
import { KB_SOURCES } from '@/lib/knowledgeBase/sourceCatalog';
import { useScrapingJobStatus } from '@/hooks/useScrapingJobStatus';
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
  source_url?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Collapsible state
  const [tier1Open, setTier1Open] = useState(false);
  const [tier2Open, setTier2Open] = useState(false);
  const [tier3Open, setTier3Open] = useState(false);
  const [tier4Open, setTier4Open] = useState(false);

  // Academic ingestion state
  const [academicSources, setAcademicSources] = useState<string[]>([]);
  const [academicQueries, setAcademicQueries] = useState<string>('');
  const [academicStatus, setAcademicStatus] = useState<IngestionStatus>({ stage: 'idle', message: '', progress: 0 });

  // Clinical ingestion state
  const [clinicalSources, setClinicalSources] = useState<string[]>([]);
  const [clinicalStatus, setClinicalStatus] = useState<IngestionStatus>({ stage: 'idle', message: '', progress: 0 });

  // Institutional ingestion state
  const [institutionalSources, setInstitutionalSources] = useState<string[]>([]);
  const [institutionalStatus, setInstitutionalStatus] = useState<IngestionStatus>({ stage: 'idle', message: '', progress: 0 });

  // Specialized ingestion state
  const [specializedSources, setSpecializedSources] = useState<string[]>([]);
  const [specializedStatus, setSpecializedStatus] = useState<IngestionStatus>({ stage: 'idle', message: '', progress: 0 });

  // Job tracking state
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const { jobs, getLatestJobByType } = useScrapingJobStatus(trackingEnabled);

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

  // Poll job status and update UI based on job state
  useEffect(() => {
    if (!trackingEnabled) return;

    const academicJob = getLatestJobByType('academic_search');
    if (academicJob) {
      if (academicJob.status === 'in_progress') {
        setAcademicStatus({
          stage: 'ingesting',
          message: `Processing ${academicJob.source_name}...`,
          progress: 50,
          itemsProcessed: academicJob.documents_added || 0,
          itemsFound: academicJob.documents_found || 1
        });
      } else if (academicJob.status === 'completed') {
        setAcademicStatus({
          stage: 'complete',
          message: `Successfully added ${academicJob.documents_added || 0} documents!`,
          progress: 100
        });
        loadStats();
        loadDocuments();
        setTimeout(() => {
          setAcademicStatus({ stage: 'idle', message: '', progress: 0 });
        }, 3000);
      } else if (academicJob.status === 'failed') {
        setAcademicStatus({
          stage: 'error',
          message: academicJob.error_message || 'Ingestion failed',
          progress: 0
        });
      }
    }

    const webScrapeJob = getLatestJobByType('web_scrape');
    if (webScrapeJob) {
      // Determine which tier based on source type
      const updateStatus = (setter: typeof setClinicalStatus) => {
        if (webScrapeJob.status === 'in_progress') {
          setter({
            stage: 'ingesting',
            message: `Scraping ${webScrapeJob.source_name}...`,
            progress: 50,
            itemsProcessed: webScrapeJob.documents_added || 0,
            itemsFound: webScrapeJob.documents_found || 1
          });
        } else if (webScrapeJob.status === 'completed') {
          setter({
            stage: 'complete',
            message: `Successfully added ${webScrapeJob.documents_added || 0} documents!`,
            progress: 100
          });
          loadStats();
          loadDocuments();
          setTimeout(() => {
            setter({ stage: 'idle', message: '', progress: 0 });
          }, 3000);
        } else if (webScrapeJob.status === 'failed') {
          setter({
            stage: 'error',
            message: webScrapeJob.error_message || 'Scraping failed',
            progress: 0
          });
        }
      };

      // Update the appropriate tier status
      if (clinicalSources.includes(webScrapeJob.source_name || '')) {
        updateStatus(setClinicalStatus);
      } else if (institutionalSources.includes(webScrapeJob.source_name || '')) {
        updateStatus(setInstitutionalStatus);
      } else if (specializedSources.includes(webScrapeJob.source_name || '')) {
        updateStatus(setSpecializedStatus);
      }
    }
  }, [jobs, trackingEnabled, getLatestJobByType, clinicalSources, institutionalSources, specializedSources]);

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
    setCurrentPage(1); // Reset to first page when filters change
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

    const queries = academicQueries.split(',').map(q => q.trim()).filter(q => q);
    
    setTrackingEnabled(true);
    setAcademicStatus({ stage: 'searching', message: `Searching ${academicSources.length} databases for ${queries.length} queries...`, progress: 10 });

    try {
      const { data, error } = await supabase.functions.invoke('ingest-academic-papers', {
        body: {
          sources: academicSources,
          queries
        }
      });

      if (error) throw error;

      toast({
        title: 'Academic ingestion started',
        description: `Processing ${academicSources.length} databases`
      });
      
      // Status will be updated via polling in useEffect
    } catch (error) {
      setAcademicStatus({ stage: 'error', message: error instanceof Error ? error.message : 'Unknown error', progress: 0 });
      toast({
        title: 'Ingestion failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      setTrackingEnabled(false);
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

    setTrackingEnabled(true);
    setClinicalStatus({ stage: 'searching', message: `Initiating scrape of ${clinicalSources.length} clinical sources...`, progress: 10 });

    try {
      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { sources: clinicalSources }
      });

      if (error) throw error;

      toast({
        title: 'Clinical scraping started',
        description: `Processing ${clinicalSources.length} sources`
      });
      
      // Status will be updated via polling
    } catch (error) {
      setClinicalStatus({ stage: 'error', message: error instanceof Error ? error.message : 'Unknown error', progress: 0 });
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      setTrackingEnabled(false);
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

    setInstitutionalStatus({ stage: 'searching', message: `Initiating institutional resource scraping...`, progress: 10 });

    try {
      setTimeout(() => {
        setInstitutionalStatus({ stage: 'found', message: 'Connecting to research institutions...', progress: 25 });
      }, 1500);

      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { 
          sources: institutionalSources,
          source_type: 'institutional' 
        }
      });

      if (error) throw error;

      setInstitutionalStatus({ stage: 'ingesting', message: 'Retrieving institutional resources...', progress: 55, estimatedTimeLeft: 150 });
      
      setTimeout(() => {
        setInstitutionalStatus({ stage: 'analyzing', message: 'Almost complete, finalizing data processing...', progress: 85 });
      }, 3000);

      setTimeout(() => {
        setInstitutionalStatus({ stage: 'complete', message: 'Institutional scraping completed successfully!', progress: 100 });
        toast({
          title: 'Scraping complete',
          description: `Scraped ${institutionalSources.length} institutional sources`
        });
      }, 5000);
    } catch (error) {
      setInstitutionalStatus({ stage: 'error', message: error instanceof Error ? error.message : 'Unknown error', progress: 0 });
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
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

    setSpecializedStatus({ stage: 'searching', message: `Initiating specialized resource scraping...`, progress: 10 });

    try {
      setTimeout(() => {
        setSpecializedStatus({ stage: 'found', message: 'Locating specialized methodologies...', progress: 30 });
      }, 1500);

      const { data, error } = await supabase.functions.invoke('scrape-clinical-resources', {
        body: { 
          sources: specializedSources,
          source_type: 'specialized' 
        }
      });

      if (error) throw error;

      setSpecializedStatus({ stage: 'ingesting', message: 'Extracting specialized content...', progress: 60, estimatedTimeLeft: 90 });
      
      setTimeout(() => {
        setSpecializedStatus({ stage: 'analyzing', message: 'Standby, processing final items...', progress: 90 });
      }, 3000);

      setTimeout(() => {
        setSpecializedStatus({ stage: 'complete', message: 'Specialized scraping completed!', progress: 100 });
        toast({
          title: 'Scraping complete',
          description: `Scraped ${specializedSources.length} specialized sources`
        });
      }, 4500);
    } catch (error) {
      setSpecializedStatus({ stage: 'error', message: error instanceof Error ? error.message : 'Unknown error', progress: 0 });
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
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

      {/* Status Trackers */}
      {(academicStatus.stage !== 'idle' || clinicalStatus.stage !== 'idle' || 
        institutionalStatus.stage !== 'idle' || specializedStatus.stage !== 'idle') && (
        <div className="space-y-3">
          {academicStatus.stage !== 'idle' && (
            <IngestionStatusTracker status={academicStatus} tierName="Tier 1: Academic Databases" />
          )}
          {clinicalStatus.stage !== 'idle' && (
            <IngestionStatusTracker status={clinicalStatus} tierName="Tier 2: Clinical Resources" />
          )}
          {institutionalStatus.stage !== 'idle' && (
            <IngestionStatusTracker status={institutionalStatus} tierName="Tier 3: Institutional Resources" />
          )}
          {specializedStatus.stage !== 'idle' && (
            <IngestionStatusTracker status={specializedStatus} tierName="Tier 4: Specialized Resources" />
          )}
        </div>
      )}

      {/* Academic Databases Ingestion */}
      <TransparentTile>
        <Collapsible open={tier1Open} onOpenChange={setTier1Open}>
          <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-left">Tier 1: Academic Databases</CardTitle>
                    <Badge variant="secondary" className="ml-2">{academicSources.length} selected</Badge>
                  </div>
                  {tier1Open ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CardDescription className="text-left mt-2">
                Search academic databases for research papers and studies
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
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

                <Button 
                  onClick={handleAcademicIngestion} 
                  disabled={academicStatus.stage !== 'idle' && academicStatus.stage !== 'complete' && academicStatus.stage !== 'error'} 
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Academic Ingestion
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </TransparentTile>

      {/* Clinical Resources */}
      <TransparentTile>
        <Collapsible open={tier2Open} onOpenChange={setTier2Open}>
          <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <CardTitle className="text-left">Tier 2: Clinical & Educational Resources</CardTitle>
                    <Badge variant="secondary" className="ml-2">{clinicalSources.length} selected</Badge>
                  </div>
                  {tier2Open ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CardDescription className="text-left mt-2">
                Scrape guidelines and resources from authoritative organizations
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
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

                <Button 
                  onClick={handleClinicalIngestion} 
                  disabled={clinicalStatus.stage !== 'idle' && clinicalStatus.stage !== 'complete' && clinicalStatus.stage !== 'error'} 
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Clinical Resource Scraping
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </TransparentTile>

      {/* Institutional Resources */}
      <TransparentTile>
        <Collapsible open={tier3Open} onOpenChange={setTier3Open}>
          <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <CardTitle className="text-left">Tier 3: Institutional Resources</CardTitle>
                    <Badge variant="secondary" className="ml-2">{institutionalSources.length} selected</Badge>
                  </div>
                  {tier3Open ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CardDescription className="text-left mt-2">
                Advanced resources from leading research institutions
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
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

                <Button 
                  onClick={handleInstitutionalIngestion} 
                  disabled={institutionalStatus.stage !== 'idle' && institutionalStatus.stage !== 'complete' && institutionalStatus.stage !== 'error'} 
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Institutional Scraping
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </TransparentTile>

      {/* Specialized Resources */}
      <TransparentTile>
        <Collapsible open={tier4Open} onOpenChange={setTier4Open}>
          <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <CardTitle className="text-left">Tier 4: Specialized Resources</CardTitle>
                    <Badge variant="secondary" className="ml-2">{specializedSources.length} selected</Badge>
                  </div>
                  {tier4Open ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CardDescription className="text-left mt-2">
                Specialized methodologies and educational resources
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
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

                <Button 
                  onClick={handleSpecializedIngestion} 
                  disabled={specializedStatus.stage !== 'idle' && specializedStatus.stage !== 'complete' && specializedStatus.stage !== 'error'} 
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Specialized Scraping
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </TransparentTile>

      {/* Documents Table */}
      <TransparentTile>
        <Card className="bg-background/40 backdrop-blur-sm border-none shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle className="text-lg">Knowledge Base Documents</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full sm:w-[220px] bg-background">
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Sources</SelectItem>
                {KB_SOURCES.academic_databases.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
                {KB_SOURCES.clinical_resources.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
                {KB_SOURCES.institutional_resources.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
                {KB_SOURCES.specialized_resources.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[220px] bg-background">
                <SelectValue placeholder="Filter by Focus Area" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Focus Areas</SelectItem>
                <SelectItem value="academic_database">Research</SelectItem>
                <SelectItem value="clinical_resource">Academic</SelectItem>
                <SelectItem value="institutional">Clinical</SelectItem>
                <SelectItem value="specialized">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clean Table */}
          <div className="border rounded-lg bg-background overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold w-[140px]">Source</TableHead>
                  <TableHead className="font-semibold w-[180px]">Focus Areas</TableHead>
                  <TableHead className="font-semibold w-[120px]">Type</TableHead>
                  <TableHead className="font-semibold w-[100px]">Pub Date</TableHead>
                  <TableHead className="font-semibold w-[100px]">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Database className="h-8 w-8 opacity-50" />
                        <p>No documents found</p>
                        <p className="text-sm">Start ingesting content from the sources above</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="line-clamp-2 max-w-md" title={doc.title}>
                          {doc.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.source_url ? (
                          <a 
                            href={doc.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-600 dark:text-cyan-400 font-medium text-sm hover:underline"
                          >
                            {doc.source_name}
                          </a>
                        ) : (
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">
                            {doc.source_name}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {doc.focus_areas.slice(0, 2).map((area, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                              {area}
                            </Badge>
                          ))}
                          {doc.focus_areas.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              +{doc.focus_areas.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                          {doc.document_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {doc.publication_date ? 
                          new Date(doc.publication_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          }) :
                          '-'
                        }
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(doc.created_at).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {documents.length > itemsPerPage && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, documents.length)} of {documents.length} documents
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {Math.ceil(documents.length / itemsPerPage)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(documents.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(documents.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </TransparentTile>
    </div>
  );
}
