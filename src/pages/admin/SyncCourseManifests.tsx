import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SyncCourseManifests = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      console.log('[ADMIN] Calling dynamic course discovery...');
      
      const { data, error } = await supabase.functions.invoke('sync-all-course-manifests', {
        body: {},
      });

      if (error) {
        console.error('[ADMIN] Error:', error);
        setResult({ success: false, error });
        toast({
          title: 'Sync Failed',
          description: error.message || 'Failed to sync courses',
          variant: 'destructive',
        });
        return;
      }

      console.log('[ADMIN] Sync complete:', data);
      setResult({ success: true, data });

      const { summary } = data;
      const hasIssues = summary.failed > 0 || summary.missing_db > 0 || summary.invalid_manifest > 0;

      toast({
        title: hasIssues ? 'Sync Completed with Issues' : 'Sync Complete',
        description: data.message || 'Course manifests synced successfully',
        variant: hasIssues ? 'default' : 'default',
      });
    } catch (error) {
      console.error('[ADMIN] Exception:', error);
      toast({
        title: 'Sync Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sync Course Manifests</CardTitle>
          <CardDescription>
            Automatically discovers and syncs ALL courses from the filesystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSync} disabled={syncing}>
            {syncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {syncing ? 'Syncing...' : 'Sync All Courses'}
          </Button>

          {result && (
            <div className="space-y-4">
              {result.success ? (
                <>
                  {/* Summary */}
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{result.data.message}</span>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {result.data.summary.success}
                      </div>
                      <div className="text-green-700">Synced</div>
                    </div>
                    {result.data.summary.failed > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {result.data.summary.failed}
                        </div>
                        <div className="text-red-700">Failed</div>
                      </div>
                    )}
                    {result.data.summary.missing_db > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {result.data.summary.missing_db}
                        </div>
                        <div className="text-yellow-700">Missing in DB</div>
                      </div>
                    )}
                    {result.data.summary.invalid_manifest > 0 && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {result.data.summary.invalid_manifest}
                        </div>
                        <div className="text-orange-700">Invalid Manifest</div>
                      </div>
                    )}
                  </div>

                  {/* Successful courses */}
                  {result.data.results?.filter((r: any) => r.status === 'success').length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">✅ Successfully synced:</p>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside pl-4 space-y-1">
                          {result.data.results
                            .filter((r: any) => r.status === 'success')
                            .map((item: any) => (
                              <li key={item.slug} className="text-green-700">
                                {item.slug}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Failed courses */}
                  {result.data.results?.filter((r: any) => r.status === 'failed').length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2 text-destructive">❌ Failed to sync:</p>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside pl-4 space-y-1">
                          {result.data.results
                            .filter((r: any) => r.status === 'failed')
                            .map((item: any) => (
                              <li key={item.slug} className="text-destructive">
                                {item.slug}: {item.error}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Missing in database */}
                  {result.data.results?.filter((r: any) => r.status === 'missing_db').length > 0 && (
                    <div className="text-sm">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="font-medium text-yellow-700">Missing in database:</p>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside pl-4 space-y-1">
                          {result.data.results
                            .filter((r: any) => r.status === 'missing_db')
                            .map((item: any) => (
                              <li key={item.slug} className="text-yellow-700">
                                {item.slug}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        These courses have manifest.json files but no database record
                      </p>
                    </div>
                  )}

                  {/* Invalid manifests */}
                  {result.data.results?.filter((r: any) => r.status === 'invalid_manifest').length > 0 && (
                    <div className="text-sm">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <p className="font-medium text-orange-700">Invalid manifests:</p>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside pl-4 space-y-1">
                          {result.data.results
                            .filter((r: any) => r.status === 'invalid_manifest')
                            .map((item: any) => (
                              <li key={item.slug} className="text-orange-700">
                                {item.slug}: {item.error}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Sync failed: {result.error?.message || 'Unknown error'}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncCourseManifests;
