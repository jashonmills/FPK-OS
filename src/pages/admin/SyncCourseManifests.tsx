import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { syncCourseManifests } from '@/utils/syncCourseManifests';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SyncCourseManifests = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const result = await syncCourseManifests();
      setResult(result);

      if (result.success) {
        toast({
          title: 'Sync Complete',
          description: result.data?.message || 'Course manifests synced successfully',
        });
      } else {
        toast({
          title: 'Sync Failed',
          description: 'Some courses failed to sync',
          variant: 'destructive',
        });
      }
    } catch (error) {
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
            Populate the content_manifest column in the database from manifest.json files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSync} disabled={syncing}>
            {syncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {syncing ? 'Syncing...' : 'Sync All Courses'}
          </Button>

          {result && (
            <div className="space-y-2">
              {result.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{result.data.message}</span>
                  </div>
                  {result.data.results?.success?.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Successfully synced:</p>
                      <ul className="list-disc list-inside pl-4">
                        {result.data.results.success.map((slug: string) => (
                          <li key={slug}>{slug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.data.results?.failed?.length > 0 && (
                    <div className="text-sm text-destructive">
                      <p className="font-medium">Failed to sync:</p>
                      <ul className="list-disc list-inside pl-4">
                        {result.data.results.failed.map((item: any) => (
                          <li key={item.slug}>
                            {item.slug}: {item.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Sync failed: {result.error?.message}</span>
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
