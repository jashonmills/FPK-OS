import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, RotateCcw, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface VersionHistoryProps {
  pageId: string;
  onRestore?: () => void;
}

export function VersionHistory({ pageId, onRestore }: VersionHistoryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [restoreVersionId, setRestoreVersionId] = useState<string | null>(null);

  const { data: versions, isLoading } = useQuery({
    queryKey: ["doc-page-versions", pageId],
    queryFn: async () => {
      const { data: versionData, error } = await supabase
        .from("doc_page_versions")
        .select("*")
        .eq("page_id", pageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Get unique editor IDs
      const editorIds = [...new Set(versionData?.map(v => v.editor_id) || [])];
      
      // Fetch profiles for all editors
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", editorIds);
      
      // Map profiles to versions
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return versionData?.map(v => ({
        ...v,
        editor: profileMap.get(v.editor_id)
      })) || [];
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions?.find((v) => v.id === versionId);
      if (!version) throw new Error("Version not found");

      const { error } = await supabase
        .from("doc_pages")
        .update({ content: version.content })
        .eq("id", pageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doc-page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["doc-page-versions", pageId] });
      toast({
        title: "Version restored",
        description: "The page has been restored to the selected version.",
      });
      onRestore?.();
      setRestoreVersionId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to restore version",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading version history...
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="p-4 text-center">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">No version history yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Versions are created automatically when you edit
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-4 space-y-3">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {version.editor?.full_name || "Unknown"}
                  </span>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                {index !== 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRestoreVersionId(version.id)}
                    className="h-7 px-2"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(version.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {version.version_notes && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-2">
                  {version.version_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog
        open={!!restoreVersionId}
        onOpenChange={(open) => !open && setRestoreVersionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current page content with the selected
              version. The current version will be preserved in the history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restoreVersionId && restoreMutation.mutate(restoreVersionId)}
            >
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
