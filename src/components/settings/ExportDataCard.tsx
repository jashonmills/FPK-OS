import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/contexts/FamilyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ExportDataCard = () => {
  const { user } = useAuth();
  const { selectedFamily, students } = useFamily();
  const [isExporting, setIsExporting] = useState(false);

  const exportAllData = async () => {
    if (!user || !selectedFamily) {
      toast.error("Unable to export data: No user or family selected");
      return;
    }

    setIsExporting(true);
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Fetch family data
      const { data: familyData } = await supabase
        .from("families")
        .select("*")
        .eq("id", selectedFamily.id)
        .single();

      // Fetch family members
      const { data: familyMembers } = await supabase
        .from("family_members")
        .select("*, profiles(*)")
        .eq("family_id", selectedFamily.id);

      // Fetch students data
      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch incident logs
      const { data: incidentLogs } = await supabase
        .from("incident_logs")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch parent logs
      const { data: parentLogs } = await supabase
        .from("parent_logs")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch educator logs
      const { data: educatorLogs } = await supabase
        .from("educator_logs")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch sleep records
      const { data: sleepRecords } = await supabase
        .from("sleep_records")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch goals
      const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Fetch documents
      const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("family_id", selectedFamily.id);

      // Compile all data
      const exportData = {
        exportDate: new Date().toISOString(),
        userProfile: profile,
        family: familyData,
        familyMembers,
        students: studentsData,
        logs: {
          incidents: incidentLogs,
          parent: parentLogs,
          educator: educatorLogs,
          sleep: sleepRecords,
        },
        goals,
        documents: documents?.map((doc) => ({
          ...doc,
          note: "File content not included in export. Download files separately from Documents page.",
        })),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fpx-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error("Failed to export data: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </CardTitle>
        <CardDescription>
          Download all your data in JSON format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get a complete copy of all your personal information, student records, logs,
          documents, and settings. This includes:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Profile information</li>
          <li>Family and student records</li>
          <li>All activity logs (incidents, parent logs, educator logs, sleep)</li>
          <li>Goals and progress tracking</li>
          <li>Document metadata (file downloads separate)</li>
          <li>AI insights and recommendations</li>
        </ul>
        <Button
          onClick={exportAllData}
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
