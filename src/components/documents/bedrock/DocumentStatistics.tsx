import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface DocumentStatisticsProps {
  documents: any[];
}

export function DocumentStatistics({ documents }: DocumentStatisticsProps) {
  // Calculate statistics
  const totalDocuments = documents.length;
  const completedDocs = documents.filter(d => d.status === 'completed').length;
  const failedDocs = documents.filter(d => d.status === 'failed').length;
  const analyzingDocs = documents.filter(d => d.status === 'analyzing').length;
  
  const successRate = totalDocuments > 0 
    ? ((completedDocs / totalDocuments) * 100).toFixed(1) 
    : '0';

  // Group by category
  const categoryBreakdown = documents.reduce((acc, doc) => {
    const category = doc.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5); // Top 5 categories

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Total Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocuments}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all categories
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedDocs} of {totalDocuments} completed
          </p>
        </CardContent>
      </Card>

      {/* Processing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyzingDocs}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently analyzing
          </p>
        </CardContent>
      </Card>

      {/* Failed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{failedDocs}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Requires attention
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sortedCategories.length > 0 ? (
              sortedCategories.map(([category, count]) => (
                <Badge key={category} variant="secondary" className="text-sm">
                  {category}: {count as number}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No documents yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
