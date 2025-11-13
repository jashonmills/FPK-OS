import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MigrationResult {
  success: boolean;
  migrated: number;
  skipped: number;
  failed: number;
  errors?: Array<{ file_name: string; error: string }>;
}

interface LegacyDataMigrationPanelProps {
  familyId: string;
}

export function LegacyDataMigrationPanel({ familyId }: LegacyDataMigrationPanelProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [legacyDocsCount, setLegacyDocsCount] = useState<number | null>(null);

  // Check for legacy documents on mount
  const checkLegacyDocs = async () => {
    try {
      const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', familyId);

      if (error) throw error;
      setLegacyDocsCount(count || 0);
    } catch (error) {
      console.error('Error checking legacy documents:', error);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    const toastId = toast.loading("🔄 Migrating legacy documents to Project Bedrock...");

    try {
      console.log('🚀 Starting migration for family:', familyId);
      const { data, error } = await supabase.functions.invoke("migrate-to-bedrock", {
        body: { familyId },
      });

      console.log('📊 Migration response:', { data, error });

      if (error) throw error;

      setMigrationResult(data);

      if (data.success) {
        if (data.migrated > 0) {
          toast.success(
            `✅ Successfully migrated ${data.migrated} document(s) to Project Bedrock!`,
            { id: toastId, duration: 5000 }
          );
        } else if (data.skipped > 0) {
          toast.info(
            `ℹ️ All ${data.skipped} document(s) were already migrated`,
            { id: toastId, duration: 5000 }
          );
        } else {
          toast.info(
            "ℹ️ No documents found to migrate",
            { id: toastId, duration: 5000 }
          );
        }

        // Refresh legacy docs count
        await checkLegacyDocs();
      } else {
        throw new Error(data.message || 'Migration failed');
      }
    } catch (error: any) {
      console.error("Migration error:", error);
      toast.error(`❌ Migration failed: ${error.message}`, { id: toastId });
      setMigrationResult({
        success: false,
        migrated: 0,
        skipped: 0,
        failed: 0,
        errors: [{ file_name: 'Unknown', error: error.message }]
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Check for legacy docs on first render
  useState(() => {
    checkLegacyDocs();
  });

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Legacy Data Migration</CardTitle>
            <CardDescription>
              Migrate documents from the old system to Project Bedrock
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {legacyDocsCount !== null && legacyDocsCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Found <strong>{legacyDocsCount}</strong> document(s) in the legacy system that can be migrated.
            </AlertDescription>
          </Alert>
        )}

        {migrationResult && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <h4 className="font-semibold text-sm">Migration Results:</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Migrated: <strong>{migrationResult.migrated}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>Skipped: <strong>{migrationResult.skipped}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Failed: <strong>{migrationResult.failed}</strong></span>
              </div>
            </div>

            {migrationResult.errors && migrationResult.errors.length > 0 && (
              <div className="mt-3 space-y-2">
                <h5 className="font-semibold text-sm text-destructive">Errors:</h5>
                {migrationResult.errors.map((err, idx) => (
                  <div key={idx} className="text-xs p-2 rounded bg-destructive/10 text-destructive">
                    <strong>{err.file_name}:</strong> {err.error}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            This will copy documents to the new system without deleting the originals
          </div>
          <Button
            onClick={handleMigrate}
            disabled={isMigrating || legacyDocsCount === 0}
            size="lg"
            className="gap-2"
          >
            {isMigrating ? (
              <>
                <Database className="h-4 w-4 animate-pulse" />
                Migrating...
              </>
            ) : (
              <>
                Migrate Documents
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
