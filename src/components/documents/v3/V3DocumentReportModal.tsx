import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Target, Lightbulb, TrendingUp, Award, Download, 
  CheckCircle2, AlertCircle, ArrowUp, ArrowDown, ArrowRight,
  Loader2
} from 'lucide-react';
import { useV3DocumentReport } from '@/hooks/useV3DocumentReport';
import { AIAttribution } from '@/components/shared/AIAttribution';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface V3DocumentReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  familyId: string;
  studentId?: string;
  onOpenPdfViewer?: () => void;
}

export function V3DocumentReportModal({ 
  open, 
  onOpenChange, 
  documentId, 
  familyId,
  onOpenPdfViewer
}: V3DocumentReportModalProps) {
  const { data, isLoading } = useV3DocumentReport(documentId, familyId);

  const getCategoryColor = (category: string): "default" | "destructive" | "outline" | "secondary" => {
    const colors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'IEP': 'default',
      'BIP': 'secondary',
      'FBA': 'outline',
      'Progress Report': 'default',
      'Evaluation Report': 'secondary',
      'Other': 'outline'
    };
    return colors[category] || 'outline';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'concern': return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'observation': return <FileText className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'strength': return 'border-l-4 border-l-green-600';
      case 'concern': return 'border-l-4 border-l-amber-600';
      case 'recommendation': return 'border-l-4 border-l-blue-600';
      case 'observation': return 'border-l-4 border-l-purple-600';
      default: return '';
    }
  };

  const getPriorityVariant = (priority: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'improving': return <ArrowUp className="h-3 w-3" />;
      case 'declining': return <ArrowDown className="h-3 w-3" />;
      case 'stable': return <ArrowRight className="h-3 w-3" />;
      default: return <ArrowRight className="h-3 w-3" />;
    }
  };

  const getTrendVariant = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'improving': return 'default';
      case 'declining': return 'destructive';
      case 'stable': return 'secondary';
      default: return 'outline';
    }
  };

  const exportReport = () => {
    if (!data) return;

    const markdown = generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.document.file_name}_analysis_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported as Markdown file');
  };

  const generateMarkdownReport = () => {
    if (!data) return '';
    
    return `# Analysis Report: ${data.document.file_name}

**Document Type:** ${data.document.category}
**Analyzed:** ${format(new Date(data.document.updated_at), 'PPP')}

## Summary

- **Metrics Extracted:** ${data.metrics.length}
- **Insights Generated:** ${data.insights.length}
- **Progress Records:** ${data.progressTracking.length}

## Key Insights

### Strengths
${data.insights.filter(i => i.insight_type === 'strength').map(i => `- **${i.title}**: ${i.content}`).join('\n') || 'None'}

### Areas of Focus
${data.insights.filter(i => i.insight_type === 'concern').map(i => `- **${i.title}**: ${i.content}`).join('\n') || 'None'}

### Recommendations
${data.insights.filter(i => i.insight_type === 'recommendation').map(i => `- **${i.title}**: ${i.content}`).join('\n') || 'None'}

## Metrics

${data.metrics.map(m => `- **${m.metric_name}:** ${m.metric_value} ${m.metric_unit || ''}`).join('\n') || 'None'}

## Progress Tracking

${data.progressTracking.map(p => `- **${p.metric_type}:** ${p.baseline_value} → ${p.current_value} / ${p.target_value} (${Math.round(p.progress_percentage)}%)`).join('\n') || 'None'}

---
*Generated by FPK-X on ${format(new Date(), 'PPP')}*
`;
  };

  const getMetricsSummary = () => {
    if (!data?.metrics) return [];
    const typeCount: Record<string, number> = {};
    data.metrics.forEach(m => {
      typeCount[m.metric_type] = (typeCount[m.metric_type] || 0) + 1;
    });
    return Object.entries(typeCount).map(([type, count]) => ({ type, count }));
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analysis Report: {data.document.file_name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getCategoryColor(data.document.category)}>
                {data.document.category}
              </Badge>
              <AIAttribution variant="badge" />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-4">
            <StatCard icon={<Target className="h-5 w-5" />} label="Metrics Extracted" value={data.metrics.length} />
            <StatCard icon={<Lightbulb className="h-5 w-5" />} label="Insights" value={data.insights.length} />
            <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Progress Records" value={data.progressTracking.length} />
            <StatCard icon={<Award className="h-5 w-5" />} label="Goals" value={data.goals.length} />
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics ({data.metrics.length})</TabsTrigger>
            <TabsTrigger value="insights">Insights ({data.insights.length})</TabsTrigger>
            <TabsTrigger value="progress">Progress ({data.progressTracking.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6 p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Uploaded</dt>
                      <dd className="text-sm">{format(new Date(data.document.created_at), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Analyzed</dt>
                      <dd className="text-sm">{format(new Date(data.document.updated_at), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                      <dd><Badge variant={getCategoryColor(data.document.category)}>{data.document.category}</Badge></dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">File Size</dt>
                      <dd className="text-sm">{data.document.file_size_kb} KB</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {data.insights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Strengths ({data.insights.filter(i => i.insight_type === 'strength').length})
                        </h4>
                        <ul className="space-y-1">
                          {data.insights
                            .filter(i => i.insight_type === 'strength')
                            .slice(0, 3)
                            .map(insight => (
                              <li key={insight.id} className="text-sm flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>{insight.title}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Areas of Focus ({data.insights.filter(i => i.insight_type === 'concern').length})
                        </h4>
                        <ul className="space-y-1">
                          {data.insights
                            .filter(i => i.insight_type === 'concern')
                            .slice(0, 3)
                            .map(insight => (
                              <li key={insight.id} className="text-sm flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{insight.title}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.metrics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Metrics Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getMetricsSummary()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="flex-1 overflow-auto mt-4">
            <div className="p-4 space-y-4">
              {data.metrics.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No metrics extracted from this document.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {data.metrics.map(metric => (
                    <Card key={metric.id}>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{metric.metric_name}</span>
                          <Badge variant="outline">{metric.metric_type}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{metric.metric_value}</span>
                            {metric.metric_unit && (
                              <span className="text-muted-foreground">{metric.metric_unit}</span>
                            )}
                          </div>
                          
                          {metric.target_value && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Target:</span>
                                <span className="font-medium">{metric.target_value} {metric.metric_unit}</span>
                              </div>
                              <Progress value={(metric.metric_value / metric.target_value) * 100} />
                            </div>
                          )}
                          
                          {metric.measurement_date && (
                            <p className="text-xs text-muted-foreground">
                              Measured on {format(new Date(metric.measurement_date), 'PP')}
                            </p>
                          )}
                          
                          {metric.context && (
                            <p className="text-sm text-muted-foreground mt-2">{metric.context}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 overflow-auto mt-4">
            <div className="p-4 space-y-6">
              {data.insights.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No insights generated for this document.</p>
                </div>
              ) : (
                ['strength', 'concern', 'recommendation', 'observation'].map(type => {
                  const typeInsights = data.insights.filter(i => i.insight_type === type);
                  if (typeInsights.length === 0) return null;
                  
                  return (
                    <div key={type}>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 capitalize">
                        {getInsightIcon(type)}
                        {type}s ({typeInsights.length})
                      </h3>
                      
                      <div className="space-y-3">
                        {typeInsights.map(insight => (
                          <Card key={insight.id} className={getInsightBorderColor(type)}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{insight.title}</CardTitle>
                                <div className="flex gap-2">
                                  {insight.priority && (
                                    <Badge variant={getPriorityVariant(insight.priority)}>
                                      {insight.priority}
                                    </Badge>
                                  )}
                                  {insight.confidence_score && (
                                    <Badge variant="outline">
                                      {Math.round(insight.confidence_score * 100)}% confidence
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{insight.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="flex-1 overflow-auto mt-4">
            <div className="p-4 space-y-4">
              {data.progressTracking.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No progress tracking data available for this document.</p>
                </div>
              ) : (
                data.progressTracking.map(item => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{item.metric_type}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getTrendVariant(item.trend)}>
                            {getTrendIcon(item.trend)} {item.trend}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(item.progress_percentage)}% Complete
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Baseline</span>
                            <span className="font-medium">{item.baseline_value}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current</span>
                            <span className="font-medium text-blue-600">{item.current_value}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target</span>
                            <span className="font-medium">{item.target_value}</span>
                          </div>
                        </div>
                        
                        <Progress value={item.progress_percentage} className="h-3" />
                        
                        {item.notes && (
                          <p className="text-sm text-muted-foreground pt-2 border-t">{item.notes}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          {onOpenPdfViewer && (
            <Button variant="outline" onClick={onOpenPdfViewer}>
              <FileText className="mr-2 h-4 w-4" />
              View Source Document
            </Button>
          )}
          <div className="flex-1" />
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
